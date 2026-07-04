/**
 * Doodle Desk - Advanced Admin Dashboard
 */
'use strict';

(function () {
  const state = {
    lowStockOnly: false
  };

  const money = value => `$${(parseFloat(value) || 0).toFixed(2)}`;

  const escapeHtml = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const getStatusClass = status => ({
    Delivered: 'success',
    Shipped: 'info',
    Processing: 'warning',
    Cancelled: 'danger'
  }[status] || 'secondary');

  const pageTabMap = {
    'admin-dashboard.html': 'overview',
    'admin-profile.html': 'profile',
    'admin-products.html': 'products',
    'admin-users.html': 'users',
    'admin-orders.html': 'orders',
    'admin-reports.html': 'reports',
    'admin-settings.html': 'settings'
  };

  const tabTitleMap = {
    overview: 'Admin Overview',
    profile: 'Admin Profile',
    products: 'Product Management',
    users: 'User Management',
    orders: 'Order Management',
    reports: 'Reports',
    settings: 'Admin Settings'
  };

  function downloadFile(filename, content, type = 'text/csv') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function toCsv(rows) {
    return rows.map(row => row.map(cell => {
      const value = String(cell ?? '').replace(/"/g, '""');
      return `"${value}"`;
    }).join(',')).join('\n');
  }

  function showAdminAlert(message, type = 'success') {
    const box = document.getElementById('adminDashAlert');
    if (!box) return;
    box.className = `alert alert-${type} alert-dismissible fade show`;
    box.style.display = 'block';
    box.innerHTML = `<i class="fas fa-info-circle me-2"></i>${escapeHtml(message)}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
  }

  function getCurrentAdminTab() {
    const page = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'admin-dashboard.html';
    return pageTabMap[page] || 'overview';
  }

  function activateAdminTab(tab) {
    document.querySelectorAll('.admin-nav-link').forEach(link => {
      const isActive = link.dataset.tab === tab;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-selected', String(isActive));
    });

    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tab}`);
    });

    const title = tabTitleMap[tab] || 'Admin Dashboard';
    const heading = document.getElementById('page-heading');
    if (heading) heading.textContent = title;
    document.title = `${title} | Doodle Desk`;
  }

  function showModal(modalEl) {
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
      return;
    }

    modalEl.style.display = 'block';
    modalEl.removeAttribute('aria-hidden');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('role', 'dialog');
    modalEl.classList.add('show');
    document.body.classList.add('modal-open');

    if (!document.querySelector('.modal-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.dataset.fallbackBackdrop = 'true';
      document.body.appendChild(backdrop);
    }
  }

  function hideModal(modalEl) {
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const instance = bootstrap.Modal.getInstance(modalEl);
      if (instance) {
        instance.hide();
        return;
      }
    }

    modalEl.style.display = 'none';
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.removeAttribute('aria-modal');
    modalEl.removeAttribute('role');
    modalEl.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.querySelectorAll('[data-fallback-backdrop="true"]').forEach(backdrop => backdrop.remove());
  }

  function updateStats() {
    const stats = window.DoodleAdmin.getDashboardStats();
    document.getElementById('statTotalProducts').textContent = stats.totalProducts;
    document.getElementById('statTotalUsers').textContent = stats.totalUsers;
    document.getElementById('statTotalOrders').textContent = stats.totalOrders;
    document.getElementById('statRevenue').textContent = money(stats.revenue);
  }

  function getFilteredProducts() {
    const products = window.DoodleStore.getProducts();
    const category = document.getElementById('productCategoryFilter')?.value || '';
    const search = (document.getElementById('productSearch')?.value || '').toLowerCase().trim();
    const sort = document.getElementById('productSortFilter')?.value || 'name-asc';

    let filtered = products.filter(product => {
      const matchesCategory = !category || product.category === category;
      const haystack = `${product.id} ${product.name} ${product.brand} ${product.category}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesStock = !state.lowStockOnly || Number(product.stock) <= 10;
      return matchesCategory && matchesSearch && matchesStock;
    });

    filtered.sort((a, b) => {
      if (sort === 'stock-asc') return Number(a.stock) - Number(b.stock);
      if (sort === 'price-desc') return Number(b.price) - Number(a.price);
      if (sort === 'rating-desc') return Number(b.rating) - Number(a.rating);
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }

  function renderProducts() {
    const tbody = document.getElementById('adminProductsTableBody');
    if (!tbody) return;

    const filtered = getFilteredProducts();
    const countLabel = document.getElementById('productsCountLabel');
    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} of ${window.DoodleStore.getProducts().length} products`;
    }

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No products match the selected filters.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(product => `
      <tr data-id="${escapeHtml(product.id)}">
        <td><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="product-thumb-sm"></td>
        <td><code class="small">${escapeHtml(product.id)}</code></td>
        <td style="white-space: normal;"><span class="fw-semibold">${escapeHtml(product.name)}</span><div class="small text-muted">${escapeHtml(product.brand || 'Doodle Desk')}</div></td>
        <td>${escapeHtml(product.category)}</td>
        <td>${money(product.price)}</td>
        <td><span class="badge bg-${Number(product.stock) > 10 ? 'success' : Number(product.stock) > 0 ? 'warning' : 'danger'}">${Number(product.stock)} units</span></td>
        <td>
          <span class="admin-table-actions">
            <button class="btn btn-sm btn-outline-primary edit-prod-btn" data-id="${escapeHtml(product.id)}" type="button" aria-label="Edit ${escapeHtml(product.name)}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-outline-danger advanced-delete-prod-btn" data-id="${escapeHtml(product.id)}" type="button" aria-label="Delete ${escapeHtml(product.name)}"><i class="fas fa-trash-alt"></i></button>
          </span>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.advanced-delete-prod-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        if (!confirm(`Delete product "${id}"?`)) return;
        window.DoodleStore.deleteProduct(id);
        window.DoodleAdmin.logActivity(`Deleted product ${id}.`, 'product');
        showAdminAlert(`Product "${id}" deleted.`, 'warning');
        refreshAll();
      });
    });

    tbody.querySelectorAll('.edit-prod-btn').forEach(button => {
      button.addEventListener('click', () => openProductModal(button.dataset.id));
    });
  }

  function openProductModal(id = null) {
    const form = document.getElementById('productForm');
    const modalEl = document.getElementById('productFormModal');
    if (!form || !modalEl) return;

    form.reset();
    form.classList.remove('was-validated');
    form.querySelectorAll('.is-valid, .is-invalid').forEach(input => {
      input.classList.remove('is-valid', 'is-invalid');
    });

    document.getElementById('productFormModalLabel').textContent = id ? 'Edit Product' : 'Add New Product';
    document.getElementById('prodId').readOnly = Boolean(id);
    document.getElementById('editOriginalId').value = id || '';

    if (id) {
      const product = window.DoodleStore.getProductById(id);
      if (!product) return;
      document.getElementById('prodId').value = product.id;
      document.getElementById('prodName').value = product.name;
      document.getElementById('prodCategory').value = product.category;
      document.getElementById('prodBrand').value = product.brand || '';
      document.getElementById('prodPrice').value = product.price;
      document.getElementById('prodOldPrice').value = product.oldPrice || '';
      document.getElementById('prodStock').value = product.stock;
      document.getElementById('prodColor').value = product.color || '';
      document.getElementById('prodRating').value = product.rating;
      document.getElementById('prodImage').value = product.image;
      document.getElementById('prodDesc').value = product.description;
    }

    showModal(modalEl);
  }

  function getFilteredUsers() {
    const search = (document.getElementById('userSearch')?.value || '').toLowerCase().trim();
    return window.DoodleAuth.getUsers().filter(user => {
      const haystack = `${user.name} ${user.email} ${user.phone} ${user.address}`.toLowerCase();
      return !search || haystack.includes(search);
    });
  }

  function renderUsers() {
    const tbody = document.getElementById('adminUsersTableBody');
    if (!tbody) return;

    const users = getFilteredUsers();
    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No customers found.</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => {
      const orders = Array.isArray(user.orders) ? user.orders : [];
      const spend = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
      return `
        <tr>
          <td><span class="fw-bold">${escapeHtml(user.name)}</span><div class="small text-muted">${money(spend)} lifetime spend</div></td>
          <td><code>${escapeHtml(user.email)}</code></td>
          <td>${escapeHtml(user.phone || 'N/A')}</td>
          <td style="white-space: normal;"><p class="small mb-0 text-muted">${escapeHtml(user.address || 'No saved address')}</p></td>
          <td><span class="badge bg-secondary">${orders.length} orders</span></td>
          <td><button class="btn btn-sm btn-outline-danger delete-user-btn" type="button" data-email="${escapeHtml(user.email)}"><i class="fas fa-user-slash me-1"></i>Remove</button></td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.delete-user-btn').forEach(button => {
      button.addEventListener('click', () => {
        const email = button.dataset.email;
        if (email === 'user@doodledesk.com') {
          showAdminAlert('The seeded demo customer is protected so demo login keeps working.', 'warning');
          return;
        }
        if (!confirm(`Remove customer "${email}"?`)) return;
        window.DoodleAdmin.deleteUser(email);
        showAdminAlert(`Customer "${email}" removed.`, 'warning');
        refreshAll();
      });
    });
  }

  function getFilteredOrders() {
    const search = (document.getElementById('orderSearch')?.value || '').toLowerCase().trim();
    const status = document.getElementById('orderStatusFilter')?.value || '';
    return window.DoodleAdmin.getOrders().filter(order => {
      const haystack = `${order.id} ${order.userName} ${order.userEmail} ${order.status}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesStatus = !status || order.status === status;
      return matchesSearch && matchesStatus;
    });
  }

  function renderOrders() {
    const tbody = document.getElementById('adminOrdersTableBody');
    if (!tbody) return;

    const orders = getFilteredOrders();
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No orders found.</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(order => `
      <tr>
        <td><span class="fw-bold">${escapeHtml(order.id)}</span></td>
        <td><div class="small"><strong>${escapeHtml(order.userName)}</strong><br><code>${escapeHtml(order.userEmail)}</code></div></td>
        <td>${escapeHtml(order.date)}</td>
        <td style="white-space: normal;">
          <ul class="list-unstyled mb-0 small">
            ${(order.items || []).map(item => `<li>${escapeHtml(item.name)} <span class="text-muted">x${Number(item.quantity) || 1}</span></li>`).join('')}
          </ul>
        </td>
        <td><strong class="text-success">${money(order.total)}</strong></td>
        <td><span class="badge bg-${getStatusClass(order.status)}">${escapeHtml(order.status)}</span></td>
        <td>
          <select class="form-select form-select-sm w-auto advanced-order-status-select" data-id="${escapeHtml(order.id)}">
            ${['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.advanced-order-status-select').forEach(select => {
      select.addEventListener('change', () => {
        window.DoodleAdmin.updateOrderStatus(select.dataset.id, select.value);
        showAdminAlert(`Order ${select.dataset.id} updated to ${select.value}.`, 'success');
        refreshAll();
      });
    });
  }

  function renderOverview() {
    const lowStock = window.DoodleAdmin.getLowStockProducts();
    document.getElementById('lowStockList').innerHTML = lowStock.length
      ? lowStock.slice(0, 6).map(product => `<div class="d-flex justify-content-between border-bottom py-1"><span>${escapeHtml(product.name)}</span><strong>${Number(product.stock)}</strong></div>`).join('')
      : '<p class="text-muted mb-0">No low-stock products right now.</p>';

    const topCustomers = window.DoodleAdmin.getTopCustomers();
    document.getElementById('topCustomersList').innerHTML = topCustomers.length
      ? topCustomers.map(user => `<div class="d-flex justify-content-between border-bottom py-1"><span>${escapeHtml(user.name)}</span><strong>${money(user.spend)}</strong></div>`).join('')
      : '<p class="text-muted mb-0">No customer orders yet.</p>';

    const recentOrders = window.DoodleAdmin.getRecentOrders();
    document.getElementById('recentOrdersList').innerHTML = recentOrders.length
      ? recentOrders.map(order => `<div class="d-flex justify-content-between border-bottom py-1"><span>${escapeHtml(order.id)}</span><span class="badge bg-${getStatusClass(order.status)}">${escapeHtml(order.status)}</span></div>`).join('')
      : '<p class="text-muted mb-0">No orders yet.</p>';

    const activity = window.DoodleAdmin.getActivityLog();
    document.getElementById('activityFeed').innerHTML = activity.length
      ? activity.map(item => `<article class="activity-item"><p>${escapeHtml(item.message)}</p><small class="text-muted">${escapeHtml(item.actor)} - ${new Date(item.date).toLocaleString()}</small></article>`).join('')
      : '<p class="text-muted mb-0">No admin activity yet.</p>';

    renderCharts();
  }

  function getReportData() {
    const products = window.DoodleStore.getProducts();
    const orders = window.DoodleAdmin.getOrders();

    const revenueByStatus = orders.reduce((map, order) => {
      const status = order.status || 'Unknown';
      map[status] = (map[status] || 0) + (parseFloat(order.total) || 0);
      return map;
    }, {});

    const productsByCategory = products.reduce((map, product) => {
      const category = product.category || 'Uncategorized';
      map[category] = (map[category] || 0) + 1;
      return map;
    }, {});

    const stockByCategory = products.reduce((map, product) => {
      const category = product.category || 'Uncategorized';
      map[category] = (map[category] || 0) + (Number(product.stock) || 0);
      return map;
    }, {});

    return { products, orders, revenueByStatus, productsByCategory, stockByCategory };
  }

  function renderBarChart(containerId, data, formatter = value => value) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      container.innerHTML = '<p class="text-muted small mb-0">No data available.</p>';
      return;
    }

    const max = Math.max(...entries.map(([, value]) => value), 1);
    container.innerHTML = entries.map(([label, value]) => `
      <div class="admin-chart-row">
        <span class="text-truncate" title="${escapeHtml(label)}">${escapeHtml(label)}</span>
        <span class="admin-chart-track"><span class="admin-chart-bar" style="width:${Math.max((value / max) * 100, 4)}%"></span></span>
        <strong>${escapeHtml(formatter(value))}</strong>
      </div>
    `).join('');
  }

  function renderCharts() {
    const report = getReportData();
    renderBarChart('statusRevenueChart', report.revenueByStatus, money);
    renderBarChart('categoryProductChart', report.productsByCategory, value => `${value}`);
    renderBarChart('reportStatusChart', report.revenueByStatus, money);
    renderBarChart('reportCategoryChart', report.stockByCategory, value => `${value} units`);
  }

  function renderReports() {
    const stats = window.DoodleAdmin.getDashboardStats();
    const aov = document.getElementById('reportAov');
    const pending = document.getElementById('reportPendingOrders');
    const lowStock = document.getElementById('reportLowStock');

    if (aov) aov.textContent = money(stats.averageOrderValue);
    if (pending) pending.textContent = stats.pendingOrders;
    if (lowStock) lowStock.textContent = stats.lowStock;
    renderCharts();
  }

  function getAdminSearchResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const productResults = window.DoodleStore.getProducts()
      .filter(product => `${product.id} ${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(q))
      .slice(0, 8)
      .map(product => ({
        type: 'Product',
        title: product.name,
        meta: `${product.brand || 'Doodle Desk'} • ${product.category} • ${money(product.price)} • Stock ${product.stock}`,
        href: 'admin-products.html'
      }));

    const userResults = window.DoodleAuth.getUsers()
      .filter(user => `${user.name} ${user.email} ${user.phone} ${user.address}`.toLowerCase().includes(q))
      .slice(0, 8)
      .map(user => ({
        type: 'User',
        title: user.name,
        meta: `${user.email} • ${Array.isArray(user.orders) ? user.orders.length : 0} orders`,
        href: 'admin-users.html'
      }));

    const orderResults = window.DoodleAdmin.getOrders()
      .filter(order => `${order.id} ${order.userName} ${order.userEmail} ${order.status}`.toLowerCase().includes(q))
      .slice(0, 8)
      .map(order => ({
        type: 'Order',
        title: order.id,
        meta: `${order.userName} • ${order.status} • ${money(order.total)}`,
        href: 'admin-orders.html'
      }));

    return productResults.concat(userResults, orderResults).slice(0, 18);
  }

  function renderAdminSearch(query = '') {
    const resultsEl = document.getElementById('adminSearchResults');
    if (!resultsEl) return;

    if (!query.trim()) {
      resultsEl.innerHTML = '<p class="text-muted small mb-0">Start typing to search products, users, and orders.</p>';
      return;
    }

    const results = getAdminSearchResults(query);
    if (!results.length) {
      resultsEl.innerHTML = '<p class="text-muted small mb-0">No admin results found.</p>';
      return;
    }

    resultsEl.innerHTML = results.map(result => `
      <a class="admin-search-result text-decoration-none" href="${result.href}">
        <span>
          <strong>${escapeHtml(result.title)}</strong>
          <span>${escapeHtml(result.meta)}</span>
        </span>
        <span class="badge bg-primary align-self-center">${escapeHtml(result.type)}</span>
      </a>
    `).join('');
  }

  function renderProfile() {
    const admin = window.DoodleAdmin.getCurrentAdmin();
    if (!admin) return;

    const name = admin.name || 'Super Admin';
    const email = admin.email || 'admin@doodledesk.com';
    const role = admin.role || 'Store Manager';
    const phone = admin.phone || '';

    const cardName = document.getElementById('profileCardName');
    const cardEmail = document.getElementById('profileCardEmail');
    const nameInput = document.getElementById('adminProfileName');
    const emailInput = document.getElementById('adminProfileEmail');
    const roleInput = document.getElementById('adminProfileRole');
    const phoneInput = document.getElementById('adminProfilePhone');

    if (cardName) cardName.textContent = name;
    if (cardEmail) cardEmail.textContent = email;
    if (nameInput) nameInput.value = name;
    if (emailInput) emailInput.value = email;
    if (roleInput) roleInput.value = role;
    if (phoneInput) phoneInput.value = phone;
  }

  function saveAdminProfile(event) {
    event.preventDefault();
    const current = window.DoodleAdmin.getCurrentAdmin();
    if (!current) return;

    const updated = {
      ...current,
      name: document.getElementById('adminProfileName').value.trim(),
      email: document.getElementById('adminProfileEmail').value.trim().toLowerCase(),
      role: document.getElementById('adminProfileRole').value.trim(),
      phone: document.getElementById('adminProfilePhone').value.trim()
    };

    if (!updated.name || !updated.email) {
      showAdminAlert('Admin name and email are required.', 'danger');
      return;
    }

    const admins = window.DoodleAdmin.getAdmins();
    const index = admins.findIndex(admin => admin.email.toLowerCase() === current.email.toLowerCase());
    if (index > -1) {
      admins[index] = { ...admins[index], ...updated };
      window.DoodleAdmin.saveAdmins(admins);
    }

    localStorage.setItem('admin_session', JSON.stringify(updated));
    document.getElementById('adminNameDisplay').textContent = updated.name;
    window.DoodleAdmin.logActivity('Updated admin profile.', 'profile');
    showAdminAlert('Profile saved successfully.', 'success');
    renderProfile();
    renderOverview();
  }

  function readProductForm() {
    const oldPriceValue = document.getElementById('prodOldPrice').value;
    return {
      id: document.getElementById('prodId').value.trim(),
      name: document.getElementById('prodName').value.trim(),
      category: document.getElementById('prodCategory').value,
      brand: document.getElementById('prodBrand').value.trim(),
      price: parseFloat(document.getElementById('prodPrice').value),
      oldPrice: oldPriceValue ? parseFloat(oldPriceValue) : null,
      stock: parseInt(document.getElementById('prodStock').value, 10),
      color: document.getElementById('prodColor').value.trim() || 'Blue',
      rating: parseFloat(document.getElementById('prodRating').value),
      image: document.getElementById('prodImage').value,
      description: document.getElementById('prodDesc').value.trim()
    };
  }

  function saveProductFromForm(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const modalEl = document.getElementById('productFormModal');
    const editId = document.getElementById('editOriginalId').value;
    const product = readProductForm();

    if (!editId && window.DoodleStore.getProductById(product.id)) {
      showAdminAlert(`A product with ID "${product.id}" already exists.`, 'danger');
      return;
    }

    if (editId) {
      window.DoodleStore.updateProduct(editId, product);
      window.DoodleAdmin.logActivity(`Updated product ${product.name}.`, 'product');
      showAdminAlert(`Product "${product.name}" updated successfully.`, 'success');
    } else {
      window.DoodleStore.addProduct(product);
      window.DoodleAdmin.logActivity(`Added product ${product.name}.`, 'product');
      showAdminAlert(`Product "${product.name}" added successfully.`, 'success');
    }

    if (modalEl) hideModal(modalEl);
    refreshAll();
  }

  function exportProducts() {
    const rows = [['ID', 'Name', 'Brand', 'Category', 'Price', 'Old Price', 'Stock', 'Rating']]
      .concat(window.DoodleStore.getProducts().map(p => [p.id, p.name, p.brand, p.category, p.price, p.oldPrice || '', p.stock, p.rating]));
    downloadFile('doodle-products.csv', toCsv(rows));
    window.DoodleAdmin.logActivity('Exported products CSV.', 'export');
    renderOverview();
  }

  function exportUsers() {
    const rows = [['Name', 'Email', 'Phone', 'Address', 'Orders']]
      .concat(window.DoodleAuth.getUsers().map(u => [u.name, u.email, u.phone || '', u.address || '', Array.isArray(u.orders) ? u.orders.length : 0]));
    downloadFile('doodle-users.csv', toCsv(rows));
    window.DoodleAdmin.logActivity('Exported users CSV.', 'export');
    renderOverview();
  }

  function exportOrders() {
    const rows = [['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Status']]
      .concat(window.DoodleAdmin.getOrders().map(o => [o.id, o.userName, o.userEmail, o.date, o.total, o.status]));
    downloadFile('doodle-orders.csv', toCsv(rows));
    window.DoodleAdmin.logActivity('Exported orders CSV.', 'export');
    renderOverview();
  }

  function exportAllData() {
    const payload = {
      products: window.DoodleStore.getProducts(),
      users: window.DoodleAuth.getUsers(),
      orders: window.DoodleAdmin.getOrders(),
      activity: window.DoodleAdmin.getActivityLog(),
      exportedAt: new Date().toISOString()
    };
    downloadFile('doodle-admin-data.json', JSON.stringify(payload, null, 2), 'application/json');
    window.DoodleAdmin.logActivity('Exported all admin data.', 'export');
    renderOverview();
  }

  function exportReport() {
    const stats = window.DoodleAdmin.getDashboardStats();
    const report = getReportData();
    const rows = [
      ['Metric', 'Value'],
      ['Total Products', stats.totalProducts],
      ['Total Users', stats.totalUsers],
      ['Total Orders', stats.totalOrders],
      ['Revenue', stats.revenue.toFixed(2)],
      ['Average Order Value', stats.averageOrderValue.toFixed(2)],
      ['Pending Orders', stats.pendingOrders],
      ['Low Stock Products', stats.lowStock],
      [],
      ['Revenue By Status', 'Value'],
      ...Object.entries(report.revenueByStatus).map(([label, value]) => [label, value.toFixed(2)]),
      [],
      ['Stock By Category', 'Units'],
      ...Object.entries(report.stockByCategory)
    ];
    downloadFile('doodle-admin-report.csv', toCsv(rows));
    window.DoodleAdmin.logActivity('Exported reports CSV.', 'export');
    renderOverview();
  }

  function refreshAll() {
    updateStats();
    renderOverview();
    renderProfile();
    renderProducts();
    renderUsers();
    renderOrders();
    renderReports();
  }

  function bindAdvancedControls() {
    activateAdminTab(getCurrentAdminTab());

    const productModal = document.getElementById('productFormModal');
    productModal?.querySelectorAll('[data-bs-dismiss="modal"], .btn-close').forEach(button => {
      button.addEventListener('click', () => hideModal(productModal));
    });

    productModal?.addEventListener('click', event => {
      if (event.target === productModal) hideModal(productModal);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && productModal?.classList.contains('show')) {
        hideModal(productModal);
      }
    });

    ['productSearch', 'productCategoryFilter', 'productSortFilter'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', renderProducts);
      document.getElementById(id)?.addEventListener('change', renderProducts);
    });

    document.getElementById('lowStockOnlyBtn')?.addEventListener('click', event => {
      state.lowStockOnly = !state.lowStockOnly;
      event.currentTarget.classList.toggle('btn-primary-custom', state.lowStockOnly);
      event.currentTarget.classList.toggle('btn-outline-custom', !state.lowStockOnly);
      renderProducts();
    });

    document.getElementById('userSearch')?.addEventListener('input', renderUsers);
    document.getElementById('orderSearch')?.addEventListener('input', renderOrders);
    document.getElementById('orderStatusFilter')?.addEventListener('change', renderOrders);

    document.getElementById('exportProductsBtn')?.addEventListener('click', exportProducts);
    document.getElementById('exportUsersBtn')?.addEventListener('click', exportUsers);
    document.getElementById('exportOrdersBtn')?.addEventListener('click', exportOrders);
    document.getElementById('exportAllDataBtn')?.addEventListener('click', exportAllData);
    document.getElementById('exportReportBtn')?.addEventListener('click', exportReport);
    document.getElementById('adminProfileForm')?.addEventListener('submit', saveAdminProfile);
    document.getElementById('openAddProductModalBtn')?.addEventListener('click', event => {
      event.preventDefault();
      openProductModal();
    });

    document.getElementById('clearActivityBtn')?.addEventListener('click', () => {
      window.DoodleAdmin.saveActivityLog([]);
      renderOverview();
      showAdminAlert('Activity log cleared.', 'info');
    });

    document.getElementById('resetDemoDataBtn')?.addEventListener('click', () => {
      if (!confirm('Reset admin orders and activity log to demo data? Products and users stay intact.')) return;
      window.DoodleAdmin.resetDemoData();
      showAdminAlert('Demo admin data reset.', 'warning');
      refreshAll();
    });

    document.getElementById('clearLocalSessionsBtn')?.addEventListener('click', () => {
      localStorage.removeItem('user_session');
      localStorage.removeItem('admin_session');
      showAdminAlert('Sessions cleared. Redirecting to admin login...', 'warning');
      window.setTimeout(() => {
        window.location.href = 'admin-login.html';
      }, 700);
    });

    const compactToggle = document.getElementById('compactAdminMode');
    if (compactToggle) {
      compactToggle.checked = localStorage.getItem('admin_compact_mode') === 'true';
      document.body.classList.toggle('admin-compact-mode', compactToggle.checked);
      compactToggle.addEventListener('change', () => {
        localStorage.setItem('admin_compact_mode', String(compactToggle.checked));
        document.body.classList.toggle('admin-compact-mode', compactToggle.checked);
      });
    }

    document.getElementById('productForm')?.addEventListener('submit', saveProductFromForm, true);

    const adminSearch = document.getElementById('adminGlobalSearch');
    const adminSearchForm = document.getElementById('adminGlobalSearchForm');
    if (adminSearch) {
      renderAdminSearch('');
      adminSearch.addEventListener('input', () => renderAdminSearch(adminSearch.value));
    }
    adminSearchForm?.addEventListener('submit', event => {
      event.preventDefault();
      const firstResult = document.querySelector('#adminSearchResults .admin-search-result');
      if (firstResult) window.location.href = firstResult.getAttribute('href');
    });

    window.addEventListener('storage', refreshAll);
  }

  function initAdvancedAdmin() {
    if (!window.DoodleAdmin || !window.DoodleStore || !window.DoodleAuth) return;
    if (!window.DoodleAdmin.getCurrentAdmin()) return;
    activateAdminTab(getCurrentAdminTab());
    bindAdvancedControls();
    refreshAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedAdmin);
  } else {
    initAdvancedAdmin();
  }
})();
