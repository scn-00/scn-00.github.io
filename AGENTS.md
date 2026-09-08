# AGENTS.md

Guide for AI coding agents working on this repository. Read this first.

## Project overview

A single-page academic homepage for **Chunnan Shang** (PhD student, Zhejiang
University). Built with Vite 8 + vanilla JavaScript (no framework). The page is
**content-driven**: everything displayed is rendered at runtime from YAML files
in [`content/`](content/) — editing content never requires touching JS/CSS.

The design is a "warm academic" style: off-white background, serif display
headings (Newsreader), soft rose accent (`#bf6a70`), arched portrait photo.

## Commands

```bash
npm install     # install deps (vite, yaml)
npm run dev     # dev server → http://localhost:5173
npm run build   # production build → dist/
npm run preview # serve the production build
```

## Project structure

```
assets/            ← photos referenced from content/site.yaml (picked up via import.meta.glob)
content/           ← ALL page content as YAML (the only files you edit for content changes)
  site.yaml        ← identity, photo, bio, nav, profile links
  papers.yaml      ← publications list
  education.yaml   ← education timeline
  experience.yaml  ← internship / experience timeline
public/logos/      ← social icons (github.svg, googlescholar.svg, mail.svg)
src/main.js        ← renders YAML → HTML (one render function per section)
src/style.css      ← all styling (CSS custom properties for the theme)
index.html         ← shell, fonts, meta
vite.config.js     ← sets base: './' so dist/ works under any GitHub Pages subpath
```

## Architecture & data flow

1. `src/main.js` imports each YAML file as a raw string (`import siteYaml from
   '../content/site.yaml?raw'`) and parses with the `yaml` package
   (`YAML.parse(...)`).
2. `import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', { eager: true,
   query: '?url', import: 'default' })` resolves the `photo:` field from
   `site.yaml` to a bundled URL. The photo asset is hashed into `dist/assets/`.
3. `app.innerHTML = [...]` mounts: nav → hero → publications → education →
   experience → footer.
4. All YAML-derived strings are passed through `escapeHtml()` before entering
   the DOM. Keep this invariant when adding render functions.

## Editing content (common tasks)

### Add a paper

Append to `content/papers.yaml`. Supported fields:

```yaml
- title: "Paper Title"
  authors: [Author A, Chunnan Shang, Author B]   # site owner auto-bolded
  venue: CVPR 2026
  badge: Highlight          # optional pill next to venue; omit for none
  links:                    # optional list of { label, url, icon } icon links
    - label: arXiv
      url: https://arxiv.org/abs/xxxx
      icon: arxiv.svg        # must exist in public/logos/
    - label: GitHub
      url: https://github.com/user/repo
      icon: github.svg
```

Author bolding is automatic: any author string equal to `site.name` is wrapped
in `<strong>` (`renderAuthors`).

### Change the photo

Drop a new image into `assets/` and update `photo:` in `content/site.yaml`
(e.g. `photo: new.jpg`). No other change needed.

### Add a profile link

Add an entry to the `links:` list in `content/site.yaml`:

```yaml
- label: OpenReview
  url: https://openreview.net/profile?id=...
  icon: openreview.svg   # must exist in public/logos/
```

Icons are `<img>` tags pointing at `public/logos/<icon>`. To add a new icon,
download an SVG (e.g. from simple-icons: `https://cdn.simpleicons.org/<name>`)
into `public/logos/`.

### Add a whole new section

Sections are one render function each. To add e.g. "Awards":

1. Write `renderAwards()` in `src/main.js` returning HTML, optionally reading a
   new YAML file (follow the existing `import ...Yaml from '../content/x.yaml?raw'`
   pattern — no build config needed for new files).
2. Add `{ label: Awards, href: '#awards' }` to `nav:` in `content/site.yaml`.
3. Add `renderAwards()` to the `app.innerHTML` template literal.

## Pitfalls & conventions

- **`links` in papers.yaml is a list of objects (`{ label, url, icon }`), not a
  map.** Render with `.map()` over the list; `icon` resolves via the `logo()`
  helper like hero links. (A previous bug shipped when this was a map.)
- **Use the `yaml` npm package, not `js-yaml`.** js-yaml is CommonJS and breaks
  Vite 8's rolldown bundling ("Missing export").
- **`base: './'` in vite.config.js is intentional** — it lets the built site run
  under any GitHub Pages subpath. Don't change it to '/' unless a custom domain
  is used.
- **public/logos and public assets are copied verbatim to dist/**; anything
  referenced from `content/*.yaml` that is *not* in `assets/` should live in
  `public/` to survive the build.
- Escape all YAML values with `escapeHtml()` before interpolating into HTML.
- Keep the theme tokens in `:root` in `src/style.css`; the accent color and
  fonts are centralized there.

## Verification workflow

Headless Chrome can be used to verify rendering without a browser:

```bash
npm run build
npx vite preview --port 5198 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --enable-logging=stderr --v=0 \
  --dump-dom --virtual-time-budget=10000 http://localhost:5198/ 2>/tmp/chrome-err.log
```

Then grep the dumped DOM for expected content and check `/tmp/chrome-err.log`
for `CONSOLE` errors. Note: `--dump-dom` alone does not wait for ES modules —
use `--virtual-time-budget` and check for runtime errors in the log.

## Deployment (GitHub Pages)

```bash
npm run build
npx gh-pages -d dist
```

Repo Settings → Pages → deploy from `gh-pages` branch (or use the official
`actions/deploy-pages` action with `dist/` as the artifact).
