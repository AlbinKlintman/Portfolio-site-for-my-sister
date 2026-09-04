# Olivia Klintman — Portfolio Site

A multi-page portfolio website for Olivia Klintman — dancer, actor, UGC creator and model. Covers her lead role in the short film *Blodet vi delar*, an upcoming short film *Stranden*, modeling work, and branded UGC/TikTok content. Static HTML/CSS/JS, no framework or build step, deployed automatically to GitHub Pages via GitHub Actions.

**Live site:** https://olivialeeklintman.com/

## Features

- **Bilingual UI (SV/EN)** — a single translation dictionary drives every page via `data-i18n` attributes; the chosen language persists across visits with `localStorage`.
- **Custom photo gallery with lightbox** — a responsive grid of behind-the-scenes stills with a dependency-free, keyboard-navigable lightbox (prev/next, `Esc` to close).
- **Image optimization pipeline** — full-resolution originals are kept alongside generated thumbnails (capped at 700px on the long edge — matched to actual displayed grid size rather than a one-size-fits-all default — compressed WebP with a JPEG fallback via `<picture>`), so the gallery grid stays fast while the lightbox still loads full quality on demand.
- **Responsive, accessible layout** — CSS Grid/Flexbox throughout, mobile-friendly nav, semantic markup, `aria-current` for active nav state.
- **Embedded video** — privacy-enhanced YouTube embeds (`youtube-nocookie.com`) for the film.
- **Performance-conscious loading** — fonts are self-hosted (`fonts/*.woff2` + `@font-face` in index.css, no Google Fonts request at all) and preloaded from `<head>` so the heading typeface starts fetching before CSS parsing finishes; every gallery image ships explicit `width`/`height` so the layout doesn't shift as lazy images load in; the film page's YouTube embed and the UGC page's TikTok videos are both click-to-play facades (a static local thumbnail + play button) — nothing from either third party loads until clicked. Each UGC click points an iframe at `ugc-embed.html` (a real page, not `srcdoc` — that gives an iframe an opaque "null" origin some third-party scripts mishandle), which mounts TikTok's official blockquote + `embed.js` widget in its own fresh browsing context, so every video gets a genuine first-load mount with no state shared between videos.
- **SEO / social sharing** — every page has a unique `<title>`/description, Open Graph + Twitter Card tags with a branded share image (`og-image.png`), and a favicon (`favicon.ico` + `apple-touch-icon.png`). Gallery photos have individually written, descriptive alt text (not a repeated generic string) for accessibility and search indexing.
- **Privacy-friendly analytics** — [GoatCounter](https://www.goatcounter.com/) (`klintman.goatcounter.com`), a lightweight cookie-free tracker that shows page views, referrers, and visitor country without storing personal data or needing a cookie-consent banner.
- **Custom 404 page** (`404.html`) — GitHub Pages serves this automatically for any unmatched URL, styled to match the rest of the site.
- **Zero build tooling** — plain HTML/CSS/JS, so the entire site is just static files with no compile step, deployable anywhere.

## Tech Stack

| Layer | Choice |
|---|---|
| Markup / styling | Semantic HTML5, hand-written CSS (custom properties, Grid/Flexbox) |
| Interactivity | Vanilla JavaScript (i18n toggle, lightbox) — no framework |
| Image processing | ImageMagick, for generating compressed (700px-capped) gallery thumbnails |
| Fonts | Self-hosted woff2 (Cormorant Garamond, Inter), no external font requests |
| Analytics | [GoatCounter](https://www.goatcounter.com/), cookie-free, no consent banner needed |
| CI/CD | GitHub Actions → GitHub Pages, auto-deploys on every push to `main` |
| DNS / CDN | Domain registered at Namecheap, proxied through Cloudflare (free tier) in front of GitHub Pages — overrides GitHub's fixed 10-minute cache header with a 1-year browser cache for images/fonts via a Cache Rule |

## Project Structure

```
.
├── index.html          # Home
├── film.html            # Film page — click-to-play video embed + full crew credits
├── blodet-vi-delar.html  # Behind-the-scenes photo gallery + lightbox for "Blodet vi delar"
├── gallery.html          # Redirect stub → blodet-vi-delar.html (kept for old links/bookmarks)
├── model.html            # Modeling portfolio — Model House Sweden, Johannes Hjort, Open Call
├── stranden.html          # Behind-the-scenes gallery for the upcoming short film "Stranden"
├── ugc.html               # UGC creator page — embedded TikTok videos by brand
├── ugc-embed.html          # Standalone helper page each UGC video's iframe loads (mounts TikTok's embed.js in its own isolated context)
├── contact.html          # Contact details
├── 404.html               # Custom not-found page, auto-served by GitHub Pages
├── index.css             # Shared stylesheet for all pages
├── main.js                # i18n toggle + lightbox logic (supports multiple grids per page)
├── favicon.ico            # Multi-size favicon
├── apple-touch-icon.png   # iOS home-screen icon
├── og-image.png           # Shared Open Graph / Twitter Card image
├── fonts/                 # Self-hosted woff2 files (Cormorant Garamond, Inter — both variable fonts)
├── Images/                # Full-resolution photography, grouped by shoot/source folder
│   ├── <folder>/thumbs/   # Per-folder generated, compressed thumbnails for the grid
│   └── ugc-thumbs/        # Locally saved TikTok cover images for the click-to-play facades
└── .github/workflows/
    └── static.yml          # GitHub Actions workflow: deploys repo root to GitHub Pages
```

## Local Development

No build step required — any static file server works:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

To regenerate gallery thumbnails after adding new photos to an `Images/<folder>/` (produces both the JPEG and its WebP counterpart, capped at 700px on the long edge — matched to the largest size any grid layout on the site actually displays an image at):

```bash
mkdir -p "Images/<folder>/thumbs"
for f in Images/<folder>/*.jpg; do
  name="$(basename "$f")"
  magick "$f" -auto-orient -resize '700x700>' -strip -quality 82 "Images/<folder>/thumbs/$name"
  magick "$f" -auto-orient -resize '700x700>' -strip -quality 70 "Images/<folder>/thumbs/${name%.*}.webp"
done
```

(`magick` is ImageMagick 7's CLI; use `convert` instead if you're on ImageMagick 6.)

Each gallery `<img>` should then be wrapped in a `<picture>` with a WebP `<source>` before the JPEG fallback:

```html
<picture>
    <source srcset="Images/<folder>/thumbs/photo.webp" type="image/webp">
    <img src="Images/<folder>/thumbs/photo.jpg" alt="..." loading="lazy">
</picture>
```

## Deployment

Pushing to `main` triggers `.github/workflows/static.yml`, which uploads the repository root as a Pages artifact and deploys it — no manual build or release step needed.
