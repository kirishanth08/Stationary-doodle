/**
 * Doodle Desk — Form Validation & Password Strength Indicator
 */
'use strict';

window.DoodleValidation = {
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  validateMobile(phone) {
    // Allows 10 to 15 digits, spaces, dashes, parentheses and optional leading plus
    const re = /^\+?[\d\s\-()]{10,15}$/;
    return re.test(phone);
  },

  checkPasswordStrength(password) {
    let score = 0;
    if (!password) return { score: 0, label: 'Very Weak', color: 'danger', percent: 5 };

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

    let label = 'Very Weak';
    let color = 'danger'; // Bootstrap colors
    let percent = 20;

    switch (score) {
      case 1:
        label = 'Weak';
        color = 'warning';
        percent = 40;
        break;
      case 2:
        label = 'Medium';
        color = 'info';
        percent = 60;
        break;
      case 3:
        label = 'Strong';
        color = 'primary';
        percent = 80;
        break;
      case 4:
        label = 'Very Strong';
        color = 'success';
        percent = 100;
        break;
    }

    return { score, label, color, percent };
  },

  setupRealTimeValidation(formSelector, fieldsConfig) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.setAttribute('novalidate', 'true');

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateInput(input, fieldsConfig));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
          this.validateInput(input, fieldsConfig);
        }
      });
    });

    form.addEventListener('submit', event => {
      let isFormValid = true;
      inputs.forEach(input => {
        if (!this.validateInput(input, fieldsConfig)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  },

  validateInput(input, config) {
    const value = input.value.trim();
    let isValid = true;
    let errorMsg = '';

    const rules = config[input.id] || config[input.name] || {};

    if (rules.required && !value) {
      isValid = false;
      errorMsg = 'This field is required.';
    } else if (value) {
      if (rules.email && !this.validateEmail(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address.';
      }
      if (rules.mobile && !this.validateMobile(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid mobile number (10-15 digits).';
      }
      if (rules.minlength && value.length < rules.minlength) {
        isValid = false;
        errorMsg = `Must be at least ${rules.minlength} characters long.`;
      }
      if (rules.matchesField) {
        const otherInput = document.getElementById(rules.matchesField);
        if (otherInput && value !== otherInput.value.trim()) {
          isValid = false;
          errorMsg = 'Passwords do not match.';
        }
      }
    }

    // Toggle validation feedback
    input.classList.toggle('is-valid', isValid && value.length > 0);
    input.classList.toggle('is-invalid', !isValid);

    // Update feedback container text if it exists
    let feedback = input.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = input.parentNode.parentNode.querySelector('.invalid-feedback');
    }
    if (feedback && errorMsg) {
      feedback.textContent = errorMsg;
    }

    return isValid;
  }
};
