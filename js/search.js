/**
 * Doodle Desk — Search & Filters Processor
 */
'use strict';

window.DoodleSearch = {
  activeCategoryFilters: [],
  activeBrandFilters: [],
  activeRatingFilters: [],
  maxPrice: 150,
  searchQuery: '',

  init() {
    this.bindSearchForm();
    this.bindSidebarFilters();
    this.syncUrlParams();
  },

  bindSearchForm() {
    // Check if on search input modals
    const searchInputs = document.querySelectorAll('.search-modal input[type="search"], form[role="search"] input[type="search"]');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        // If we are on products.html, apply immediately
        if (document.getElementById('product-grid')) {
          this.applyFiltersAndSearch();
        }
      });
      
      // Prevent reload on submit
      const form = input.closest('form');
      if (form && document.getElementById('product-grid')) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.searchQuery = input.value.toLowerCase().trim();
          this.applyFiltersAndSearch();
          // Hide modal
          const modalEl = document.getElementById('searchModal');
          if (modalEl && typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
          }
        });
      }
    });
  },

  bindSidebarFilters() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Price Slider
    const slider = document.getElementById('priceRange');
    const display = document.getElementById('priceRangeValue');
    if (slider) {
      this.maxPrice = parseFloat(slider.value);
      slider.addEventListener('input', () => {
        this.maxPrice = parseFloat(slider.value);
        if (display) display.textContent = `$0 – $${slider.value}`;
        this.applyFiltersAndSearch();
      });
    }

    // Checkboxes change listeners
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => this.applyFiltersAndSearch());
    });

    // Apply button
    const applyBtn = document.getElementById('btn-apply-filters');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this.applyFiltersAndSearch());
    }

    // Clear button
    const clearBtn = document.getElementById('btn-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAllFilters());
    }

    // Sort select binding
    const sortSelect = document.querySelector('[aria-label="Sort products"]');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => this.applyFiltersAndSearch());
    }
  },

  syncUrlParams() {
    // Parse URL query parameters (e.g. ?category=Writing Supplies)
    const urlParams = new URLSearchParams(window.location.search);
    
    const catParam = urlParams.get('category');
    if (catParam) {
      document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
        const labelText = cb.parentNode.textContent.trim().toLowerCase();
        if (labelText === catParam.toLowerCase()) {
          cb.checked = true;
        }
      });
    }
    
    const searchParam = urlParams.get('search');
    if (searchParam) {
      this.searchQuery = searchParam.toLowerCase().trim();
      document.querySelectorAll('.search-modal input[type="search"], form[role="search"] input[type="search"]').forEach(input => {
        input.value = searchParam;
      });
    }
  },

  clearAllFilters() {
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    
    const slider = document.getElementById('priceRange');
    const display = document.getElementById('priceRangeValue');
    if (slider) {
      slider.value = 150;
      this.maxPrice = 150;
      if (display) display.textContent = '$0 – $150';
    }

    this.activeCategoryFilters = [];
    this.activeBrandFilters = [];
    this.activeRatingFilters = [];
    this.searchQuery = '';
    
    // Clear search input fields visually
    document.querySelectorAll('.search-modal input[type="search"], form[role="search"] input[type="search"]').forEach(input => {
      input.value = '';
    });

    // Reset sort select
    const sortSelect = document.querySelector('[aria-label="Sort products"]');
    if (sortSelect) sortSelect.selectedIndex = 0;

    this.applyFiltersAndSearch();
  },

  getCheckedFilters(headingText) {
    const groups = Array.from(document.querySelectorAll('.filter-group'));
    const group = groups.find(g => {
      const h6 = g.querySelector('h6');
      return h6 && h6.textContent.trim().toLowerCase() === headingText.toLowerCase();
    });
    if (!group) return [];
    return Array.from(group.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.parentNode.textContent.trim());
  },

  applyFiltersAndSearch() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Refresh configurations from DOM state
    this.activeCategoryFilters = this.getCheckedFilters('Categories');
    this.activeBrandFilters = this.getCheckedFilters('Brands');
    this.activeRatingFilters = this.getCheckedFilters('Ratings');
    const selectedAvailability = this.getCheckedFilters('Availability');

    const products = window.DoodleStore ? window.DoodleStore.getProducts() : [];
    
    // Process matching products list using AND logic
    let filtered = products.filter(p => {
      // 1. Search Query (Name or Category)
      if (this.searchQuery) {
        const matchesName = p.name.toLowerCase().includes(this.searchQuery);
        const matchesCategory = p.category.toLowerCase().includes(this.searchQuery);
        if (!matchesName && !matchesCategory) return false;
      }

      // 2. Category checkboxes
      if (this.activeCategoryFilters.length > 0 && !this.activeCategoryFilters.includes(p.category)) {
        return false;
      }

      // 3. Brand checkboxes
      if (this.activeBrandFilters.length > 0 && !this.activeBrandFilters.includes(p.brand)) {
        return false;
      }

      // 4. Price Slider
      if (p.price > this.maxPrice) {
        return false;
      }

      // 5. Ratings
      if (this.activeRatingFilters.length > 0) {
        const minRating = Math.min(...this.activeRatingFilters.map(r => parseFloat(r)));
        if (p.rating < minRating) return false;
      }

      // 6. Availability
      if (selectedAvailability.length > 0) {
        const showInStock = selectedAvailability.includes('In Stock');
        const showPreOrder = selectedAvailability.includes('Pre-Order');
        const instock = p.stock > 0;
        if (showInStock && !showPreOrder && !instock) return false;
        if (!showInStock && showPreOrder && instock) return false;
      }

      return true;
    });

    // Sort order processing
    const sortSelect = document.querySelector('[aria-label="Sort products"]');
    if (sortSelect) {
      const val = sortSelect.value;
      if (val === 'Price: Low to High') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (val === 'Price: High to Low') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (val === 'Newest') {
        filtered.reverse();
      }
    }

    // Render elements
    this.renderGrid(filtered);
  },

  renderGrid(list) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="product-grid-empty text-center py-5 text-muted">
          <i class="fas fa-search-minus fa-3x mb-3 empty-state-icon"></i>
          <h3 class="h4 fw-bold mb-2">No matching products found</h3>
          <p class="mb-3">Try adjusting your filters or search terms.</p>
          <button type="button" class="btn btn-outline-custom btn-sm rounded-pill px-4" id="btn-empty-clear-filters">
            <i class="fas fa-undo me-2" aria-hidden="true"></i>Clear Filters
          </button>
        </div>
      `;
      const counter = document.getElementById('products-grid-heading');
      if (counter) counter.textContent = 'Showing 0 products';
      
      const emptyClearBtn = document.getElementById('btn-empty-clear-filters');
      if (emptyClearBtn) {
        emptyClearBtn.addEventListener('click', () => this.clearAllFilters());
      }
      return;
    }

    grid.innerHTML = list.map(x => {
      const hasDiscount = x.oldPrice && x.oldPrice > x.price;
      const discountPercent = hasDiscount ? Math.round(((x.oldPrice - x.price) / x.oldPrice) * 100) : 0;
      const ribbon = hasDiscount ? `<span class="sale-ribbon">-${discountPercent}%</span>` : '';
      const oldPriceHtml = hasDiscount ? `<span class="card-price-old">$${x.oldPrice.toFixed(2)}</span>` : '';
      
      // Star rating calculation
      let starsHtml = '';
      const fullStars = Math.floor(x.rating);
      const halfStar = (x.rating % 1) >= 0.5 ? 1 : 0;
      for (let s = 0; s < fullStars; s++) starsHtml += '<i class="fas fa-star"></i>';
      if (halfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
      const emptyStars = 5 - fullStars - halfStar;
      for (let e = 0; e < emptyStars; e++) starsHtml += '<i class="far fa-star"></i>';

      const link = `product-details.html?id=${x.id}`;
      
      return `
        <div class="product-grid-item">
          <article class="card card-stationery product-card ${hasDiscount ? 'product-card-sale' : ''} h-100"
            data-category="${x.category}"
            data-brand="${x.brand}"
            data-price="${x.price}"
            data-rating="${x.rating}"
            data-instock="${x.stock > 0}"
            data-color="${x.color}">
            <div class="card-img-wrap">
              ${ribbon}
              <a href="${link}"><img src="${x.image}" alt="${x.name}" width="400" height="400" loading="lazy"></a>
              <div class="product-card-media-actions">
                <a href="${link}" class="product-card-chip" aria-label="Quick view"><i class="fas fa-eye" aria-hidden="true"></i></a>
              </div>
            </div>
            <div class="card-body">
              <span class="badge-brand">${x.brand}</span>
              <h2 class="card-title h6"><a href="${link}">${x.name}</a></h2>
              <div class="product-rating">
                <span class="stars">${starsHtml}</span>
                <span>(${Math.floor(x.rating * 30)})</span>
              </div>
              <p>${oldPriceHtml}<span class="card-price">$${x.price.toFixed(2)}</span></p>
              <div class="mt-2 ${x.stock > 0 ? 'text-success' : 'text-danger'} small fw-bold">
                <i class="fas ${x.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'} me-1"></i>
                ${x.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </div>
              <div class="product-card-actions-bottom mt-3">
                <button class="btn btn-primary-custom cart-add-btn w-100 btn-sm rounded-pill" type="button"><i class="fas fa-shopping-bag me-1" aria-hidden="true"></i> Add to Cart</button>
              </div>
            </div>
          </article>
        </div>
      `;
    }).join('');

    // Re-initialize event listeners for dynamic cart and wishlist additions
    if (window.DoodleWishlist) {
      window.DoodleWishlist.initHeartStates();
    }
    
    // Update counting indicator text
    const counter = document.getElementById('products-grid-heading');
    if (counter) {
      counter.textContent = `Showing ${list.length} of ${window.DoodleStore.getProducts().length} products`;
    }
  }
};

// Autoload and initialize search processor
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.DoodleSearch.init();
    if (document.getElementById('product-grid')) {
      window.DoodleSearch.applyFiltersAndSearch();
    }
  });
} else {
  window.DoodleSearch.init();
  if (document.getElementById('product-grid')) {
    window.DoodleSearch.applyFiltersAndSearch();
  }
}

