/**
 * Doodle Desk — Shared Common Navbar Component
 */
'use strict';

window.DoodleNavbar = {
  render() {
    const nav = document.querySelector('.navbar-stationery');
    if (!nav) return;

    // Check login status
    let user = null;
    let admin = null;
    
    if (window.DoodleAuth) {
      user = window.DoodleAuth.getCurrentUser();
    }
    if (window.DoodleAdmin) {
      admin = window.DoodleAdmin.getCurrentAdmin();
    }

    // Determine current active page
    const pathname = window.location.pathname;
    const page = pathname.substring(pathname.lastIndexOf('/') + 1) || 'index.html';
    const adminPages = [
      'admin-dashboard.html',
      'admin-profile.html',
      'admin-products.html',
      'admin-users.html',
      'admin-orders.html',
      'admin-reports.html',
      'admin-settings.html'
    ];

    if (admin && adminPages.includes(page)) {
      this.renderAdmin(nav, admin, page);
      return;
    }
    
    const isHome = page === 'index.html' || page === '';
    const isAbout = page === 'about.html';
    const isCategories = page === 'categories.html';
    const isProducts = page === 'products.html' || page === 'product-details.html';
    const isBundles = page === 'bundles.html';
    const isBulk = page === 'bulk-orders.html';
    const isBlog = page === 'blog.html' || page === 'blog-details.html';
    const isContact = page === 'contact.html';

    // Build user account dropdown html
    let userDropdownHtml = '';
    if (admin) {
      userDropdownHtml = `
        <button class="btn-icon border-0" type="button" id="navUserDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="background: transparent;" aria-label="Admin settings">
          <i class="fas fa-user-shield text-primary" style="font-size: 1.25rem;"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="navUserDropdown" style="border: 1px solid var(--color-border); background-color: var(--color-card);">
          <li><h6 class="dropdown-header text-primary fw-bold">Admin Portal</h6></li>
          <li><span class="dropdown-item-text small text-muted">Signed in: ${admin.name}</span></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item small" href="admin-dashboard.html"><i class="fas fa-tachometer-alt me-2 text-primary"></i>Admin Dashboard</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item small text-danger" href="#" id="navLogoutAction"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
        </ul>
      `;
    } else if (user) {
      userDropdownHtml = `
        <button class="btn-icon border-0" type="button" id="navUserDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="background: transparent;" aria-label="Customer profile">
          <i class="fas fa-user-circle text-primary" style="font-size: 1.25rem;"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="navUserDropdown" style="border: 1px solid var(--color-border); background-color: var(--color-card);">
          <li><h6 class="dropdown-header text-primary fw-bold">Welcome, ${user.name}</h6></li>
          <li><span class="dropdown-item-text small text-muted">${user.email}</span></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item small" href="user-dashboard.html"><i class="fas fa-tachometer-alt me-2 text-primary"></i>My Dashboard</a></li>
          <li><a class="dropdown-item small" href="cart.html"><i class="fas fa-shopping-cart me-2 text-primary"></i>Shopping Cart</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item small text-danger" href="#" id="navLogoutAction"><i class="fas fa-sign-out-alt me-2"></i>Sign Out</a></li>
        </ul>
      `;
    } else {
      userDropdownHtml = `
        <button class="btn-icon border-0" type="button" id="navUserDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="background: transparent;" aria-label="Account options">
          <i class="far fa-user" style="font-size: 1.1rem;"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="navUserDropdown" style="border: 1px solid var(--color-border); background-color: var(--color-card);">
          <li><a class="dropdown-item small" href="user-login.html"><i class="fas fa-sign-in-alt me-2 text-primary"></i>User Login</a></li>
          <li><a class="dropdown-item small" href="user-signup.html"><i class="fas fa-user-plus me-2 text-primary"></i>User Sign Up</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item small" href="admin-login.html"><i class="fas fa-lock me-2 text-secondary"></i>Admin Login</a></li>
        </ul>
      `;
    }

    // Injected template
    nav.innerHTML = `
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
          <span class="brand-mark" aria-hidden="true">DD</span>
          <span class="brand-text">Doodle <span class="brand-accent">Desk</span></span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav mx-lg-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link ${isHome ? 'active' : ''}" ${isHome ? 'aria-current="page"' : ''} href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link ${isAbout ? 'active' : ''}" ${isAbout ? 'aria-current="page"' : ''} href="about.html">About</a></li>
            <li class="nav-item"><a class="nav-link ${isCategories ? 'active' : ''}" ${isCategories ? 'aria-current="page"' : ''} href="categories.html">Categories</a></li>
            <li class="nav-item"><a class="nav-link ${isProducts ? 'active' : ''}" ${isProducts ? 'aria-current="page"' : ''} href="products.html">Products</a></li>
            <li class="nav-item"><a class="nav-link ${isBundles ? 'active' : ''}" ${isBundles ? 'aria-current="page"' : ''} href="bundles.html">Bundles</a></li>
            <li class="nav-item"><a class="nav-link ${isBulk ? 'active' : ''}" ${isBulk ? 'aria-current="page"' : ''} href="bulk-orders.html">Bulk Orders</a></li>
            <li class="nav-item"><a class="nav-link ${isBlog ? 'active' : ''}" ${isBlog ? 'aria-current="page"' : ''} href="blog.html">Blog</a></li>
            <li class="nav-item"><a class="nav-link ${isContact ? 'active' : ''}" ${isContact ? 'aria-current="page"' : ''} href="contact.html">Contact</a></li>
          </ul>
          <div class="navbar-actions">
            <button class="btn-icon search-toggle" type="button" aria-label="Open search"><i class="fas fa-search" aria-hidden="true"></i></button>
            <a href="cart.html" class="btn-icon cart-btn" aria-label="Cart"><i class="fas fa-shopping-bag" aria-hidden="true"></i><span class="cart-count">0</span></a>
            
            <div class="dropdown d-inline-block" id="navbar-user-dropdown-wrapper">
              ${userDropdownHtml}
            </div>

            <button class="btn-icon theme-toggle" aria-label="Switch to dark mode" type="button">
              <i class="fas fa-moon" aria-hidden="true"></i>
              <i class="fas fa-sun" aria-hidden="true"></i>
            </button>
            <button class="btn-icon rtl-toggle" aria-label="Switch to RTL" type="button"><i class="fas fa-language" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>
    `;

    // Bind event listeners
    this.bindEvents();
    
    // Sync active states (theme, counts, dir)
    if (window.DoodleTheme) {
      window.DoodleTheme.applyTheme();
      window.DoodleTheme.applyDir();
    }
    if (window.DoodleCart) {
      window.DoodleCart.updateNavbarCounts();
    }
    if (window.DoodleWishlist) {
      window.DoodleWishlist.updateNavbarCounts();
      window.DoodleWishlist.initHeartStates();
    }
  },

  renderAdmin(nav, admin, page) {
    const isActive = target => page === target;

    nav.classList.add('navbar-admin');
    nav.innerHTML = `
      <div class="container-fluid px-4">
        <a class="navbar-brand d-flex align-items-center gap-2" href="admin-dashboard.html">
          <span class="brand-mark" aria-hidden="true">DD</span>
          <span class="brand-text">Doodle <span class="brand-accent">Admin</span></span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle admin navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav mx-lg-auto mb-2 mb-lg-0 admin-main-nav">
            <li class="nav-item"><a class="nav-link ${isActive('admin-dashboard.html') ? 'active' : ''}" href="admin-dashboard.html"><i class="fas fa-chart-line me-1"></i>Overview</a></li>
            <li class="nav-item"><a class="nav-link ${isActive('admin-products.html') ? 'active' : ''}" href="admin-products.html"><i class="fas fa-box me-1"></i>Products</a></li>
            <li class="nav-item"><a class="nav-link ${isActive('admin-users.html') ? 'active' : ''}" href="admin-users.html"><i class="fas fa-users me-1"></i>Users</a></li>
            <li class="nav-item"><a class="nav-link ${isActive('admin-orders.html') ? 'active' : ''}" href="admin-orders.html"><i class="fas fa-receipt me-1"></i>Orders</a></li>
            <li class="nav-item"><a class="nav-link ${isActive('admin-reports.html') ? 'active' : ''}" href="admin-reports.html"><i class="fas fa-chart-simple me-1"></i>Reports</a></li>
            <li class="nav-item"><a class="nav-link ${isActive('admin-settings.html') ? 'active' : ''}" href="admin-settings.html"><i class="fas fa-gear me-1"></i>Settings</a></li>
          </ul>
          <div class="navbar-actions admin-navbar-actions">
            <button class="btn-icon search-toggle" type="button" aria-label="Search admin console"><i class="fas fa-search" aria-hidden="true"></i></button>
            <a href="index.html" class="btn-icon" aria-label="View storefront"><i class="fas fa-store" aria-hidden="true"></i></a>
            <a href="admin-profile.html" class="btn-icon ${isActive('admin-profile.html') ? 'active' : ''}" aria-label="Admin profile"><i class="fas fa-user-shield" aria-hidden="true"></i></a>
            <button class="btn-icon theme-toggle" aria-label="Switch to dark mode" type="button">
              <i class="fas fa-moon" aria-hidden="true"></i>
              <i class="fas fa-sun" aria-hidden="true"></i>
            </button>
            <button class="btn-icon rtl-toggle" aria-label="Switch to RTL" type="button"><i class="fas fa-language" aria-hidden="true"></i></button>
            <button class="btn btn-outline-danger btn-sm admin-logout-action" id="navLogoutAction" type="button"><i class="fas fa-sign-out-alt me-1"></i>Logout</button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();

    if (window.DoodleTheme) {
      window.DoodleTheme.applyTheme();
      window.DoodleTheme.applyDir();
    }
  },

  bindEvents() {
    // Logout Action
    const logoutBtn = document.getElementById('navLogoutAction');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.DoodleAdmin && window.DoodleAdmin.getCurrentAdmin()) {
          window.DoodleAdmin.logout();
        } else if (window.DoodleAuth) {
          window.DoodleAuth.logout();
        }
      });
    }

    // Search Modal Toggle
    const searchToggles = document.querySelectorAll('.search-toggle');
    searchToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const searchModalEl = document.getElementById('searchModal');
        if (searchModalEl && typeof bootstrap !== 'undefined') {
          const modal = new bootstrap.Modal(searchModalEl);
          modal.show();
          setTimeout(() => {
            const input = searchModalEl.querySelector('input[type="search"]');
            if (input) input.focus();
          }, 300);
        }
      });
    });
  }
};

// Autoload logic (interactive/complete state support)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.DoodleNavbar.render());
} else {
  window.DoodleNavbar.render();
}
