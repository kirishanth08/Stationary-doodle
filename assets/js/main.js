/**
 * Stationery Store — Main JavaScript
 * Assignment 08 — Dark Mode, Form Validation, Bundle Calculator
 * ES6+ | No console.log()
 */

'use strict';

// Sequential loader for Doodle Desk modular JS files
(function () {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes('user-login.html') || currentPath.includes('admin-login.html');
  const isSignupPage = currentPath.includes('user-signup.html') || currentPath.includes('admin-signup.html');
  const isDashboard = currentPath.includes('user-dashboard.html') || currentPath.includes('admin-dashboard.html');
  const isProductsPage = currentPath.includes('products.html') || currentPath.includes('product-details.html');

  if (!window.DoodleAuth && !isLoginPage && !isSignupPage && !isDashboard && !isProductsPage) {
    const scripts = [
      '../js/products.js',
      '../js/theme.js',
      '../js/validation.js',
      '../js/auth.js',
      '../js/cart.js',
      '../js/search.js',
      '../js/navbar.js',
      '../js/footer.js'
    ];
    let index = 0;
    function loadNext() {
      if (index >= scripts.length) return;
      const s = document.createElement('script');
      s.src = scripts[index++];
      s.onload = loadNext;
      s.onerror = loadNext;
      document.head.appendChild(s);
    }
    loadNext();
  }
})();


window.STORE_PRODUCTS = window.STORE_PRODUCTS || [
  // --- WRITING SUPPLIES (5 items) ---
  { n: 'G2 Premium Gel Pens (12 Pack)', b: 'Pilot', d: '-10%', o: '14.99', p: '12.99', r: '256', rt: 4.8, cat: 'Writing Supplies', instock: true, color: 'Blue', i: '../assets/images/unsplash_48213b4e03441d49d10b4016e31be545.webp', s: 1 },
  { n: 'Jotter Ballpoint Pen', b: 'Parker', d: '', o: '', p: '19.99', r: '174', rt: 4.6, cat: 'Writing Supplies', instock: true, color: 'Gold', i: '../assets/images/unsplash_bdd164504b418ea4351ffa2c3cf0d659.webp', s: 0 },
  { n: 'Triplus Fineliner Pens (20 Pack)', b: 'Staedtler', d: '-12%', o: '28.99', p: '24.99', r: '142', rt: 4.7, cat: 'Writing Supplies', instock: true, color: 'Blue', i: '../assets/images/unsplash_1d6758a26a88fa7377c79f4828177cd8.webp', s: 1 },
  { n: '045 Fine Ballpoint Pens (50 Pack)', b: 'Reynolds', d: '-10%', o: '10.99', p: '9.89', r: '115', rt: 4.4, cat: 'Writing Supplies', instock: true, color: 'Black', i: '../assets/images/unsplash_48213b4e03441d49d10b4016e31be545.webp', s: 1 },
  { n: 'Grip 2011 Mechanical Pencil', b: 'Faber-Castell', d: '', o: '', p: '11.49', r: '82', rt: 4.5, cat: 'Writing Supplies', instock: true, color: 'Blue', i: '../assets/images/unsplash_cd39c3553a3cea19c284942071202ef6.webp', s: 0 },

  // --- NOTEBOOKS & JOURNALS (5 items) ---
  { n: 'Premium Hardbound Notebook', b: 'Classmate', d: '-15%', o: '22.99', p: '18.99', r: '128', rt: 4.5, cat: 'Notebooks & Journals', instock: true, color: 'Blue', i: '../assets/images/unsplash_b674419c2dcc92660df1bfd0a8c9d724.webp', s: 1 },
  { n: 'Campus Notebooks (5 Pack)', b: 'Kokuyo', d: '', o: '', p: '15.99', r: '67', rt: 4.8, cat: 'Notebooks & Journals', instock: true, color: 'Pink', i: '../assets/images/unsplash_02b2c8ba4aa1a5d2cf30747d7212aa89.webp', s: 0 },
  { n: 'Executive Leather Journal', b: 'Parker', d: '', o: '', p: '34.99', r: '94', rt: 4.7, cat: 'Notebooks & Journals', instock: true, color: 'Black', i: '../assets/images/unsplash_b674419c2dcc92660df1bfd0a8c9d724.webp', s: 0 },
  { n: 'Creative Sketch Journal', b: 'Faber-Castell', d: '', o: '', p: '12.99', r: '53', rt: 4.3, cat: 'Notebooks & Journals', instock: true, color: 'Gold', i: '../assets/images/unsplash_4a43eee4cd6d4e537b99b1f7d3ddd46d.webp', s: 0 },
  { n: 'Lumocolor Bullet Journal', b: 'Staedtler', d: '', o: '', p: '14.50', r: '71', rt: 4.4, cat: 'Notebooks & Journals', instock: false, color: 'Red', i: '../assets/images/unsplash_5dfc6890c274c6bd85632d7d407963d1.webp', s: 0 },

  // --- ART & CRAFT (5 items) ---
  { n: 'Polychromos Color Pencils (36)', b: 'Faber-Castell', d: '-8%', o: '16.99', p: '15.99', r: '203', rt: 4.9, cat: 'Art & Craft', instock: true, color: 'Pink', i: '../assets/images/unsplash_bde515ec3bf4b29b822f5aeb864b3b60.webp', s: 1 },
  { n: 'Artists Acrylic Color Set', b: 'Camel', d: '', o: '', p: '18.50', r: '89', rt: 4.6, cat: 'Art & Craft', instock: true, color: 'Gold', i: '../assets/images/unsplash_5446f9a3b12484de4b44b95501b21170.webp', s: 0 },
  { n: 'Noris Club Oil Pastels (24)', b: 'Staedtler', d: '', o: '', p: '9.99', r: '36', rt: 4.5, cat: 'Art & Craft', instock: true, color: 'Red', i: '../assets/images/unsplash_5446f9a3b12484de4b44b95501b21170.webp', s: 0 },
  { n: 'Premium Water Color Cake Set', b: 'Camel', d: '', o: '', p: '7.49', r: '77', rt: 4.2, cat: 'Art & Craft', instock: true, color: 'Pink', i: '../assets/images/unsplash_50552aa78b2a45a5650f2fc53f30cc2d.webp', s: 0 },
  { n: 'Art & Craft Drawing Board Set', b: 'Classmate', d: '', o: '', p: '14.99', r: '42', rt: 4.1, cat: 'Art & Craft', instock: true, color: 'Green', i: '../assets/images/unsplash_a0068be9bfb5583cb8cf321f72866a01.webp', s: 0 },

  // --- SCHOOL ESSENTIALS (5 items) ---
  { n: 'Geometry Premium Box', b: 'Classmate', d: '', o: '', p: '6.99', r: '56', rt: 4.5, cat: 'School Essentials', instock: true, color: 'Blue', i: '../assets/images/unsplash_bde515ec3bf4b29b822f5aeb864b3b60.webp', s: 0 },
  { n: 'School Compass & Geometry Set', b: 'Staedtler', d: '', o: '', p: '12.49', r: '44', rt: 4.6, cat: 'School Essentials', instock: true, color: 'Blue', i: '../assets/images/unsplash_bde515ec3bf4b29b822f5aeb864b3b60.webp', s: 0 },
  { n: 'Non-Toxic Glue Slime Kit', b: 'Camel', d: '', o: '', p: '8.99', r: '29', rt: 4.3, cat: 'School Essentials', instock: true, color: 'Pink', i: '../assets/images/unsplash_50552aa78b2a45a5650f2fc53f30cc2d.webp', s: 0 },
  { n: 'Frixion Erasable Highlighters', b: 'Pilot', d: '', o: '', p: '9.49', r: '118', rt: 4.7, cat: 'School Essentials', instock: true, color: 'Green', i: '../assets/images/unsplash_1d6758a26a88fa7377c79f4828177cd8.webp', s: 0 },
  { n: 'School Writing Kit', b: 'Reynolds', d: '', o: '', p: '4.99', r: '51', rt: 4.2, cat: 'School Essentials', instock: true, color: 'Red', i: '../assets/images/unsplash_bde515ec3bf4b29b822f5aeb864b3b60.webp', s: 0 },

  // --- OFFICE SUPPLIES (5 items) ---
  { n: 'Desktop Document Organizer', b: 'Kokuyo', d: '-20%', o: '39.99', p: '31.99', r: '67', rt: 4.7, cat: 'Office Supplies', instock: true, color: 'Black', i: '../assets/images/unsplash_4a43eee4cd6d4e537b99b1f7d3ddd46d.webp', s: 1 },
  { n: 'IM Monochrome Ballpoint Pen', b: 'Parker', d: '', o: '', p: '26.99', r: '48', rt: 4.6, cat: 'Office Supplies', instock: true, color: 'Black', i: '../assets/images/unsplash_48213b4e03441d49d10b4016e31be545.webp', s: 0 },
  { n: 'Custom Heritage Fountain Pen', b: 'Pilot', d: '', o: '', p: '135.00', r: '32', rt: 4.9, cat: 'Office Supplies', instock: true, color: 'Black', i: '../assets/images/unsplash_bdd164504b418ea4351ffa2c3cf0d659.webp', s: 0 },
  { n: 'Textliner 38 Highlighters', b: 'Faber-Castell', d: '', o: '', p: '8.50', r: '91', rt: 4.4, cat: 'Office Supplies', instock: true, color: 'Green', i: '../assets/images/unsplash_1d6758a26a88fa7377c79f4828177cd8.webp', s: 0 },
  { n: 'NeoCritz Stand Pencil Case', b: 'Kokuyo', d: '', o: '', p: '13.99', r: '104', rt: 4.5, cat: 'Office Supplies', instock: true, color: 'Blue', i: '../assets/images/unsplash_1d6758a26a88fa7377c79f4828177cd8.webp', s: 0 },

  // --- STUDY TOOLS (5 items) ---
  { n: 'fx-991EX Scientific Calculator', b: 'Casio', d: '', o: '', p: '22.99', r: '98', rt: 4.8, cat: 'Study Tools', instock: true, color: 'Black', i: '../assets/images/unsplash_bee477d38dbec8cf9ab15e233db88d6a.webp', s: 0 },
  { n: 'fx-CG50 Graphic Calculator', b: 'Casio', d: '', o: '', p: '99.99', r: '41', rt: 4.9, cat: 'Study Tools', instock: true, color: 'Black', i: '../assets/images/unsplash_fc94cc91501270bd6c75eb75cad93fc6.webp', s: 0 },
  { n: 'Mars Plastic Eraser (4 Pack)', b: 'Staedtler', d: '', o: '', p: '5.49', r: '152', rt: 4.7, cat: 'Study Tools', instock: true, color: 'Pink', i: '../assets/images/unsplash_bde515ec3bf4b29b822f5aeb864b3b60.webp', s: 0 },
  { n: 'Campus Clip Connector Binder', b: 'Kokuyo', d: '', o: '', p: '9.99', r: '63', rt: 4.4, cat: 'Study Tools', instock: true, color: 'Green', i: '../assets/images/unsplash_50552aa78b2a45a5650f2fc53f30cc2d.webp', s: 0 },
  { n: 'Study Flash Cards (100 Pack)', b: 'Classmate', d: '', o: '', p: '4.49', r: '78', rt: 4.3, cat: 'Study Tools', instock: true, color: 'Gold', i: '../assets/images/unsplash_4a43eee4cd6d4e537b99b1f7d3ddd46d.webp', s: 0 },

  // --- GIFT COLLECTIONS (5 items) ---
  { n: 'Sonnet Pen & Notebook Gift Set', b: 'Parker', d: '', o: '', p: '110.00', r: '24', rt: 4.9, cat: 'Gift Collections', instock: true, color: 'Gold', i: '../assets/images/unsplash_b674419c2dcc92660df1bfd0a8c9d724.webp', s: 0 },
  { n: 'Albrecht Dürer Pencil Gift Box', b: 'Faber-Castell', d: '', o: '', p: '85.00', r: '17', rt: 4.8, cat: 'Gift Collections', instock: true, color: 'Red', i: '../assets/images/unsplash_5446f9a3b12484de4b44b95501b21170.webp', s: 0 },
  { n: 'MR Retro Pop Fountain Pen Gift', b: 'Pilot', d: '', o: '', p: '24.99', r: '59', rt: 4.7, cat: 'Gift Collections', instock: true, color: 'Gold', i: '../assets/images/unsplash_48213b4e03441d49d10b4016e31be545.webp', s: 0 },
  { n: 'Premium Calligraphy Gift Set', b: 'Staedtler', d: '', o: '', p: '39.99', r: '31', rt: 4.6, cat: 'Gift Collections', instock: true, color: 'Blue', i: '../assets/images/unsplash_1d6758a26a88fa7377c79f4828177cd8.webp', s: 0 },
  { n: 'IM Fountain & Ballpoint Twin Set', b: 'Parker', d: '', o: '', p: '48.00', r: '27', rt: 4.7, cat: 'Gift Collections', instock: true, color: 'Black', i: '../assets/images/unsplash_bdd164504b418ea4351ffa2c3cf0d659.webp', s: 0 }
];

/* ============================================
   DOM Ready Handler
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRtlToggle();
  initFormValidation();
  initBundleCalculator();
  initHomeBundleButtons();
  initCountdownTimer();
  initQuantityPicker();
  initActiveNavLink();
  initNavbarScroll();
  initStatCounters();
  initRevealOnScroll();
  initSearchModal();
  initPriceSlider();
  initBackToTop();
  initProductFilters();
  initCartActions();
  initPageLoader();
  initTabs();

  // Sync counts on load
  updateCartCount();
});

/* ============================================
   Dark / Light Mode Toggle
   Persists preference in localStorage
   ============================================ */
function initThemeToggle() {
  const savedTheme = localStorage.getItem('stationery-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  const toggleBtns = document.querySelectorAll('.theme-toggle');
  if (!toggleBtns.length) return;

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('stationery-theme', next);
    const label = next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    toggleBtns.forEach((btn) => btn.setAttribute('aria-label', label));
  };

  toggleBtns.forEach((btn) => btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleTheme();
  }));
}

/* ============================================
   RTL Toggle
   Switches document direction for RTL support
   ============================================ */
function initRtlToggle() {
  const savedDir = localStorage.getItem('stationery-dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);

  const toggleBtns = document.querySelectorAll('.rtl-toggle');
  if (!toggleBtns.length) return;

  const updateButtons = (dir) => {
    const label = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    const text = dir === 'rtl' ? 'LTR' : 'RTL';
    toggleBtns.forEach((btn) => {
      btn.setAttribute('aria-label', label);
      const textEl = btn.querySelector('.rtl-toggle-text');
      if (textEl) {
        textEl.textContent = text;
      }
      if (dir === 'rtl') {
        btn.classList.add('rtl-active');
      } else {
        btn.classList.remove('rtl-active');
      }
    });
  };

  // Sync on load
  updateButtons(savedDir);

  const toggleDir = () => {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', next);
    localStorage.setItem('stationery-dir', next);
    updateButtons(next);
  };

  toggleBtns.forEach((btn) => btn.addEventListener('click', toggleDir));
}

/* ============================================
   Form Validation
   Contact & Bulk Order forms (Formspree-ready)
   ============================================ */
function initFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Redirect all newsletter/subscribe forms
      if (
        !form.id ||
        form.querySelector('button[type="submit"]')?.textContent.trim().toLowerCase().includes("subscribe")
      ) {
        window.location.href = "404.html";
        return;
      }

      if (!form.checkValidity()) {
        event.stopPropagation();
      } else {

        // Contact Form
        if (form.id === "contactForm") {
          alert("Your message has been sent successfully!");
        }

        // Bulk Order Form
        else if (form.id === "bulkOrderForm") {
          alert("Your quote request has been submitted successfully!");
        }

        // Blog Comment Form
        else if (form.id === "commentForm") {
          alert("Your comment has been posted successfully!");
        }

        form.reset();
        form.classList.remove("was-validated");
      }

      form.classList.add("was-validated");
    });

    /* Real-time validation on blur */
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
          validateField(input);
        }
      });
    });
  });
}

/**
 * Validates a single form field
 * @param {HTMLElement} field - Input element to validate
 */
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;

  if (field.hasAttribute('required') && !value) {
    isValid = false;
  }

  if (field.type === 'email' && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailPattern.test(value);
  }

  if (field.type === 'tel' && value) {
    const phonePattern = /^[\d\s\-+()]{7,20}$/;
    isValid = phonePattern.test(value);
  }

  if (field.hasAttribute('minlength')) {
    const minLen = parseInt(field.getAttribute('minlength'), 10);
    if (value.length < minLen) isValid = false;
  }

  field.classList.toggle('is-valid', isValid && value.length > 0);
  field.classList.toggle('is-invalid', !isValid);

  return isValid;
}

/* ============================================
   Bundle Price Calculator
   "Build Your Own Bundle" section on bundles.html
   ============================================ */
function initBundleCalculator() {
  const checkboxes = document.querySelectorAll('.bundle-item-checkbox');
  const totalDisplay = document.getElementById('bundleTotal');

  if (!checkboxes.length || !totalDisplay) return;

  const updateTotal = () => {
    let total = 0;
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        total += parseFloat(cb.dataset.price) || 0;
      }
    });
    totalDisplay.textContent = `$${total.toFixed(2)}`;
  };

  checkboxes.forEach((cb) => {
    cb.addEventListener('change', updateTotal);
  });

  updateTotal();
}

function initHomeBundleButtons() {
  document.querySelectorAll('.bundle-add-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.bundleId;
      const name = btn.dataset.bundleName || 'Bundle';
      const price = parseFloat(btn.dataset.bundlePrice) || 0;
      const image = btn.dataset.bundleImage || '';
      if (!id) return;

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.quantity = Math.min((existing.quantity || 1) + 1, 99);
      } else {
        cart.push({ id, name, price, image, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      showToast(`Added ${name} to cart`, 'success');
    });
  });
}

/* ============================================
   Countdown Timer
   Coming Soon page countdown
   ============================================ */
function initCountdownTimer() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  /* Target date: 30 days from page load */
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');

  const updateCountdown = () => {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ============================================
   Quantity Picker
   Product detail page increment/decrement
   ============================================ */
function initQuantityPicker() {
  const minusBtn = document.getElementById('qtyMinus');
  const plusBtn = document.getElementById('qtyPlus');
  const qtyInput = document.getElementById('qtyInput');

  if (!minusBtn || !plusBtn || !qtyInput) return;

  minusBtn.addEventListener('click', () => {
    const current = parseInt(qtyInput.value, 10) || 1;
    if (current > 1) qtyInput.value = current - 1;
  });

  plusBtn.addEventListener('click', () => {
    const current = parseInt(qtyInput.value, 10) || 1;
    if (current < 99) qtyInput.value = current + 1;
  });
}

/* ============================================
   Active Navigation Link
   Highlights current page in navbar
   ============================================ */
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-stationery .nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function initNavbarScroll() {
  const nav = document.querySelector('.navbar-stationery');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('navbar-scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

function initSearchModal() {
  const toggles = document.querySelectorAll('.search-toggle');
  const modalEl = document.getElementById('searchModal');
  if (!toggles.length || !modalEl) return;

  const modal = new bootstrap.Modal(modalEl);
  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.show();
      setTimeout(() => {
        const input = modalEl.querySelector('input[type="search"]');
        if (input) input.focus();
      }, 300);
    });
  });
}

function initWishlistToggle() {
  document.querySelectorAll('.product-card .wishlist-btn').forEach((btn) => {
    const card = btn.closest('.product-card');
    if (!card) return;

    const productName = card.querySelector('.card-title a')?.textContent || 'Product';
    const productId = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if in wishlist on load
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlist.some(item => item.id === productId)) {
      btn.classList.add('wishlist-active');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.remove('far');
        icon.classList.add('fas');
      }
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      const index = wishlist.findIndex(item => item.id === productId);

      if (index > -1) {
        wishlist.splice(index, 1);
        btn.classList.remove('wishlist-active');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.classList.remove('fas');
          icon.classList.add('far');
        }
        showToast('Removed from wishlist', 'info');
      } else {
        const productPrice = parseFloat(card.dataset.price) || 0;
        const productImage = card.querySelector('img')?.src || '';
        const productBrand = card.querySelector('.badge-brand')?.textContent || '';
        wishlist.push({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          brand: productBrand
        });
        btn.classList.add('wishlist-active');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.classList.remove('far');
          icon.classList.add('fas');
        }
        showToast('Added to wishlist', 'success');
      }

      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    });
  });
}

window.initWishlistToggle = initWishlistToggle;

function initPriceSlider() {
  const slider = document.getElementById('priceRange');
  const display = document.getElementById('priceRangeValue');
  if (!slider || !display) return;

  const update = () => {
    display.textContent = `$0 – $${slider.value}`;
  };

  slider.addEventListener('input', update);
  update();
}

function initBackToTop() {
  let btn = document.querySelector('.back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(btn);
  }

  const toggle = () => btn.classList.toggle('visible', window.scrollY > 500);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

function initProductFilters() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const gridItems = Array.from(grid.children);
  const sortSelect = document.querySelector('[aria-label="Sort products"]');
  const status = document.getElementById('products-grid-heading');

  const getCheckedFilters = (headingText) => {
    const groups = Array.from(document.querySelectorAll('.filter-group'));
    const group = groups.find(g => {
      const h6 = g.querySelector('h6');
      return h6 && h6.textContent.trim().toLowerCase() === headingText.toLowerCase();
    });
    if (!group) return [];
    return Array.from(group.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.parentNode.textContent.trim());
  };

  const applyFilters = () => {
    const selectedCategories = getCheckedFilters('Categories');
    const selectedBrands = getCheckedFilters('Brands');
    const selectedRatings = getCheckedFilters('Ratings');
    const selectedAvailability = getCheckedFilters('Availability');

    const slider = document.getElementById('priceRange');
    const maxPrice = slider ? parseFloat(slider.value) : 100;

    const visibleItems = gridItems.filter(item => {
      const card = item.querySelector('.product-card');
      if (!card) return false;

      const category = card.dataset.category || '';
      const brand = card.dataset.brand || '';
      const price = parseFloat(card.dataset.price) || 0;
      const rating = parseFloat(card.dataset.rating) || 0;
      const instock = card.dataset.instock === 'true';

      // Price filter
      if (price > maxPrice) return false;

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(category)) return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(brand)) return false;

      // Rating filter
      if (selectedRatings.length > 0) {
        const minAllowedRating = Math.min(...selectedRatings.map(r => parseFloat(r)));
        if (rating < minAllowedRating) return false;
      }

      // Availability filter
      if (selectedAvailability.length > 0) {
        const showInStock = selectedAvailability.includes('In Stock');
        const showPreOrder = selectedAvailability.includes('Pre-Order');
        if (showInStock && !showPreOrder && !instock) return false;
        if (!showInStock && showPreOrder && instock) return false;
      }

      return true;
    });

    // Hide/show matching grid items
    gridItems.forEach(item => {
      item.style.display = 'none';
    });
    visibleItems.forEach(item => {
      item.style.display = 'block';
    });

    // Sort visible items
    if (sortSelect) {
      const val = sortSelect.value;
      if (val === 'Price: Low to High') {
        visibleItems.sort((a, b) => {
          const priceA = parseFloat(a.querySelector('.product-card')?.dataset.price) || 0;
          const priceB = parseFloat(b.querySelector('.product-card')?.dataset.price) || 0;
          return priceA - priceB;
        });
      } else if (val === 'Price: High to Low') {
        visibleItems.sort((a, b) => {
          const priceA = parseFloat(a.querySelector('.product-card')?.dataset.price) || 0;
          const priceB = parseFloat(b.querySelector('.product-card')?.dataset.price) || 0;
          return priceB - priceA;
        });
      }
    }

    // Re-append items in the correct sorted order
    grid.innerHTML = '';
    visibleItems.forEach(item => {
      grid.appendChild(item);
    });

    // Update counting info text
    if (status) {
      status.textContent = `Showing ${visibleItems.length} of ${gridItems.length} products`;
    }
  };

  // Bind Apply and Clear buttons
  const applyBtn = document.getElementById('btn-apply-filters');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyFilters);
  }

  const clearBtn = document.getElementById('btn-clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      // Uncheck checkboxes
      document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      // Reset priceRange slider
      const slider = document.getElementById('priceRange');
      if (slider) {
        slider.value = 150;
        slider.dispatchEvent(new Event('input'));
      }
      // Reset sort select
      if (sortSelect) {
        sortSelect.selectedIndex = 0;
      }

      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }

  // Handle query parameters (?category=... or ?brand=...)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const brandParam = urlParams.get('brand');

  if (categoryParam || brandParam) {
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
      const text = cb.parentNode.textContent.trim().toLowerCase();
      if (categoryParam && text === categoryParam.toLowerCase()) {
        cb.checked = true;
      }
      if (brandParam && text === brandParam.toLowerCase()) {
        cb.checked = true;
      }
    });
  }

  applyFilters();
}

function initCartActions() {
  document.querySelectorAll('.product-card .cart-add-btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const card = btn.closest('.product-card');
      if (!card) return;

      const productName = card.querySelector('.card-title a')?.textContent || 'Product';
      const productPrice = parseFloat(card.dataset.price) || 0;
      const productImage = card.querySelector('img')?.src || '';
      const productId = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingIndex = cart.findIndex(item => item.id === productId);

      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          quantity: 1,
          image: productImage
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      showToast(`Added ${productName} to cart`, 'success');
    });
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
  });
}

function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  document.querySelectorAll('.wishlist-count').forEach(el => {
    el.textContent = wishlist.length;
    el.style.display = wishlist.length > 0 ? 'inline-block' : 'none';
  });
}

window.updateCartCount = updateCartCount;
window.updateWishlistCount = updateWishlistCount;

window.addEventListener('storage', (event) => {
  if (event.key === 'cart') {
    updateCartCount();
  }
  if (event.key === 'wishlist') {
  }
});

function initPageLoader() {
  document.body.classList.remove('is-loading');
  window.addEventListener('load', () => {
    document.body.classList.remove('is-loading');
  });
}

function initTabs() {
  document.querySelectorAll('.blog-tabs .nav-link').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.blog-tabs .nav-link').forEach((entry) => entry.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

function showToast(message, type = 'success') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const notice = document.createElement('div');
  notice.className = `toast-notice ${type}`;
  notice.textContent = message;
  container.appendChild(notice);
  window.setTimeout(() => notice.remove(), 2200);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Export functions to window for dynamic grid re-binding
window.initCartActions = initCartActions;
window.initWishlistToggle = initWishlistToggle;

