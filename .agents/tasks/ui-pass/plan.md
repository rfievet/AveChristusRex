# Implementation Plan — UI/UX Pass on "Ave Christus Rex"

Target repo: `/Users/rfievet/projects/AveJesusRex` (Vite 5 + React 18 + TypeScript strict + Tailwind 3, React Router v6.30 `BrowserRouter`). Dev/preview bound to `0.0.0.0:5317` strictPort.

## Ground rules (verified against the code)

- Everything stays DATA-DRIVEN: chips/strengths derived from the loaded `TopicContent`, never hardcoded. Any topic/argument added later under `src/data/content/**` must render with no code change.
- DO NOT edit `src/data/content/**` or `.agents/research/**`. Do NOT run git/commit. A dev server is already running on 5317 — DO NOT start or kill it.
- Verification is `npm run build` (runs `tsc && vite build`) and `npm run typecheck` (`tsc --noEmit`), both MUST exit 0. Inspect `dist/` statically.
- Keep ink/parchment/gold aesthetic and Cormorant(serif)/Inter(sans) type system. Use "Ave Christus Rex" everywhere; never reintroduce "Ave Jesus Rex".

## Theming strategy decision (for item 5)

Use **Tailwind `darkMode: 'class'`**, NOT CSS variables. Rationale: the entire codebase already expresses color with Tailwind utility classes against the `ink`/`parchment`/`gold` scales (verified in every component). A CSS-variable rewrite would mean re-authoring every class to `var(...)`. With `darkMode: 'class'` the existing dark styling becomes the default and we add `dark:`-prefixed... — actually the simpler and least-touch model given "dark is default": set `<html class="dark">` as the baseline and author `light`-mode overrides. Tailwind's `dark:` variant toggles on the `.dark` class on `<html>`. Concretely:

- Keep all existing classes as the **dark (default) look**. Add a `class="dark"` to `<html>` by default via the no-flash inline script.
- For light mode, Tailwind's `dark:` approach means: write base (light) classes + `dark:` overrides. Because retrofitting every element to "light-base + dark-override" is large and error-prone, instead keep the current classes as-is (they are the dark design) and gate them behind the `dark` variant where they must differ, adding light equivalents without `dark:`. The pragmatic, lowest-risk pattern used across this plan: for each element whose current dark color must change in light mode, convert e.g. `text-parchment-50` → `text-ink-900 dark:text-parchment-50` and `bg-ink-900` → `bg-parchment-100 dark:bg-ink-900`. The existing (dark) value moves into the `dark:` slot; a readable light value becomes the base.
- Toggle = add/remove `.dark` on `document.documentElement`. Persist choice in `localStorage['theme']`; on first visit respect `prefers-color-scheme`.
- No-flash: a tiny inline script in `index.html <head>` sets `document.documentElement.classList` BEFORE React mounts.

Components/files that contain hardcoded ink/parchment/gold colors and MUST be made theme-aware (audited):
`index.html` (inline no-flash script + `<html class>`), `src/index.css` (body bg/text, `:focus-visible` ring-offset color, `::selection`), `tailwind.config.js` (`darkMode: 'class'`), `src/components/Layout.tsx` (footer bg/borders, skip-link), `src/components/NavBar.tsx` (header bg/backdrop, link states, search box, icons, mobile panel), `src/components/SearchModal.tsx` (backdrop, panel bg/border, rows, kbd), `src/components/ArgumentCard.tsx` (card bg/border, text), `src/components/Callout.tsx` (all 4 variant containers/titles/body), `src/components/SectionHeader.tsx` (border, title, count), `src/components/StrengthBadge.tsx` (the 3 strength classNames), `src/components/ReferenceBlock.tsx` (figure bg/border, cite, translation chip, blockquote), `src/components/OriginalLanguageBlock.tsx` (bg/border, text), `src/pages/Home.tsx` (hero, cards live + coming-soon), `src/pages/TopicPage.tsx` (headings, callouts wrapper, caveats `<details>`, not-found/coming-soon states), `src/pages/NotFound.tsx` (text). The new filter bar and copy/share controls (items 1–2) must be authored theme-aware from the start.

## PWA decision (for item 4)

Pin **`vite-plugin-pwa@0.21.1`** (exact). Verified: its peer range includes `vite ^5.0.0` and it depends on `workbox-build`/`workbox-window` `^7.3.0` (installed transitively). `sharp@0.33.5` is already a devDependency for icon generation. Config: `registerType: 'autoUpdate'`, `injectRegister: 'auto'`, `workbox` precache of built assets with SPA fallback (`navigateFallback: '/index.html'`), `devOptions.enabled: false` so the running dev server on 5317 is untouched. Manifest authored as a static `public/manifest.webmanifest` AND linked from `index.html`; `vite-plugin-pwa` set to `manifest: false` (we provide our own file) OR `manifest: {...}` inline — plan uses a static `public/manifest.webmanifest` + `manifest: false` to keep one source of truth and guarantee it lands in `dist/`.

---

# Items

- [ ] 1. Install and pin the PWA plugin dependency.
      Add `vite-plugin-pwa@0.21.1` to devDependencies via `npm install -D vite-plugin-pwa@0.21.1`. This also pulls workbox 7 transitively. Do not touch other versions.
      Files: `package.json`, `package-lock.json`
      Verify: `npm run typecheck` exits 0; `npx vite-plugin-pwa` resolves (import works in item 7). No dev server started.

- [ ] 2. Add `darkMode: 'class'` to Tailwind config and establish the default theme baseline.
      Set `darkMode: 'class'` in `tailwind.config.js`. No palette changes (scales already exist).
      Files: `tailwind.config.js`
      Verify: `npm run build` exits 0 (config still valid; no visual regression since `.dark` is default-on from item 3).

- [ ] 3. Add the no-flash theme bootstrap + default `dark` class in `index.html`.
      In `<head>`, before the module script, add a tiny inline script that reads `localStorage['theme']`, falls back to `prefers-color-scheme`, and sets `document.documentElement.classList.add('dark')` (or removes it) synchronously. Also set `<html lang="en" class="dark">` as the SSR-less default.
      Files: `index.html`
      Verify: `npm run build` exits 0; inspect `dist/index.html` contains the inline script and `class="dark"`.

- [ ] 4. Make shared chrome theme-aware: `index.css`, `Layout`, `NavBar`, `SearchModal`.
      Convert hardcoded dark colors to light-base + `dark:` overrides per the strategy above (body bg/text and focus-ring-offset/selection in `index.css`; footer/skip-link in Layout; header/backdrop/links/search box/icons/mobile panel in NavBar; backdrop/panel/rows/kbd in SearchModal). Preserve WCAG AA contrast in both themes.
      Files: `src/index.css`, `src/components/Layout.tsx`, `src/components/NavBar.tsx`, `src/components/SearchModal.tsx`
      Verify: `npm run build` + `npm run typecheck` exit 0; grep `dist/assets/*.css` shows both base and `.dark` rules compiled.

- [ ] 5. Make content components theme-aware: `ArgumentCard`, `Callout`, `SectionHeader`, `StrengthBadge`, `ReferenceBlock`, `OriginalLanguageBlock`.
      Same light-base + `dark:` conversion. For `StrengthBadge`, keep gold "scriptural" readable in both; give "supplementary"/"strong" light-mode equivalents. For `Callout` convert all four variant maps.
      Files: `src/components/ArgumentCard.tsx`, `src/components/Callout.tsx`, `src/components/SectionHeader.tsx`, `src/components/StrengthBadge.tsx`, `src/components/ReferenceBlock.tsx`, `src/components/OriginalLanguageBlock.tsx`
      Verify: `npm run build` + `npm run typecheck` exit 0.

- [ ] 6. Make pages theme-aware: `Home`, `TopicPage`, `NotFound`.
      Convert hero, topic cards (live + coming-soon), headings, intro-callout wrapper, "Honest caveats" `<details>`, not-found/coming-soon states, and 404 text.
      Files: `src/pages/Home.tsx`, `src/pages/TopicPage.tsx`, `src/pages/NotFound.tsx`
      Verify: `npm run build` + `npm run typecheck` exit 0.

- [ ] 7. Add the theme toggle button to `NavBar` (sun/moon), accessible + persisted.
      Add a button (desktop + mobile) that flips `.dark` on `document.documentElement` and writes `localStorage['theme']`. `aria-pressed` + `aria-label`, >=44px tap target, on-theme gold styling. Read initial state from the DOM class on mount (set by the inline script) to stay in sync; no flash.
      Files: `src/components/NavBar.tsx` (optionally a tiny `src/hooks/useTheme.ts`)
      Verify: `npm run build` + `npm run typecheck` exit 0; both themes render all audited components correctly.

- [ ] 8. Create the in-topic filter + jump-to-section bar component.
      New `src/components/TopicFilterBar.tsx`: props `{ sections: {label: string; id: string; count: number}[]; activeStrength: Strength|'all'; onStrengthChange; }`. Renders a sticky (below nav) bar: a horizontally-scrollable category chip row (each chip smooth-scrolls to its `section-<slug>` id) and strength toggle buttons (All/Scriptural/Strong/Supplementary) styled consistently with `StrengthBadge`. Mobile: `overflow-x-auto`, no page horizontal overflow at 360px, >=44px tap targets; desktop: wrap. On-theme (ink/gold, theme-aware). Sticky offset uses `top-[Npx]` matching nav height + `scroll-mt`/`scroll-padding` so headings aren't hidden.
      Files: `src/components/TopicFilterBar.tsx`
      Verify: `npm run build` + `npm run typecheck` exit 0.

- [ ] 9. Wire the filter bar into `TopicPage` with strength filtering + per-section counts.
      Add `activeStrength` state in `TopicPage`. Derive `sections` from existing `order` + `grouped` (reuse `slugify`/`section-<slug>` ids). Filter each section's args by `activeStrength`; recompute counts from filtered args; hide sections that become empty. Render `TopicFilterBar` above the sections. MUST NOT break the existing hash-scroll-from-search effect (filtering must not hide a hash-targeted card: when a hash is present, ensure its strength is visible or reset filter to 'all' before scrolling).
      Files: `src/pages/TopicPage.tsx`
      Verify: `npm run build` + `npm run typecheck` exit 0; deep-link `/topic/jesus-is-god#<id>` still scrolls+flashes.

- [ ] 10. Add Copy/Link actions to `ArgumentCard` and thread `topicId`.
      Add optional `topicId?: string` prop to `ArgumentCard`; pass it from `TopicPage` (`<ArgumentCard topicId={topicId} .../>`). Add two small on-theme icon buttons (near `StrengthBadge` or a footer row): "Copy" builds a plain-text block (title, each ref as `<citation> (<translationUsed>) — <text>`, plus `shortClaim`) via `navigator.clipboard.writeText` with a `document.execCommand('copy')`/textarea fallback; "Link" copies `${window.location.origin}/topic/${topicId}#${id}`. Show an accessible "Copied" confirmation via `aria-live="polite"`. Tap targets >=44px, keyboard-accessible.
      Files: `src/components/ArgumentCard.tsx`, `src/pages/TopicPage.tsx`
      Verify: `npm run build` + `npm run typecheck` exit 0.

- [ ] 11. Add Open Graph + Twitter Card meta to `index.html`.
      Add `og:title` "Ave Christus Rex", `og:description` (reuse the existing description), `og:type` website, `og:image` → `/apple-touch-icon.png`, `twitter:card` summary, `twitter:title`/`twitter:description`. Keep existing favicon/theme-color/description tags. Relative image paths are fine (no domain yet).
      Files: `index.html`
      Verify: `npm run build` exits 0; `dist/index.html` contains the OG/Twitter tags.

- [ ] 12. Generate PWA PNG icons from the SVG with a dev-only sharp script.
      New `scripts/generate-icons.mjs` using `sharp` to render `public/favicon.svg` → `public/pwa-192.png` (192x192) and `public/pwa-512.png` (512x512). `apple-touch-icon.png` (180x180) already exists and is reused. Run `node scripts/generate-icons.mjs`.
      Files: `scripts/generate-icons.mjs`, `public/pwa-192.png`, `public/pwa-512.png`
      Verify: `ls public/pwa-192.png public/pwa-512.png` exist with correct sizes (`sharp` metadata or `file`); `npm run build` copies them to `dist/`.

- [ ] 13. Add the web app manifest and link it.
      New `public/manifest.webmanifest`: `name` "Ave Christus Rex", `short_name` "Christus Rex", `theme_color` `#0e1526`, `background_color` `#0e1526`, `display` standalone, `start_url` "/", `icons` → `apple-touch-icon.png` 180, `pwa-192.png` 192, `pwa-512.png` 512 (include a `purpose: "any maskable"` entry). Link `<link rel="manifest" href="/manifest.webmanifest">` in `index.html`.
      Files: `public/manifest.webmanifest`, `index.html`
      Verify: `npm run build` exits 0; `dist/manifest.webmanifest` present and linked in `dist/index.html`.

- [ ] 14. Wire `vite-plugin-pwa` for offline caching without disturbing dev/preview.
      In `vite.config.ts` add `VitePWA({ registerType: 'autoUpdate', injectRegister: 'auto', manifest: false, workbox: { navigateFallback: '/index.html', globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'] }, devOptions: { enabled: false } })` to `plugins`. DO NOT change the `server`/`preview` host(0.0.0.0)/port(5317)/strictPort blocks.
      Files: `vite.config.ts`
      Verify: `npm run build` exits 0; `dist/sw.js` (service worker) and `dist/workbox-*.js` present; `dist/index.html` still linked to manifest; server/preview config unchanged (grep confirms 5317/strictPort intact).

- [ ] 15. Update `README.md`.
      Document: the in-topic category/jump + strength filter, the per-argument Copy/Link buttons, the light/dark (parchment/ink) theme toggle (persisted + prefers-color-scheme), and PWA/offline "Add to Home Screen" install. Keep existing Search/Run/Structure sections accurate.
      Files: `README.md`
      Verify: `npm run build` exits 0 (docs don't affect build; sanity check links).

## Verification checklist (run at the end)

- [ ] `npm run build` exits 0 (tsc + vite build clean)
- [ ] `npm run typecheck` exits 0 (strict, no type errors)
- [ ] `dist/` contains: `manifest.webmanifest`, `sw.js` (+ workbox runtime), `pwa-192.png`, `pwa-512.png`
- [ ] `dist/index.html` contains: OG + Twitter meta, manifest link, no-flash inline script, `class="dark"` default
- [ ] `vite.config.ts` still has `server`/`preview` host `0.0.0.0`, port `5317`, `strictPort: true`
- [ ] No edits under `src/data/content/**` or `.agents/research/**`; still fully data-driven (new topics/args render automatically)
- [ ] 360px viewport: no horizontal overflow; filter chip bar scrolls horizontally; tap targets >=44px
- [ ] Both themes (ink default + parchment light) render all components with AA contrast; no flash of wrong theme on load
- [ ] Existing search hash-scroll + `.search-flash` deep-link still works

## Assumptions / gaps noted

- Nav height for the filter bar's sticky offset: measured from `NavBar` (`py-3` + content ≈ 56–60px). Use a `top-14`/`top-[57px]` matching value and verify no heading is obscured.
- No production domain exists, so OG `og:url` is omitted and `og:image` uses a root-relative path (acceptable per task).
- `manifest: false` in the plugin means our static `public/manifest.webmanifest` is the single source of truth; the plugin only generates the service worker.
