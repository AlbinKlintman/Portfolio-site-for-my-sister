# Olivia Klintman — Portfolio Site

A multi-page portfolio website built for an actor/dancer/model, showcasing her lead role in the short film *Blodet vi delar*. Static HTML/CSS/JS, no framework or build step, deployed automatically to GitHub Pages via GitHub Actions.

**Live site:** https://albinklintman.github.io/Portfolio-site-for-my-sister/

## Features

- **Bilingual UI (SV/EN)** — a single translation dictionary drives every page via `data-i18n` attributes; the chosen language persists across visits with `localStorage`.
- **Custom photo gallery with lightbox** — a responsive grid of behind-the-scenes stills with a dependency-free, keyboard-navigable lightbox (prev/next, `Esc` to close).
- **Image optimization pipeline** — full-resolution originals are kept alongside generated thumbnails (~1000px, compressed), so the gallery grid stays fast while the lightbox still loads full quality on demand.
- **Responsive, accessible layout** — CSS Grid/Flexbox throughout, mobile-friendly nav, semantic markup, `aria-current` for active nav state.
- **Embedded video** — privacy-enhanced YouTube embeds (`youtube-nocookie.com`) for the film.
- **Zero build tooling** — plain HTML/CSS/JS, so the entire site is just static files with no compile step, deployable anywhere.

## Tech Stack

| Layer | Choice |
|---|---|
| Markup / styling | Semantic HTML5, hand-written CSS (custom properties, Grid/Flexbox) |
| Interactivity | Vanilla JavaScript (i18n toggle, lightbox) — no framework |
| Image processing | ImageMagick, for generating compressed gallery thumbnails |
| CI/CD | GitHub Actions → GitHub Pages, auto-deploys on every push to `main` |

## Project Structure

```
.
├── index.html          # Home
├── film.html            # Film page — video embed + full crew credits
├── gallery.html          # Behind-the-scenes photo gallery + lightbox
├── model.html            # Modeling portfolio — Model House Sweden, Johannes Hjort, Open Call
├── stranden.html          # Behind-the-scenes gallery for the upcoming short film "Stranden"
├── ugc.html               # UGC creator page — embedded TikTok videos by brand
├── contact.html          # Contact details
├── index.css             # Shared stylesheet for all pages
├── main.js                # i18n toggle + lightbox logic (supports multiple grids per page)
├── Images/                # Full-resolution photography, grouped by shoot/source folder
│   └── <folder>/thumbs/   # Per-folder generated, compressed thumbnails for the grid
└── .github/workflows/
    └── static.yml          # GitHub Actions workflow: deploys repo root to GitHub Pages
```

## Local Development

No build step required — any static file server works:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

To regenerate gallery thumbnails after adding new photos to an `Images/<folder>/`:

```bash
mkdir -p "Images/<folder>/thumbs"
for f in Images/<folder>/*.jpg; do
  convert "$f" -auto-orient -resize '1000x1000>' -strip -quality 78 "Images/<folder>/thumbs/$(basename "$f")"
done
```

## Deployment

Pushing to `main` triggers `.github/workflows/static.yml`, which uploads the repository root as a Pages artifact and deploys it — no manual build or release step needed.
