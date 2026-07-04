/**
 * Doodle Desk — Wishlist Operations
 */
'use strict';

window.DoodleWishlist = {
  getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  },

  saveWishlist(list) {
    localStorage.setItem('wishlist', JSON.stringify(list));
    this.updateNavbarCounts();
    // Dispatch storage event to sync other tabs
    window.dispatchEvent(new Event('storage'));
  },

  toggleWishlist(id) {
    let list = this.getWishlist();
    const idx = list.findIndex(item => item.id === id);

    if (idx > -1) {
      // Remove
      const removedItemName = list[idx].name;
      list.splice(idx, 1);
      this.saveWishlist(list);
      if (window.showToast) {
        window.showToast('Removed from wishlist', 'info');
      }
      this.syncHeartIcons(id, false);
      return false; // Not in wishlist anymore
    } else {
      // Add
      let newItem = {
        id: id,
        name: 'Product',
        price: 0,
        image: '',
        brand: 'Doodle Desk'
      };

      if (window.DoodleStore) {
        const product = window.DoodleStore.getProductById(id);
        if (product) {
          newItem.name = product.name;
          newItem.price = product.price;
          newItem.image = product.image;
          newItem.brand = product.brand || 'Doodle Desk';
        }
      }

      list.push(newItem);
      this.saveWishlist(list);
      if (window.showToast) {
        window.showToast('Added to wishlist', 'success');
      }
      this.syncHeartIcons(id, true);
      return true; // Added
    }
  },

  updateNavbarCounts() {
    const list = this.getWishlist();
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = list.length;
      el.style.display = list.length > 0 ? 'inline-block' : 'none';
    });
  },

  syncHeartIcons(id, isActive) {
    // Look for all wishlist buttons on the page with matching product info
    document.querySelectorAll('.product-card').forEach(card => {
      const titleLink = card.querySelector('.card-title a');
      if (!titleLink) return;
      const cardName = titleLink.textContent;
      const cardId = cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      if (cardId === id || id.startsWith(cardId)) {
        const btn = card.querySelector('.wishlist-btn');
        if (btn) {
          const icon = btn.querySelector('i');
          if (isActive) {
            btn.classList.add('wishlist-active');
            if (icon) {
              icon.classList.remove('far');
              icon.classList.add('fas');
            }
          } else {
            btn.classList.remove('wishlist-active');
            if (icon) {
              icon.classList.remove('fas');
              icon.classList.add('far');
            }
          }
        }
      }
    });
  },

  initHeartStates() {
    const list = this.getWishlist();
    list.forEach(item => {
      this.syncHeartIcons(item.id, true);
    });
  },

  initWishlistButtons() {
    document.addEventListener('click', e => {
      const wishBtn = e.target.closest('.wishlist-btn');
      if (wishBtn) {
        e.preventDefault();
        e.stopPropagation();

        const card = wishBtn.closest('.product-card');
        if (!card) return;

        const productName = card.querySelector('.card-title a')?.textContent || '';
        const link = card.querySelector('.card-title a')?.getAttribute('href') || '';
        let productId = '';
        if (link.includes('id=')) {
          productId = decodeURIComponent(link.split('id=')[1]);
        } else {
          productId = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        this.toggleWishlist(productId);
      }
    });
  }
};

// Bind elements
document.addEventListener('DOMContentLoaded', () => {
  window.DoodleWishlist.updateNavbarCounts();
  window.DoodleWishlist.initWishlistButtons();
  window.DoodleWishlist.initHeartStates();
});

// Sync across files
window.updateWishlistCount = () => window.DoodleWishlist.updateNavbarCounts();
window.initWishlistToggle = () => {
  window.DoodleWishlist.initWishlistButtons();
  window.DoodleWishlist.initHeartStates();
};
