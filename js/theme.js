/**
 * Doodle Desk — Theme Management (Dark Mode & LTR/RTL Layouts)
 */
'use strict';

window.DoodleTheme = {
  eventsBound: false,

  init() {
    this.applyTheme();
    this.applyDir();
    this.bindEvents();
  },

  applyTheme() {
    const savedTheme = localStorage.getItem('stationery-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtons(savedTheme);
  },

  applyDir() {
    const savedDir = localStorage.getItem('stationery-dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    this.updateRtlButtons(savedDir);
  },

  updateThemeButtons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', label);
      const sun = btn.querySelector('.fa-sun');
      const moon = btn.querySelector('.fa-moon');
      if (theme === 'dark') {
        if (sun) sun.style.display = 'inline-block';
        if (moon) moon.style.display = 'none';
      } else {
        if (sun) sun.style.display = 'none';
        if (moon) moon.style.display = 'inline-block';
      }
    });
  },

  updateRtlButtons(dir) {
    const toggleBtns = document.querySelectorAll('.rtl-toggle');
    const label = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', label);
      if (dir === 'rtl') {
        btn.classList.add('rtl-active');
      } else {
        btn.classList.remove('rtl-active');
      }
    });
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('stationery-theme', next);
    this.updateThemeButtons(next);
    // Broadcast change
    window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: next } }));
  },

  toggleDir() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', next);
    localStorage.setItem('stationery-dir', next);
    this.updateRtlButtons(next);
    // Broadcast change
    window.dispatchEvent(new CustomEvent('dirchanged', { detail: { dir: next } }));
  },

  bindEvents() {
    if (this.eventsBound) return;
    this.eventsBound = true;

    document.addEventListener('click', e => {
      const themeBtn = e.target.closest('.theme-toggle');
      if (themeBtn) {
        if (e.defaultPrevented) return;
        e.preventDefault();
        this.toggleTheme();
      }

      const rtlBtn = e.target.closest('.rtl-toggle');
      if (rtlBtn) {
        e.preventDefault();
        this.toggleDir();
      }
    });
  }
};

// Initialize immediately and also on DOM ready
DoodleTheme.init();
document.addEventListener('DOMContentLoaded', () => DoodleTheme.init());
