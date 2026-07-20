/**
 * Doodle Desk — Shared Common Footer Component
 */
'use strict';

window.DoodleFooter = {
  render() {
    const footer = document.querySelector('.footer-stationery');
    if (!footer) return;

    const year = new Date().getFullYear();

    footer.innerHTML = `
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <a href="index.html" class="footer-logo text-decoration-none mb-3 d-inline-flex align-items-center">

    <span class="footer-logo-icon">DD</span>

    <span class="footer-logo-text">
        Doodle <span>Desk</span>
    </span>

</a>
            <p>Premium stationery, school essentials, and creative tools for students, professionals, and makers. Everything you need to write, create &amp; learn.</p>
            <div class="social-links mt-3">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
              <a href="https://www.twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter"><i class="fab fa-twitter" aria-hidden="true"></i></a>
              <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer" aria-label="Pinterest"><i class="fab fa-pinterest-p" aria-hidden="true"></i></a>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <h5>Categories</h5>
            <a href="products.html?category=Writing Supplies">Writing Supplies</a>
            <a href="products.html?category=Notebooks %26 Journals">Notebooks</a>
            <a href="products.html?category=Art %26 Craft">Art &amp; Craft</a>
            <a href="products.html?category=School Essentials">School Essentials</a>
            <a href="products.html?category=Office Supplies">Office Supplies</a>
          </div>
          <div class="col-6 col-lg-2">
            <h5>Customer Support</h5>
            <a href="contact.html">Contact Us</a>
            <a href="shipping-delivery.html">Shipping</a>
            <a href="returns.html">Returns</a>
            <a href="bulk-orders.html">Bulk Orders</a>
            <a href="faq.html">FAQs</a>
          </div>
          <div class="col-6 col-lg-2">
            <h5>Quick Links</h5>
            <a href="about.html">About Us</a>
            <a href="products.html">Shop All</a>
            <a href="bundles.html">Bundles</a>
            <a href="blog.html">Blog</a>
          </div>
          <div class="col-lg-2 col-6">
            <h5>Newsletter</h5>
            <p class="small">Stay inspired with new arrivals and exclusive offers.</p>
            <form class="footer-newsletter needs-validation" action="404.html" method="get" novalidate>
              <div class="input-group">
                <input type="email" class="form-control form-control-sm" placeholder="Your email" aria-label="Email for newsletter" required>
                <button class="btn btn-secondary-custom btn-sm" type="submit" aria-label="Subscribe"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>
              </div>
            </form>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${year} Doodle Desk. All rights reserved. | <a href="mailto:hello@doodledesk.com">hello@doodledesk.com</a></p>
        </div>
      </div>
    `;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.DoodleFooter.render());
} else {
  window.DoodleFooter.render();
}
