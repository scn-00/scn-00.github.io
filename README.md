# Chunnan Shang — Academic Homepage

A lightweight, single-page academic homepage built with **Vite**.
All content lives in decoupled YAML files under [`content/`](content/) — update the
YAML, rebuild, done. No code changes needed for day-to-day edits.

## Quick start

```bash
npm install     # first time only
npm run dev     # local dev server → http://localhost:5173
npm run build   # production build → dist/
npm run preview # preview the production build locally
```

## Updating content

Everything shown on the page is driven by YAML — no HTML/JS edits required:

| File                        | What it controls                                    |
| --------------------------- | --------------------------------------------------- |
| `content/site.yaml`         | Name, role, photo, tagline, bio, nav & profile links |
| `content/papers.yaml`       | Publications list (add / remove entries freely)      |
| `content/education.yaml`    | Education timeline                                  |
| `content/experience.yaml`   | Experience / internship timeline                    |

Common edits:

- **New paper** — append an entry to `content/papers.yaml`. Each entry supports
  `title`, `authors`, `venue`, optional `badge` (e.g. `Highlight`), and a `links`
  map rendered as buttons (`Paper: <arxiv url>`, `Code: <github url>`, …).
  Authors matching the site owner's name are **bolded automatically**.
- **New photo** — drop any `.jpg/.jpeg/.png/.webp` into [`assets/`](assets/) and set
  `photo:` in `content/site.yaml`.
- **New links** — edit the `links:` list in `content/site.yaml`. Icons live in
  [`public/logos/`](public/logos/) (SVGs fetched from [simple-icons](https://simpleicons.org) /
  [lucide](https://lucide.dev)); add a new file there and reference it by name.
- **New section** — render functions in `src/main.js` are one function per section;
  add a section by writing one small render function (e.g. `renderAwards`) and
  adding a nav entry in `content/site.yaml`.

## Deploying to GitHub Pages

`vite.config.js` already uses `base: './'`, so the build works under any
subpath (`https://<user>.github.io/<repo>/`).

1. `npm run build`
2. Push the `dist/` folder to the `gh-pages` branch:

   ```bash
   npm run build
   npx gh-pages -d dist
   ```

   (or use the official
   [GitHub Pages action](https://github.com/actions/deploy-pages) with an
   `actions/upload-pages-artifact` step uploading `dist/`).

3. In the repo **Settings → Pages**, set the source to the `gh-pages` branch
   (or enable Actions-based deployment).

## Structure

```
assets/              ← your photos (edit site.yaml to switch)
content/             ← all page content as YAML
public/logos/        ← social icons (GitHub / Google Scholar / Mail)
src/main.js          ← renders YAML → HTML
src/style.css        ← styling (warm academic theme)
vite.config.js       ← base: './' for GitHub Pages
```
