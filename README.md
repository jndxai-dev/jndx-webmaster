# Portfolio Website

A modern, responsive portfolio site built with vanilla HTML/CSS/JS, hosted on **GitHub Pages**.

## Features

- Dark/Light theme (persisted to `localStorage`)
- Dynamic project cards loaded from `projects.json`
- Tag-based project filtering
- Typing animation hero section
- Animated stats counter
- Scroll-spy navigation
- Contact form (Formspree-ready)
- Fully responsive
- Back-to-top button

## Getting Started

1. **Fork or clone** this repo.
2. **Edit** `index.html` — replace placeholder text (name, titles, social links).
3. **Add your projects** to `assets/data/projects.json`.
4. **Contact form** — sign up at [Formspree](https://formspree.io), get your endpoint URL, and update it in `assets/js/main.js` (look for `FORMSPREE_URL`).
5. **Push** to your GitHub repo.

## Deploy to GitHub Pages

1. Go to your repo **Settings → Pages**.
2. Under **Source**, select `Deploy from a branch`.
3. Choose the branch (e.g., `main`) and folder (`/ (root)`).
4. Click **Save**.

Your site will be live at `https://<your-username>.github.io/<repo-name>` within a few minutes.

## Custom Domain (optional)

1. Add a `CNAME` file with your domain (e.g., `example.com`).
2. Configure your DNS provider's A/AAAA or CNAME records.
3. Enable **Enforce HTTPS** in the Pages settings.

## Project Structure

```
.
├── index.html            # Main page
├── 404.html              # Custom 404 page
├── .nojekyll             # Disables Jekyll processing
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css     # All styles
│   ├── js/
│   │   └── main.js       # All JS logic
│   └── data/
│       └── projects.json # Project data source
└── .github/
    └── workflows/
        └── pages.yml     # GitHub Actions deploy (optional)
```

## Customization

- **Colors**: Edit CSS custom properties in `assets/css/style.css` under `[data-theme="dark"]` and `[data-theme="light"]`.
- **Typing words**: Change the `words` array in `assets/js/main.js`.
- **Filters**: Add/remove filter buttons in `index.html` matching tags in `projects.json`.
