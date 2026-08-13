import { defineConfig } from 'vite'

// `base: './'` makes all asset URLs relative, so the built site works
// under any GitHub Pages subpath (e.g. https://<user>.github.io/<repo>/)
// and also locally via `file://`.
export default defineConfig({
  base: './',
})
