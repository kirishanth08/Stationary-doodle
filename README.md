# Doodle Desk Store

A bright, responsive static website for a **Stationery & School Supplies Store** — Assignment 08.

![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange)
![CSS3](https://img.shields.io/badge/CSS3-Variables-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)
![JavaScript](https://img.shields.io/badge/JS-ES6+-yellow)

## Overview

Doodle Desk is a front-end-only website showcasing school supplies by category, back-to-school bundles, bulk pricing for schools, and contact forms. Built with semantic HTML5, Bootstrap 5, CSS custom properties, and vanilla ES6+ JavaScript.

**Live demo:** Open `pages/index.html` in a browser or serve locally:

```bash
cd stationery-store
python -m http.server 8080
# Visit http://localhost:8080/pages/index.html
```

## Features

- **12 pages** — Home, About, Categories, Products, Product Detail, Bundles, Bulk Orders, Blog, Blog Detail, Contact, Coming Soon, 404
- **Dark / Light mode** — CSS variables + localStorage persistence
- **RTL support** — Full right-to-left layout via `rtl.css`
- **Form validation** — Contact and bulk order forms (Formspree-ready)
- **Bundle calculator** — Build-your-own bundle price total on `bundles.html`
- **Accessibility** — WCAG 2.1 AA patterns (skip links, ARIA labels, keyboard nav)
- **SEO** — Unique meta tags, JSON-LD store schema, `sitemap.xml`, `robots.txt`
- **Premium hover effects** — Smooth card lift, button scale, image zoom (0.3s ease)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 semantic tags |
| Styles | CSS3 + Bootstrap 5 + CSS Variables |
| Fonts | Quicksand (headings) + Source Sans Pro (body) |
| Icons | Font Awesome 6 |
| Scripts | ES6+ (dark mode, validation, bundle calculator) |

## Project Structure

```
stationery-store/
├── assets/
│   ├── css/
│   │   ├── style.css        # Main styles + CSS variables
│   │   ├── dark-mode.css    # Dark theme overrides
│   │   └── rtl.css          # RTL layout support
│   ├── js/
│   │   ├── main.js          # Custom JavaScript
│   │   └── plugins/         # Reserved for plugins
│   ├── images/              # WebP images
│   └── fonts/               # Self-hosted fonts (optional)
├── pages/                   # All 12 HTML pages
├── documentation/
│   ├── installation-guide.txt
│   ├── customization-guide.txt
│   └── credits.txt
├── sitemap.xml
├── robots.txt
└── README.md
```

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `pages/index.html` | Hero, categories, featured products, bundles, CTA, brands, newsletter |
| About | `pages/about.html` | Store history, offerings, team |
| Categories | `pages/categories.html` | 6 category cards |
| Products | `pages/products.html` | Filter sidebar, 12-item grid, sort, pagination |
| Product Detail | `pages/product-details.html` | Full product view with accordion |
| Bundles | `pages/bundles.html` | Bundle deals + custom bundle builder |
| Bulk Orders | `pages/bulk-orders.html` | Volume pricing + enquiry form |
| Blog | `pages/blog.html` | 6 articles with filter tabs |
| Blog Detail | `pages/blog-details.html` | Full article + comments |
| Contact | `pages/contact.html` | Form + map + store info |
| Coming Soon | `pages/coming-soon.html` | Countdown + email signup |
| 404 | `pages/404.html` | Error page |

## Color Scheme

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-primary` | `#0F4C81` | Royal Blue — buttons, links, accents |
| `--color-secondary` | `#D4AF37` | Luxury Gold — CTAs, hover highlights |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-text` | `#1A2332` | Body text |
| `--color-section` | `#F7F8FA` | Section backgrounds |
| `--color-footer-bg` | `#0B1F3A` | Deep Navy footer |

## Setup & Customization

1. **Images** — Pages use high-quality Unsplash photography (royalty-free). For offline use, download and save to `assets/images/`.
2. **Forms** — Replace `YOUR_FORM_ID` in Formspree action URLs on contact and bulk-orders pages.
3. **Newsletter** — Replace Mailchimp placeholder URLs on index and coming-soon pages.
4. **Maps** — Update Google Maps iframe on contact page.

See `documentation/customization-guide.txt` for full details.

## Browser Support

Tested on Chrome, Firefox, Safari, and Edge. Responsive breakpoints:

- Mobile: &lt; 640px
- Tablet: 640–1024px
- Desktop: 1024–1280px
- Large: &gt; 1280px

## License

Educational project — Assignment 08. See `documentation/credits.txt` for third-party attributions.

---

© 2026 Doodle Desk. All rights reserved.
