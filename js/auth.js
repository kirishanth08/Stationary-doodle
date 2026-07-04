/**
 * Doodle Desk — User Authentication & Sessions (LocalStorage)
 */
'use strict';

const DEFAULT_USERS = [
  {
    name: 'Customer',
    email: 'customer@doodle.com',
    phone: '9876543210',
    password: 'Customer@123',
    address: '123 Main Street, Springfield, IL 62701',
    orders: []
  },
  {
    name: 'Admin',
    email: 'admin@doodle.com',
    phone: '9876543211',
    password: 'Admin@123',
    address: 'Admin Office',
    orders: [],
    role: 'admin'
  }
];

// Initialize users database in LocalStorage
if (!localStorage.getItem('doodle_users')) {
  localStorage.setItem('doodle_users', JSON.stringify(DEFAULT_USERS));
} else {
  const savedUsers = JSON.parse(localStorage.getItem('doodle_users')) || [];
  DEFAULT_USERS.forEach(defaultUser => {
    if (!savedUsers.some(user => user.email.toLowerCase() === defaultUser.email.toLowerCase())) {
      savedUsers.push(defaultUser);
    }
  });
  localStorage.setItem('doodle_users', JSON.stringify(savedUsers));
}

window.DoodleAuth = {
  getUsers() {
    return JSON.parse(localStorage.getItem('doodle_users')) || DEFAULT_USERS;
  },

  saveUsers(users) {
    localStorage.setItem('doodle_users', JSON.stringify(users));
  },

  getCurrentUser() {
    const session = localStorage.getItem('user_session');
    if (!session) return null;
    const sessionData = JSON.parse(session);
    // Refresh user data from registered list to get latest updates
    const users = this.getUsers();
    return users.find(u => u.email === sessionData.email) || sessionData;
  },

  register(name, email, phone, password) {
    const users = this.getUsers();
    const emailLower = email.toLowerCase().trim();

    if (users.some(u => u.email.toLowerCase() === emailLower)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      name: name.trim(),
      email: emailLower,
      phone: phone.trim(),
      password: password,
      address: '',
      orders: []
    };

    users.push(newUser);
    this.saveUsers(users);
    return { success: true, message: 'Registration successful! Redirecting to login...' };
  },

  login(email, password, rememberMe) {
    const users = this.getUsers();
    const emailLower = email.toLowerCase().trim();

    const user = users.find(u => u.email.toLowerCase() === emailLower && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Set session (omit password for basic security)
    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.removeItem('admin_session');
    localStorage.setItem('user_session', JSON.stringify(sessionUser));

    if (rememberMe) {
      localStorage.setItem('doodle_remember_me', emailLower);
    } else {
      localStorage.removeItem('doodle_remember_me');
    }

    return { success: true, message: 'Login successful! Redirecting...' };
  },

  logout() {
    localStorage.removeItem('user_session');
    window.location.href = 'user-login.html';
  },

  resetPassword(email) {
    const users = this.getUsers();
    const emailLower = email.toLowerCase().trim();
    const userExists = users.some(u => u.email.toLowerCase() === emailLower);

    if (!userExists) {
      return { success: false, message: 'This email is not registered with Doodle Desk.' };
    }

    return { success: true, message: 'A password reset link has been sent to your email (simulated).' };
  },

  updateProfile(name, phone, address) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    const users = this.getUsers();
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx > -1) {
      users[idx].name = name.trim();
      users[idx].phone = phone.trim();
      users[idx].address = address.trim();
      this.saveUsers(users);

      // Update session info
      const updatedSession = { ...users[idx] };
      delete updatedSession.password;
      localStorage.setItem('user_session', JSON.stringify(updatedSession));
      return true;
    }
    return false;
  },

  changePassword(oldPassword, newPassword) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'No active session.' };

    const users = this.getUsers();
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx > -1) {
      if (users[idx].password !== oldPassword) {
        return { success: false, message: 'Incorrect current password.' };
      }
      users[idx].password = newPassword;
      this.saveUsers(users);
      return { success: true, message: 'Password updated successfully!' };
    }
    return { success: false, message: 'User not found.' };
  },

  injectNavbarUserButton() {
    const navActions = document.querySelector('.navbar-actions');
    if (!navActions) return;

    // Check if user button already exists
    if (document.getElementById('navbar-user-btn')) return;

    const currentUser = this.getCurrentUser();
    const userBtn = document.createElement('a');
    userBtn.id = 'navbar-user-btn';
    userBtn.className = 'btn-icon';
    userBtn.style.position = 'relative';

    if (currentUser) {
      userBtn.href = 'user-dashboard.html';
      userBtn.setAttribute('aria-label', `Dashboard (${currentUser.name})`);
      userBtn.innerHTML = `<i class="fas fa-user-circle" style="color: var(--color-primary) !important;"></i><span class="d-none d-lg-inline ms-1 small fw-bold text-dark" style="font-size:0.75rem;">Dashboard</span>`;
    } else {
      userBtn.href = 'user-login.html';
      userBtn.setAttribute('aria-label', 'Login');
      userBtn.innerHTML = `<i class="far fa-user"></i>`;
    }

    // Insert user button before the theme toggle button if it exists, otherwise append
    const themeToggle = navActions.querySelector('.theme-toggle');
    if (themeToggle) {
      navActions.insertBefore(userBtn, themeToggle);
    } else {
      navActions.appendChild(userBtn);
    }
  },

  protectDashboard() {
    if (window.location.pathname.includes('user-dashboard.html')) {
      if (!this.getCurrentUser()) {
        window.location.href = 'user-login.html';
      }
    }
  }
};

// Autoload
document.addEventListener('DOMContentLoaded', () => {
  window.DoodleAuth.injectNavbarUserButton();
  window.DoodleAuth.protectDashboard();
});
