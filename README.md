# Portfolio Website

Premium personal site for **JNDX** — AI Developer & Designer.

Live at: [jndxai-dev.github.io/jndx-webmaster](https://jndxai-dev.github.io/jndx-webmaster/)

## Features

- Dark/Light theme (persisted to `localStorage`)
- Animated typing hero section
- Scroll-reveal animations
- Dynamic project cards from `projects.json`
- Tag-based project filtering
- Animated stat counters
- Marquee text strip
- Contact form (Formspree-ready)
- Responsive + mobile nav
- Custom 404 page
- Back-to-top button

## Customization

### Content
- **Profile info**: Edit `index.html` directly
- **Projects**: Add/remove entries in `assets/data/projects.json`
- **Testimonials**: Edit the testimonials section in `index.html`

### Styling
- Colors: Edit CSS variables in `assets/css/style.css` under `[data-theme="dark"]` and `[data-theme="light"]`
- Typing words: Change the `typingWords` array in `assets/js/main.js`
- Fonts: Swap Google Fonts link in `index.html`

### Contact Form
1. Sign up at [Formspree](https://formspree.io)
2. Get your endpoint URL
3. Set `FORMSPREE_URL` in `assets/js/main.js`

## Structure

```
├── index.html
├── 404.html
├── .nojekyll
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── data/projects.json
└── .github/workflows/pages.yml
```

## Deploy

Push to `main` branch. GitHub Actions will deploy automatically to GitHub Pages.

Or manually: **Settings > Pages > Deploy from branch > main > / (root)**
