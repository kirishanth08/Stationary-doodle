/**
 * Doodle Desk — Admin Authentication & Dashboard Controller
 */
'use strict';

const DEFAULT_ADMINS = [
  {
    name: 'Super Admin',
    email: 'admin@doodledesk.com',
    password: 'AdminPassword123'
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'ORD-89210',
    userEmail: 'user@doodledesk.com',
    userName: 'Jane Doe',
    date: '2026-06-15',
    total: 38.48,
    status: 'Delivered',
    items: [
      { name: 'G2 Premium Gel Pens (12 Pack)', quantity: 2, price: 12.99 },
      { name: 'Geometry Premium Box', quantity: 1, price: 6.99 }
    ]
  },
  {
    id: 'ORD-89211',
    userEmail: 'guest@doodledesk.com',
    userName: 'Alex Smith',
    date: '2026-06-20',
    total: 55.97,
    status: 'Shipped',
    items: [
      { name: 'Jotter Ballpoint Pen', quantity: 2, price: 19.99 },
      { name: 'Campus Notebooks (5 Pack)', quantity: 1, price: 15.99 }
    ]
  },
  {
    id: 'ORD-89212',
    userEmail: 'micheal@example.com',
    userName: 'Micheal Scott',
    date: '2026-06-25',
    total: 110.00,
    status: 'Processing',
    items: [
      { name: 'Sonnet Pen & Notebook Gift Set', quantity: 1, price: 110.00 }
    ]
  }
];

// Initialize database keys if not present
if (!localStorage.getItem('doodle_admins')) {
  localStorage.setItem('doodle_admins', JSON.stringify(DEFAULT_ADMINS));
} else {
  const savedAdmins = JSON.parse(localStorage.getItem('doodle_admins')) || [];
  DEFAULT_ADMINS.forEach(defaultAdmin => {
    if (!savedAdmins.some(admin => admin.email.toLowerCase() === defaultAdmin.email.toLowerCase())) {
      savedAdmins.push(defaultAdmin);
    }
  });
  localStorage.setItem('doodle_admins', JSON.stringify(savedAdmins));
}
if (!localStorage.getItem('doodle_orders')) {
  localStorage.setItem('doodle_orders', JSON.stringify(DEFAULT_ORDERS));
}
if (!localStorage.getItem('doodle_admin_activity')) {
  localStorage.setItem('doodle_admin_activity', JSON.stringify([]));
}

window.DoodleAdmin = {
  getAdmins() {
    return JSON.parse(localStorage.getItem('doodle_admins')) || DEFAULT_ADMINS;
  },

  saveAdmins(admins) {
    localStorage.setItem('doodle_admins', JSON.stringify(admins));
  },

  getCurrentAdmin() {
    const session = localStorage.getItem('admin_session');
    if (!session) return null;
    return JSON.parse(session);
  },

  register(name, email, password) {
    const admins = this.getAdmins();
    const emailLower = email.toLowerCase().trim();

    if (admins.some(a => a.email.toLowerCase() === emailLower)) {
      return { success: false, message: 'An admin account with this email already exists.' };
    }

    const newAdmin = {
      name: name.trim(),
      email: emailLower,
      password: password
    };

    admins.push(newAdmin);
    this.saveAdmins(admins);
    return { success: true, message: 'Admin account created successfully! Redirecting to login...' };
  },

  login(email, password) {
    const admins = this.getAdmins();
    const emailLower = email.toLowerCase().trim();

    const admin = admins.find(a => a.email.toLowerCase() === emailLower && a.password === password);
    if (!admin) {
      return { success: false, message: 'Invalid admin email or password.' };
    }

    const sessionAdmin = { ...admin };
    delete sessionAdmin.password;
    localStorage.removeItem('user_session');
    localStorage.setItem('admin_session', JSON.stringify(sessionAdmin));

    return { success: true, message: 'Admin Login successful! Redirecting...' };
  },

  logout() {
    localStorage.removeItem('admin_session');
    window.location.href = 'admin-login.html';
  },

  protectDashboard() {
    const adminPages = [
      'admin-dashboard.html',
      'admin-profile.html',
      'admin-products.html',
      'admin-users.html',
      'admin-orders.html',
      'admin-reports.html',
      'admin-settings.html'
    ];
    const page = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    if (adminPages.includes(page)) {
      if (!this.getCurrentAdmin()) {
        window.location.href = 'admin-login.html';
      }
    }
  },

  getOrders() {
    return JSON.parse(localStorage.getItem('doodle_orders')) || DEFAULT_ORDERS;
  },

  saveOrders(orders) {
    localStorage.setItem('doodle_orders', JSON.stringify(orders));
  },

  getActivityLog() {
    return JSON.parse(localStorage.getItem('doodle_admin_activity')) || [];
  },

  saveActivityLog(log) {
    localStorage.setItem('doodle_admin_activity', JSON.stringify(log.slice(0, 80)));
  },

  logActivity(message, type = 'info') {
    const admin = this.getCurrentAdmin();
    const log = this.getActivityLog();
    log.unshift({
      id: `ACT-${Date.now()}`,
      message,
      type,
      actor: admin ? admin.name : 'System',
      date: new Date().toISOString()
    });
    this.saveActivityLog(log);
  },

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.saveOrders(orders);

    if (window.DoodleAuth) {
      const users = window.DoodleAuth.getUsers();
      users.forEach(user => {
        if (!Array.isArray(user.orders)) return;
        const userOrder = user.orders.find(o => o.id === orderId);
        if (userOrder) userOrder.status = status;
      });
      window.DoodleAuth.saveUsers(users);
    }

    this.logActivity(`Updated order ${orderId} to ${status}.`, 'order');
    return true;
  },

  deleteUser(email) {
    if (!window.DoodleAuth) return false;
    const users = window.DoodleAuth.getUsers();
    const nextUsers = users.filter(user => user.email.toLowerCase() !== email.toLowerCase());
    if (nextUsers.length === users.length) return false;
    window.DoodleAuth.saveUsers(nextUsers);
    this.logActivity(`Deleted customer account ${email}.`, 'user');
    return true;
  },

  getLowStockProducts(threshold = 10) {
    const products = window.DoodleStore ? window.DoodleStore.getProducts() : [];
    return products.filter(product => Number(product.stock) <= threshold);
  },

  getTopCustomers(limit = 5) {
    const users = window.DoodleAuth ? window.DoodleAuth.getUsers() : [];
    return users
      .map(user => {
        const orders = Array.isArray(user.orders) ? user.orders : [];
        const spend = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
        return { ...user, orderCount: orders.length, spend };
      })
      .sort((a, b) => b.spend - a.spend || b.orderCount - a.orderCount)
      .slice(0, limit);
  },

  getRecentOrders(limit = 5) {
    return this.getOrders()
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  },

  addOrder(order) {
    const orders = this.getOrders();
    orders.push(order);
    this.saveOrders(orders);
    
    // Also save order to user order history if a user session is active
    if (window.DoodleAuth) {
      const user = window.DoodleAuth.getCurrentUser();
      if (user) {
        const users = window.DoodleAuth.getUsers();
        const uIdx = users.findIndex(u => u.email === user.email);
        if (uIdx > -1) {
          users[uIdx].orders = users[uIdx].orders || [];
          users[uIdx].orders.push(order);
          window.DoodleAuth.saveUsers(users);
        }
      }
    }
  },

  getDashboardStats() {
    const products = window.DoodleStore ? window.DoodleStore.getProducts() : [];
    const users = window.DoodleAuth ? window.DoodleAuth.getUsers() : [];
    const orders = this.getOrders();

    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      revenue,
      lowStock: this.getLowStockProducts().length,
      pendingOrders: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
      averageOrderValue: totalOrders ? revenue / totalOrders : 0
    };
  },

  resetDemoData() {
    localStorage.setItem('doodle_admins', JSON.stringify(DEFAULT_ADMINS));
    localStorage.setItem('doodle_orders', JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem('doodle_admin_activity', JSON.stringify([]));
    this.logActivity('Reset admin demo data.', 'settings');
  }
};

// Autoload Protection
document.addEventListener('DOMContentLoaded', () => {
  window.DoodleAdmin.protectDashboard();
});
