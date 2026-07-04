/**
 * Doodle Desk — User Dashboard Controller
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (!window.DoodleAuth) return;
  const user = window.DoodleAuth.getCurrentUser();
  if (!user) return;

  // Initialize elements
  initWelcome(user);
  initTabs();
  initProfileForm(user);
  initAddressForm(user);
  initPasswordForm();
  initOrdersTab(user);
  initWishlistTab();
  initSettingsTab(user);

  // Bind logout
  const logoutBtn = document.getElementById('dashLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.DoodleAuth.logout();
    });
  }
});

function initWelcome(user) {
  const welcomeEl = document.getElementById('dashWelcomeName');
  if (welcomeEl) {
    welcomeEl.textContent = user.name;
  }
  const emailEl = document.getElementById('dashWelcomeEmail');
  if (emailEl) {
    emailEl.textContent = user.email;
  }
}

function initTabs() {
  const tabLinks = document.querySelectorAll('.dash-nav-link');
  const tabPanes = document.querySelectorAll('.dash-tab-pane');

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {

      // Allow normal page navigation (Shopping Cart)
      if (!link.dataset.tab) {
        return;
      }

      e.preventDefault();

      const target = link.dataset.tab;

      tabLinks.forEach(l => l.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      link.classList.add('active');
      const targetPane = document.getElementById(`tab-${target}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // Re-trigger tab-specific updates if needed
      if (target === 'orders') {
        const user = window.DoodleAuth.getCurrentUser();
        initOrdersTab(user);
      } else if (target === 'wishlist') {
        initWishlistTab();
      }
    });
  });
}

function initProfileForm(user) {
  const form = document.getElementById('profileForm');
  if (!form) return;

  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const phoneInput = document.getElementById('profilePhone');

  if (nameInput) nameInput.value = user.name;
  if (emailInput) emailInput.value = user.email; // email is read-only
  if (phoneInput) phoneInput.value = user.phone || '';

  if (window.DoodleValidation) {
    window.DoodleValidation.setupRealTimeValidation('#profileForm', {
      profileName: { required: true },
      profilePhone: { required: true, mobile: true }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return;

    const success = window.DoodleAuth.updateProfile(nameInput.value, phoneInput.value, user.address || '');
    if (success) {
      showDashboardAlert('Profile updated successfully!', 'success');
      initWelcome(window.DoodleAuth.getCurrentUser());
    } else {
      showDashboardAlert('Error updating profile.', 'danger');
    }
  });
}

function initAddressForm(user) {
  const form = document.getElementById('addressForm');
  if (!form) return;

  const addressInput = document.getElementById('profileAddress');
  if (addressInput) addressInput.value = user.address || '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = window.DoodleAuth.updateProfile(user.name, user.phone || '', addressInput.value);
    if (success) {
      showDashboardAlert('Saved address updated successfully!', 'success');
    } else {
      showDashboardAlert('Error updating address.', 'danger');
    }
  });
}

function initPasswordForm() {
  const form = document.getElementById('passwordForm');
  if (!form) return;

  if (window.DoodleValidation) {
    window.DoodleValidation.setupRealTimeValidation('#passwordForm', {
      oldPassword: { required: true },
      newPassword: { required: true, minlength: 6 },
      confirmNewPassword: { required: true, matchesField: 'newPassword' }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return;

    const oldPass = document.getElementById('oldPassword').value;
    const newPass = document.getElementById('newPassword').value;

    const result = window.DoodleAuth.changePassword(oldPass, newPass);
    if (result.success) {
      showDashboardAlert(result.message, 'success');
      form.reset();
      form.classList.remove('was-validated');
    } else {
      showDashboardAlert(result.message, 'danger');
    }
  });
}

function initOrdersTab(user) {
  const container = document.getElementById('ordersContainer');
  if (!container) return;

  // Retrieve user orders from latest session data
  const orders = user.orders || [];

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="fas fa-box-open fa-3x mb-3" style="opacity:0.4;"></i>
        <p class="mb-0">You have not placed any orders yet.</p>
        <a href="products.html" class="btn btn-primary-custom btn-sm mt-3">Start Shopping</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Date</th>
            <th scope="col">Items</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><span class="fw-bold">${o.id}</span></td>
              <td>${o.date}</td>
              <td style="white-space: normal;">
                <ul class="list-unstyled mb-0 small">
                  ${o.items.map(item => `<li>${item.name} <span class="text-muted">x${item.quantity}</span></li>`).join('')}
                </ul>
              </td>
              <td>$${parseFloat(o.total).toFixed(2)}</td>
              <td>
                <span class="badge bg-${o.status === 'Delivered' ? 'success' : o.status === 'Shipped' ? 'info' : 'warning'}">
                  ${o.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function initWishlistTab() {
  const container = document.getElementById('dashWishlistContainer');
  if (!container) return;

  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="far fa-heart fa-3x mb-3" style="opacity:0.4;"></i>
        <p class="mb-0">Your wishlist is empty.</p>
        <a href="products.html" class="btn btn-primary-custom btn-sm mt-3">Browse Products</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="row g-3">
      ${wishlist.map(item => `
        <div class="col-sm-6 col-md-4">
          <div class="card card-stationery p-2 h-100" style="font-size:0.85rem;">
            <div style="height:120px; overflow:hidden; border-radius:6px; margin-bottom:8px;">
              <img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div class="d-flex flex-column flex-grow-1">
              <span style="font-size:0.7rem; color:var(--color-primary);" class="fw-bold text-uppercase">${item.brand}</span>
              <span class="fw-semibold text-truncate mb-1" title="${item.name}">${item.name}</span>
              <span class="fw-bold text-success mb-2">$${item.price.toFixed(2)}</span>
              <div class="d-flex gap-1 mt-auto">
                <button class="btn btn-primary-custom btn-sm w-100 p-1 dash-add-cart" data-id="${item.id}" style="font-size:0.75rem;"><i class="fas fa-shopping-cart"></i></button>
                <button class="btn btn-outline-danger btn-sm p-1 dash-remove-wish" data-id="${item.id}" style="font-size:0.75rem;"><i class="fas fa-trash-alt"></i></button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Bind events
  container.querySelectorAll('.dash-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = wishlist.find(i => i.id === id);
      if (!item) return;

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(i => i.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      if (window.updateCartCount) window.updateCartCount();
      if (window.showToast) window.showToast(`Added ${item.name} to cart!`);
    });
  });

  container.querySelectorAll('.dash-remove-wish').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      let wl = JSON.parse(localStorage.getItem('wishlist')) || [];
      wl = wl.filter(i => i.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(wl));
      if (window.updateWishlistCount) window.updateWishlistCount();
      initWishlistTab();
    });
  });
}

function initSettingsTab(user) {
  const newsletterCb = document.getElementById('settingsNewsletter');
  if (newsletterCb) {
    // Read from user preferences in LocalStorage
    const prefs = JSON.parse(localStorage.getItem(`doodle_prefs_${user.email}`)) || { newsletter: true };
    newsletterCb.checked = prefs.newsletter;

    newsletterCb.addEventListener('change', () => {
      localStorage.setItem(`doodle_prefs_${user.email}`, JSON.stringify({ newsletter: newsletterCb.checked }));
      showDashboardAlert('Settings saved!', 'success');
    });
  }
}

function showDashboardAlert(message, type = 'success') {
  const container = document.getElementById('dashAlertContainer') || createDashAlertContainer();
  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  // Auto scroll to alert
  window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
}

function createDashAlertContainer() {
  const mainPane = document.querySelector('.dash-main-pane');
  const div = document.createElement('div');
  div.id = 'dashAlertContainer';
  div.className = 'mb-4';
  if (mainPane) {
    mainPane.insertBefore(div, mainPane.firstChild);
  }
  return div;
}
