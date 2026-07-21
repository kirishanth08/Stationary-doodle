/**
 * Doodle Desk — Shared Common Footer Component
 * NOTE: The single source of truth for footer markup is now
 * window.DoodleNavbar.renderFooter() in navbar.js. This file is kept only
 * for backward compatibility with any page that still includes footer.js —
 * it simply delegates so the footer never diverges/flickers between pages.
 */
'use strict';

window.DoodleFooter = {
  render() {
    if (window.DoodleNavbar && typeof window.DoodleNavbar.renderFooter === 'function') {
      window.DoodleNavbar.renderFooter();
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.DoodleFooter.render());
} else {
  window.DoodleFooter.render();
}
