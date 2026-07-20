/**
 * Doodle Desk — central product database & LocalStorage sync
 */
'use strict';

const PRODUCT_DATA_VERSION = '2026-07-19-v2';

const DEFAULT_PRODUCTS = [
  {
    id: 'g2-premium-gel-pens',
    name: 'G2 Premium Gel Pens (12 Pack)',
    category: 'Writing Supplies',
    price: 12.99,
    oldPrice: 14.99,
    rating: 4.8,
    description: 'Smooth-writing gel pens in 12 vibrant colors. Perfect for note-taking, journaling, and everyday writing tasks with comfortable rubber grip.',
    image: '../assets/images/G2_Premium_Gel_Pens_12Pack_202607021222.jpeg',
    stock: 25,
    brand: 'Pilot',
    color: 'Blue'
  },
  {
    id: 'jotter-ballpoint-pen',
    name: 'Jotter Ballpoint Pen',
    category: 'Writing Supplies',
    price: 19.99,
    oldPrice: 25.99,
    rating: 4.6,
    description: 'The iconic Parker Jotter. Sleek, professional, and built with a stainless steel body. Ink flows smoothly for a reliable writing experience.',
    image: '../assets/images/Jotter_Ballpoint_Pen_202607021224.jpeg',
    stock: 15,
    brand: 'Parker',
    color: 'Gold'
  },
  {
    id: 'triplus-fineliner-pens',
    name: 'Triplus Fineliner Pens (20 Pack)',
    category: 'Writing Supplies',
    price: 24.99,
    oldPrice: 28.99,
    rating: 4.7,
    description: 'Ergonomic triangular fineliners for relaxed and easy writing. Dry-safe ink means the pens can be left uncapped for days without drying up.',
    image: '../assets/images/Triplus_Fineliner_Pens_(20_Pack)_202607021225.jpeg',
    stock: 12,
    brand: 'Staedtler',
    color: 'Blue'
  },
  {
    id: 'premium-hardbound-notebook',
    name: 'Premium Hardbound Notebook',
    category: 'Notebooks & Journals',
    price: 18.99,
    oldPrice: 22.99,
    rating: 4.5,
    description: 'A durable hardbound notebook with thick, high-quality unruled pages. Perfect for sketching, brainstorming, or personal journaling.',
    image: '../assets/images/Premium_Hardbound_Notebook_202607021227.jpeg',
    stock: 30,
    brand: 'Classmate',
    color: 'Blue'
  },
  {
    id: 'campus-notebooks-5-pack',
    name: 'Campus Notebooks (5 Pack)',
    category: 'Notebooks & Journals',
    price: 15.99,
    oldPrice: 19.99,
    rating: 4.8,
    description: 'Lightweight notebooks with smooth paper, designed specifically for students taking multiple classes. Includes color-coded spine tape.',
    image: '../assets/images/Campus Notebooks (5 Pack).jpg',
    stock: 40,
    brand: 'Kokuyo',
    color: 'Pink'
  },
  {
    id: 'polychromos-color-pencils',
    name: 'Polychromos Color Pencils (36)',
    category: 'Art & Craft',
    price: 15.99,
    oldPrice: 16.99,
    rating: 4.9,
    description: 'Artist-quality colored pencils featuring break-resistant leads and high pigment density. Known for unmatched lightfastness and blending.',
    image: '../assets/images/Polychromos Color Pencils (36).jpg',
    stock: 8,
    brand: 'Faber-Castell',
    color: 'Pink'
  },
  {
    id: 'artists-acrylic-color-set',
    name: 'Artists Acrylic Color Set',
    category: 'Art & Craft',
    price: 18.50,
    oldPrice: 20.50,
    rating: 4.6,
    description: 'Vibrant, fast-drying acrylic paints with excellent coverage and a rich satin finish. Ideal for canvas, wood, and mixed media art projects.',
    image: '../assets/images/Artists_Acrylic_Color_Set_202607021228.jpeg',
    stock: 14,
    brand: 'Camel',
    color: 'Gold'
  },
  {
    id: 'geometry-premium-box',
    name: 'Geometry Premium Box',
    category: 'School Essentials',
    price: 6.99,
    oldPrice: 9.99,
    rating: 4.5,
    description: 'Complete geometry instrument kit with die-cast compass, divider, ruler, protractor, set squares, and mechanical pencil.',
    image: '../assets/images/Geometry_Premium_Box_202607021229.jpeg',
    stock: 50,
    brand: 'Classmate',
    color: 'Blue'
  },
  {
    id: 'frixion-erasable-highlighters',
    name: 'Frixion Erasable Highlighters',
    category: 'School Essentials',
    price: 9.49,
    oldPrice: 12.49,
    rating: 4.7,
    description: 'Highlight and erase repeatedly without damaging books or documents. Thermo-sensitive ink disappears completely with friction.',
    image: '../assets/images/Frixion_Erasable_Highlighters_202607021233.jpeg',
    stock: 22,
    brand: 'Pilot',
    color: 'Green'
  },
  {
    id: 'desktop-document-organizer',
    name: 'Desktop Document Organizer',
    category: 'Office Supplies',
    price: 31.99,
    oldPrice: 39.99,
    rating: 4.7,
    description: 'Keep your workspace tidy with this multi-tier document holder. Built from premium wood-composite boards with modern wire framing.',
    image: '../assets/images/Desktop_Document_Organizer_202607021234.jpeg',
    stock: 10,
    brand: 'Kokuyo',
    color: 'Black'
  },
  {
    id: 'fx-991ex-scientific-calculator',
    name: 'fx-991EX Scientific Calculator',
    category: 'Study Tools',
    price: 22.99,
    oldPrice: 28.99,
    rating: 4.8,
    description: 'High-resolution LCD display shows formulas in textbook format. Includes spreadsheets, matrix calculation, vector analysis, and solver.',
    image: '../assets/images/fx-991EX_Scientific_Calculator_202607021235.jpeg',
    stock: 20,
    brand: 'Casio',
    color: 'Black'
  },
  {
    id: 'sonnet-pen-notebook-gift-set',
    name: 'Sonnet Pen & Notebook Gift Set',
    category: 'Gift Collections',
    price: 110.00,
    oldPrice: 125.69,
    rating: 4.9,
    description: 'A beautiful luxury gift set combining a gold-accented Parker Sonnet ballpoint pen and a premium faux-leather notebook in an elegant box.',
    image: '../assets/images/Sonnet_Pen_Notebook_Gift_Set_202607021237.jpeg',
    stock: 5,
    brand: 'Parker',
    color: 'Gold'
  }
];

// Refresh seeded product data when local default assets change.
if (localStorage.getItem('doodle_products_version') !== PRODUCT_DATA_VERSION) {
  localStorage.setItem('doodle_products', JSON.stringify(DEFAULT_PRODUCTS));
  localStorage.setItem('doodle_products_version', PRODUCT_DATA_VERSION);
}

// Global functions for product access
window.DoodleStore = {
  getProducts() {
    const data = localStorage.getItem('doodle_products');
    return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
  },

  getProductById(id) {
    const list = this.getProducts();
    return list.find(p => p.id === id);
  },

  saveProducts(list) {
    localStorage.setItem('doodle_products', JSON.stringify(list));
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new Event('storage'));
  },

  addProduct(product) {
    const list = this.getProducts();
    list.push(product);
    this.saveProducts(list);
  },

  updateProduct(id, updated) {
    const list = this.getProducts();
    const idx = list.findIndex(p => p.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...updated };
      this.saveProducts(list);
      return true;
    }
    return false;
  },

  deleteProduct(id) {
    let list = this.getProducts();
    list = list.filter(p => p.id !== id);
    this.saveProducts(list);
  }
};

// Also bridge to window.STORE_PRODUCTS so existing code works
window.STORE_PRODUCTS = window.DoodleStore.getProducts().map(p => {
  return {
    n: p.name,
    b: p.brand || 'Doodle Desk',
    d: p.oldPrice ? `-${Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%` : '',
    o: p.oldPrice ? p.oldPrice.toString() : '',
    p: p.price.toString(),
    r: Math.floor(Math.random() * 150 + 20).toString(),
    rt: p.rating,
    cat: p.category,
    instock: p.stock > 0,
    color: p.color || 'Blue',
    i: p.image,
    s: p.oldPrice ? 1 : 0
  };
});
