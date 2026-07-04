/**
 * Doodle Desk — Shopping Cart Operations
 */
'use strict';

window.DoodleCart = {
  getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  },

  saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateNavbarCounts();
    // Dispatch storage event to sync other tabs
    window.dispatchEvent(new Event('storage'));
  },

  addToCart(id, quantity = 1, specPrice = null) {
    // If window.DoodleStore is loaded, get full product info
    let itemToAdd = {
      id: id,
      name: 'Product',
      price: 0,
      image: '',
      quantity: quantity
    };

    if (window.DoodleStore) {
      const product = window.DoodleStore.getProductById(id);
      if (product) {
        itemToAdd.name = product.name;
        itemToAdd.price = specPrice !== null ? specPrice : product.price;
        itemToAdd.image = product.image;
      }
    }

    let cart = this.getCart();
    const idx = cart.findIndex(item => item.id === id);

    if (idx > -1) {
      cart[idx].quantity += quantity;
      if (cart[idx].quantity > 99) cart[idx].quantity = 99;
    } else {
      cart.push(itemToAdd);
    }

    this.saveCart(cart);
    
    if (window.showToast) {
      window.showToast(`Added ${itemToAdd.name} to cart`, 'success');
    }
  },

  removeFromCart(id) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== id);
    this.saveCart(cart);
    if (window.showToast) {
      window.showToast('Item removed from cart', 'info');
    }
  },

  updateQuantity(id, amount) {
    let cart = this.getCart();
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) {
      cart[idx].quantity += amount;
      if (cart[idx].quantity < 1) cart[idx].quantity = 1;
      if (cart[idx].quantity > 99) cart[idx].quantity = 99;
      this.saveCart(cart);
    }
  },

  updateNavbarCounts() {
    const cart = this.getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = total;
    });
  },

  initCartButtons() {
    // Bind click events on cards
    document.addEventListener('click', e => {
      const addBtn = e.target.closest('.cart-add-btn');
      if (addBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = addBtn.closest('.product-card');
        if (!card) return;
        
        const productName = card.querySelector('.card-title a')?.textContent || '';
        // Find product ID from link or fallback
        const link = card.querySelector('.card-title a')?.getAttribute('href') || '';
        let productId = '';
        if (link.includes('id=')) {
          productId = decodeURIComponent(link.split('id=')[1]);
        } else {
          productId = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        const price = parseFloat(card.dataset.price) || 0;
        this.addToCart(productId, 1, price);
      }
    });
  }
};

// Bind elements
document.addEventListener('DOMContentLoaded', () => {
  window.DoodleCart.updateNavbarCounts();
  window.DoodleCart.initCartButtons();
});

// Sync count across files
window.updateCartCount = () => window.DoodleCart.updateNavbarCounts();
window.initCartActions = () => window.DoodleCart.initCartButtons();
