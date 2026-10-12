# Portfolio — self-contained static site

A framework-free portfolio. No build step, no dependencies — just HTML, CSS, and a little JS. Test-deploy ready for Vercel.

## Why it works
- **Static**: plain HTML/CSS/JS — no bundler, no `npm install`, no server.
- **Progressive enhancement**: the `script.js` only touches the footer year and a single enhancement. Without JS, the site still renders correctly.
- **Single CSS block**: all palette tokens live in `:root`. One edit swaps the whole look.

## Deploy to Vercel (2 min)
1. `git clone <repo>` → open `portfolio/`
2. `npx vercel --yes` (create Vercel project for this folder; set `output: 'directory'`, entry `index.html`)
3. On Vercel dashboard → **Domains** → add `portfolio.yourdomain.com` → enforce HTTPS.
4. Done — no CI needed; `vercel build`, `vercel deploy`, and `vercel env add` are all you need.

## Pre-publish checklist (do these before you deploy)
- [ ] Replace `salvagainchibu@gmail.com` in `index.html` with the real one.
- [ ] Replace `YOUR-HANDLE` in `index.html` with your real LinkedIn URL.
- [ ] Delete `portfolio/_preview_inline.html` (preview copy with inline CSS) — it must not ship.
- [ ] Optional: add your resume link in `script.js` or a footer link.
- [ ] Optional: remove `noindex` from `index.html` if you want search engines to index you.

## Files
- `index.html` — all content + HEAD/meta
- `styles.css` — 7 `:root` CSS variables (palette), hero sizing, `.btn` styles
- `script.js` — progressively enhanced: footer-year + one enhancement
- `README.md` — this file

## DM templates & LinkedIn posts (copy-paste ready)
Ready-to-send DM templates and LinkedIn posts are in:
- `cold_email_targets.md` — reply-to-comment + direct-email DM templates, plus a self-editing checklist and a sending tip.
- `linkedin_posts.md` — one-line "Mining Generation" post for the Nimbus sustainability role + reuse notes.

## Notes
- `_preview_inline.html` is preview-only; delete before deploy.
- Vercel deploy requires your LinkedIn handle + your action; no CI or server needed.
