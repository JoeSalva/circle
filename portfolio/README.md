# Portfolio — static site, deploy-ready for Vercel

A single-page portfolio built from real project facts (Circle API: 26 endpoints,
47 tests, 54→7 query cut, live Swagger docs). Plain HTML/CSS/JS — no framework,
no build step, nothing to install.

## Deploy to Vercel (2 minutes)

1. Push this folder to a GitHub repo (or use the Vercel CLI from this directory).
2. On [vercel.com/new](https://vercel.com/new): import the repo.
3. In the import screen set **Root Directory** to `portfolio` — or deploy this
   folder as its own repo and accept the defaults.
4. Click Deploy. No build command needed; Vercel serves `index.html` as-is.

CLI alternative:

```bash
cd portfolio
npx vercel --prod
```

## Before you publish — 3 edits

| Where | What | Why |
|---|---|---|
| `index.html` → Contact section | `data-email="you@example.com"` | your real address |
| `index.html` → Contact section | `href="https://www.linkedin.com/in/YOUR-HANDLE"` | your LinkedIn |
| optional | Add your CV as `portfolio/cv.pdf` and link it from the hero | recruiters ask first |

The two `EDIT:` comments in `index.html` mark the exact spots.

## Files

- `index.html` — all content (hero, projects, war stories, contact)
- `styles.css` — dark theme matching Circle's brand; centered, larger footer
- `script.js` — optional enhancements (scroll reveal, copy-email); page works with JS off
