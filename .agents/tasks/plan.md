# Implementation Plan — Ave Jesus Rex

A brand-new, future-proof **Vite + React + TypeScript + Tailwind CSS** Catholic apologetics
site. Empty workspace at `/Users/rfievet/projects/AveJesusRex`; scaffold from scratch, no worktree.
Environment: Node v20.20.2, npm 10.8.2, macOS.

## Design decisions (locked)

- **Stack: Vite + React + TypeScript.** The research is already structured, typed-friendly JSON;
  TypeScript lets us model the `Argument`/`Topic` shapes once and have the compiler guarantee that
  future data edits stay valid. This directly serves the user's "edit data only, keep it typed" goal.
- **Routing: `react-router-dom` v6** with `BrowserRouter`. One data-driven `/topic/:topicId` route
  renders any topic from config; `/` is the landing page. Adding a topic = adding data, no new routes.
- **Data lives in `src/data/`.** The two research JSON files are copied into `src/data/content/` and
  imported into typed `.ts` modules (`resolveJson(...) as Topic`). The user extends the site by editing
  `src/data/content/*.json` or the topics registry — never components. `resolveJsonModule` is enabled
  in `tsconfig`.
- **Strength badge** renders as a visible pill via a dedicated `StrengthBadge` component, colored per
  level (`scriptural` = gold/emerald, `strong` = amber, `supplementary` = slate).
- **Palette "sacred but modern":** deep navy/charcoal background (`ink`), warm parchment surface
  option, gold/amber accents (`gold`). Serif display font **Cormorant Garamond** for headings, sans
  **Inter** for body — loaded via Google Fonts in `index.html` and wired into the Tailwind theme.
- **Port 5317, strictPort, host 0.0.0.0** so the phone on the same wifi reaches it at
  `http://192.168.12.101:5317`.
- **Coming-soon topics** (Trinity, Real Presence/Eucharist, Papacy, Marian doctrine) are entries in
  the same topics registry with `status: "coming-soon"`, rendered as disabled/teaser cards. Future-proof:
  flipping one to `"live"` and adding a data file publishes it.

## Data model (TypeScript)

```ts
type Strength = "scriptural" | "strong" | "supplementary";

interface Reference {
  citation: string;
  translationUsed: string;
  text: string;
}

interface OriginalLanguage {
  language: string;
  text: string;
  translit: string;
  note: string;
}

interface Argument {
  id: string;
  title: string;
  shortClaim: string;
  category: string;
  strength: Strength;
  primaryReferences: Reference[];
  originalLanguage?: OriginalLanguage; // optional — only 16/22 jesus-is-god args, 0 jw args
  nwtRebuttal?: string;                // optional — present on jesus-is-god args, absent on jw args
  explanation: string;
}

interface TopicContent {
  title: string;
  subtitle?: string;
  disclaimer?: string;         // jw-critique
  displayTranslation?: string; // jesus-is-god
  displayTranslationNote?: string;
  divineNameNote?: string;
  methodologyNote?: string;
  categories?: string[];       // jesus-is-god ordered categories
  subCategories?: string[];    // jw-critique ordered sub-categories
  arguments: Argument[];
  uncertainCitations?: { citation: string; issue: string }[];
}

interface TopicMeta {
  id: string;              // "jesus-is-god", "jw-critique", "trinity", ...
  navLabel: string;        // short label for nav
  title: string;
  blurb: string;           // one-line landing-card description
  status: "live" | "coming-soon";
  accent?: string;         // optional theme hint
  loadContent?: () => TopicContent; // present only for live topics
}
```

Both research files already match the `Argument` shape field-for-field. `category` on each argument
corresponds to the topic's `categories`/`subCategories` ordering, which drives the on-page section grouping.

## Research → topic/section mapping

- **Topic `jesus-is-god`** ← `src/data/content/jesus-is-god.json` (22 arguments). Sections, in order,
  from `categories`: Addressed as God (6), Does what only God does (3), Claims the divine name/identity (4),
  Receives worship (3), Old Testament titles of YHWH applied to Jesus (5), Supplementary/traditional (1).
  Group arguments by `argument.category`; render `displayTranslation`/methodology/divine-name notes as
  intro callouts; render `uncertainCitations` in a collapsible "Honest caveats" section.
- **Topic `jw-critique`** ← `src/data/content/jw-critique.json` (22 arguments). Sections from
  `subCategories`: Historical gap problem (3), Failed/revised predictions (4), New World Translation
  issues (5), Doctrinal novelties (8), Authority problem (2). Render `disclaimer` prominently at the
  top (critiques the organization/doctrine, not individuals).
- **Coming-soon topics** `trinity`, `eucharist`, `papacy`, `marian`: registry entries only, no content file.

## Steps

- [ ] 1. Scaffold Vite + React + TypeScript project and install deps.
      Create `package.json` (scripts: `dev`, `build`, `preview`, `typecheck`), `tsconfig.json`
      (+`tsconfig.node.json`) with `resolveJsonModule` and `strict` on, `vite.config.ts` with
      `server: { host: '0.0.0.0', port: 5317, strictPort: true }` and `preview` on the same port,
      `index.html` (Google Fonts preconnect + Cormorant Garamond & Inter), `src/main.tsx`,
      `src/App.tsx` (minimal shell), `.gitignore`. Add deps: `react`, `react-dom`, `react-router-dom`;
      devDeps: `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`,
      `@types/react`, `@types/react-dom`.
      Files: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`,
      `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `.gitignore`
      Verify: `npm install` then `npm run build` succeeds (clean TS + Vite build).

- [ ] 2. Configure Tailwind + PostCSS and the "sacred but modern" theme.
      `tailwind.config.js` (content globs `./index.html`, `./src/**/*.{ts,tsx}`; theme.extend:
      `colors.ink`, `colors.parchment`, `colors.gold`; `fontFamily.serif = ['Cormorant Garamond', ...]`,
      `fontFamily.sans = ['Inter', ...]`), `postcss.config.js`, `src/index.css` (Tailwind directives +
      base body background/typography). Import `index.css` in `main.tsx`.
      Files: `tailwind.config.js`, `postcss.config.js`, `src/index.css`
      Verify: `npm run build` succeeds; built CSS contains the custom color/font utilities.

- [ ] 3. Add typed data layer and copy research JSON into the app.
      Copy `.agents/research/jesus-is-god.json` and `jw-critique.json` into `src/data/content/`.
      Create `src/data/types.ts` (interfaces above), `src/data/content/jesus-is-god.ts` and
      `jw-critique.ts` (import the JSON, `export default data as TopicContent`), and
      `src/data/topics.ts` — the ordered topic registry with the two live topics (lazy `loadContent`)
      and the four coming-soon entries. Export helpers `getTopicMeta(id)` and `listTopics()`.
      Files: `src/data/types.ts`, `src/data/topics.ts`, `src/data/content/jesus-is-god.{json,ts}`,
      `src/data/content/jw-critique.{json,ts}`
      Verify: `npm run build` succeeds (JSON imports typecheck against `TopicContent`).

- [ ] 4. Build reusable presentation components.
      `StrengthBadge` (visible colored pill per strength), `ReferenceBlock` (citation + translation +
      verse text), `OriginalLanguageBlock` (Greek/Hebrew + translit + note, rendered only when present),
      `ArgumentCard` (title, StrengthBadge, shortClaim, references, optional original language, optional
      `nwtRebuttal` callout, explanation), `Callout` (for notes/disclaimers), `SectionHeader`.
      Files: `src/components/StrengthBadge.tsx`, `src/components/ArgumentCard.tsx`,
      `src/components/ReferenceBlock.tsx`, `src/components/OriginalLanguageBlock.tsx`,
      `src/components/Callout.tsx`, `src/components/SectionHeader.tsx`
      Verify: `npm run build` succeeds.

- [ ] 5. Build layout, nav, Home landing page, and the data-driven Topic page; wire routing.
      `src/components/NavBar.tsx` (data-driven from `listTopics()`, mobile hamburger, sticky),
      `src/components/Layout.tsx` (nav + footer + outlet), `src/pages/Home.tsx` (hero "Ave Jesus Rex",
      topic cards incl. coming-soon teasers), `src/pages/TopicPage.tsx` (reads `:topicId`, loads content,
      renders intro callouts, groups arguments by `categories`/`subCategories` into sections of
      `ArgumentCard`s, renders `uncertainCitations`), `src/pages/NotFound.tsx`. Define routes in
      `App.tsx` with `BrowserRouter`.
      Files: `src/components/NavBar.tsx`, `src/components/Layout.tsx`, `src/pages/Home.tsx`,
      `src/pages/TopicPage.tsx`, `src/pages/NotFound.tsx`, `src/App.tsx`
      Verify: `npm run build` succeeds. Optional smoke test: `npm run dev` in background, `sleep 2`,
      `curl -s http://localhost:5317 | grep -i "ave jesus rex"`, then STOP the server. Do not leave
      a server running.

- [ ] 6. Mobile polish and accessibility pass.
      Ensure phone-first layout (readable line length, tap targets >=44px, no horizontal scroll),
      semantic landmarks (`header`/`main`/`nav`/`footer`), skip-to-content link, `lang="en"`, visible
      focus rings, color contrast on gold/ink. Verify responsive classes across components.
      Files: `src/index.css`, components/pages as needed
      Verify: `npm run build` succeeds; manual check of responsive classes.

- [ ] 7. Write README.md.
      Cover: what the site is; run instructions (`npm install`, `npm run dev`); the phone URL
      `http://192.168.12.101:5317` (note it's the dev machine's LAN IP, phone on same wifi); the data
      model (Argument/Topic shapes); and a step-by-step "How to add a new argument" and "How to add a
      new topic (coming-soon → live)" guide pointing at `src/data/`.
      Files: `README.md`
      Verify: `npm run build` still succeeds; README links/paths are accurate.

- [ ] 8. Final verification and cleanup.
      Run the full build; run `npm run typecheck`. Optionally re-run the dev-server smoke test on 5317
      and stop it. Ensure no dev/preview server is left running and nothing is committed (no git
      operations unless the user asks).
      Files: none
      Verify: `npm install && npm run build` succeed from a clean state; `npm run typecheck` passes.

## Notes / assumptions

- The LAN IP `192.168.12.101` comes from the task prompt; the README notes it is the dev machine's
  current wifi address and may differ on another network (`vite` prints the actual Network URL on start).
- JSON is imported (not hand-retyped) so the research stays the single source of truth; `nwtRebuttal`
  and `originalLanguage` are optional in the type because jw-critique arguments omit them.
- No test framework is set up because this is a static content site; verification is the TypeScript
  build (`npm run build` runs `tsc` + Vite) plus the optional curl smoke test. If richer testing is
  wanted later, add Vitest + React Testing Library.
