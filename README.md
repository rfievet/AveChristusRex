# Ave Christus Rex

A Catholic apologetics resource that lays out a source-cited case for the
truths of the Christian faith — starting with the divinity of Jesus Christ. Every claim is
paired with its Scripture reference, the original-language text where it matters, the
disputed translation it answers, and an honest strength rating. It is built to be read on a
phone during a conversation or debate.

Two topics are live today:

- **Jesus Is God** (`The Divinity of Christ`) — the arguments that Jesus is God, each with its
  sources and the New World Translation rendering it disputes.
- **Jehovah's Witnesses** (`Examining the Watch Tower`) — why the Watch Tower organization's
  claim to be the restored true religion is historically and doctrinally problematic.

Four more topics are stubbed as **coming soon**: The Trinity, The Real Presence (Eucharist),
The Papacy, and Marian Doctrine. They appear in the UI as non-interactive placeholders until
their content is written (see [How to add a new topic](#how-to-add-a-new-topic)).

The site is a static, client-only single-page app: Vite + React + TypeScript + Tailwind CSS,
rendered entirely from local JSON data. There is no backend and no database.

The site is bilingual: English (`en`, the default) and French (`fr`). See
[Internationalization (i18n)](#internationalization-i18n) for how locales work and how to add a
third language — it is data-only.

## Search

A command-palette style search is available from every page — handy mid-conversation on a
phone. Open it with the **Search** box in the top bar (or the magnifier icon on mobile), or
with a keyboard shortcut.

Keyboard shortcuts:

| Shortcut            | Action                                      |
| ------------------- | ------------------------------------------- |
| `Cmd/Ctrl + K`      | Open (or toggle) the search palette          |
| `/`                 | Open search (ignored while typing in a field) |
| `↑` / `↓`           | Move between results                         |
| `Enter`             | Open the highlighted result                  |
| `Esc`               | Close the palette                            |

It searches **every topic and every individual argument** — titles, one-line claims,
categories, the full explanation, the New World Translation rebuttal, the original-language
text/transliteration, and all Scripture quotations. Selecting an argument jumps straight to
`/topic/<topicId>#<argumentId>` and flashes a brief gold highlight on that card.

Scripture matching is punctuation- and case-tolerant, so a debater can type `John 1:1`,
`Col 1:16`, or `colossians 1 16` and land on the right argument. Topics (including the
coming-soon ones) are indexed too, so `trinity` or `watch tower` finds the topic; coming-soon
results are labelled and link to the topic page rather than a non-existent argument.

The search index is built from the topic registry (`listTopics()` + each live topic's
`loadContent()`), so **arguments and topics you add under `src/data` are searched
automatically** — no search code to touch. The index lives in
[`src/search/searchIndex.ts`](src/search/searchIndex.ts) and the UI in
[`src/components/SearchModal.tsx`](src/components/SearchModal.tsx).

Known limits: matching is token-based substring (AND across words), not fuzzy — a misspelled
word (`forgivs`) won't match, and verse ranges or alternate book abbreviations that differ
from the stored citation (e.g. typing `Jn` when the data says `John`, or `1 Cor` vs the stored
form) only match if the typed tokens appear in the stored citation text.

## Reading mode (light / dark)

The site ships with two themes built on Tailwind's `darkMode: 'class'`:

- **Ink (dark)** — the default. Dark navy background with warm parchment text, tuned for
  low-light debates on a phone.
- **Parchment (light)** — a warm off-white reading mode with dark ink text.

A toggle in the NavBar (sun in dark mode, moon in light mode) flips the theme and saves the
choice to `localStorage` under the `theme` key, so it persists across visits. On a first visit
with no saved choice, the site follows the device's `prefers-color-scheme`, defaulting to dark.

A small inline script in `index.html` applies the saved/preferred theme synchronously before
React mounts, so there is no flash of the wrong theme on reload. Components are authored
light-base with `dark:` overrides (the previous dark values), so new UI should follow the same
pattern to stay theme-aware.

## Internationalization (i18n)

The site ships in two languages and is built so that adding a third is **data-only** — no
component, routing, or search code changes.

### The locale concept

A **locale** is one supported language. English (`en`) is the default/original language and
French (`fr`) is the first added language. Every piece of user-facing text resolves per locale:

- **UI chrome** (nav labels, buttons, filter labels, footer, 404, etc.) comes from a typed
  strings table per locale under [`src/i18n/strings/`](src/i18n/strings/) (`en.ts`, `fr.ts`),
  both implementing the `UiStrings` interface in `types.ts`. A missing key is a **compile
  error**, and `getStrings(locale)` deep-merges the locale table over English so any gap in a
  future locale silently falls back to English rather than rendering blank.
- **Topic content** (the arguments themselves) comes from per-locale JSON — see the
  `content/<locale>/` layout below.
- **Registry labels** (`navLabel`/`title`/`blurb` in `topics.ts`) are `LocalizedString`
  records (`{ en: string } & Partial<Record<LocaleCode, string>>`) resolved with a
  `value[locale] ?? value.en` fallback.

Locale state mirrors the theme pattern: it is persisted in `localStorage` under the `locale`
key, a synchronous inline script in `index.html` sets `<html lang>` before React mounts, and a
switcher in the NavBar (next to the theme toggle) flips the active language. The switcher keeps
you on the same page, preserving the path remainder and the `#argument` hash.

### `content/<locale>/` layout

Each topic's content JSON lives in a per-locale subfolder, with the **same filename** in each
locale:

```
src/data/content/
  en/
    jesus-is-god.json      English (authoritative) content
    objections.json
    jw-critique.json
    sources.json
  fr/
    jesus-is-god.json      French translation — same ids, slugs, order, counts
    objections.json
    jw-critique.json
    sources.json
  jesus-is-god.ts          locale-aware typed re-export (imports en + fr)
  objections.ts
  jw-critique.ts
  sources.ts
```

Each `content/<topic>.ts` imports every locale's JSON and exposes a `byLocale` map; the topic
registry's `loadContent(locale)` returns `byLocale[locale] ?? byLocale.en`, so a topic not yet
translated into a locale shows its English content instead of a blank page.

**Translation invariants (what must stay identical across locales):** argument `id` values and
topic slugs are URL anchors and must byte-match English; the argument count and order must
match English per topic; the `featured` id array (only `jesus-is-god` has one) must match
English; and every argument's `category` must exactly equal one of that file's translated
`categories`/`subCategories` labels (the page groups by exact-string match). Only human-readable
text is translated. Scripture `text` for a real Bible verse uses the locale's Bible (French uses
the Bible de Jérusalem, `translationUsed: "BJ"`); New World Translation quotes stay labelled NWT
(named in French as the *Traduction du monde nouveau, TMN*) and are not re-rendered; `"N/A — …"`
provenance labels keep their structure with only the prose translated. Structured
`originalLanguage` blocks keep their Greek/Hebrew `text`/`translit` and relabel `language` to the
locale term (French: `Grec`/`Hébreu`).

### The `LOCALES` registry

[`src/i18n/locales.ts`](src/i18n/locales.ts) is the single source of truth for supported
locales:

```ts
export type LocaleCode = 'en' | 'fr'

export const LOCALES: LocaleMeta[] = [
  { code: 'en', label: 'English',  htmlLang: 'en', isDefault: true },
  { code: 'fr', label: 'Français', htmlLang: 'fr' },
]
```

It also owns the URL-prefix policy via `resolveLocaleFromPath()` and `withLocalePath()`, so the
switcher, in-app links, search result hrefs, and the argument copy-link all agree.

### URL scheme + backward compatibility

The locale is an **optional first path segment**, and the default locale carries **no prefix**:

| Locale | Home | Topic | Deep link |
| ------ | ---- | ----- | --------- |
| `en` (default) | `/` | `/topic/jesus-is-god` | `/topic/jesus-is-god#thomas-my-lord-my-god` |
| `fr` | `/fr/` | `/fr/topic/jesus-is-god` | `/fr/topic/jesus-is-god#thomas-my-lord-my-god` |

Because the default locale is unprefixed, **every existing English URL keeps working exactly as
before** — bookmarks, pasted links, and PWA deep links all resolve with no redirect. A URL that
explicitly names `/en/...` is redirected to the unprefixed canonical form (so `en` is never a
live prefix). A shared `/fr/...` link always renders French because the URL is authoritative; a
bare URL always renders English regardless of any saved preference.

### Add a third language (data-only)

To add, say, Spanish — no component, page, route, or search code changes:

1. **Registry:** add the code to the `LocaleCode` union and a `LOCALES` entry in
   [`src/i18n/locales.ts`](src/i18n/locales.ts), e.g.
   `{ code: 'es', label: 'Español', htmlLang: 'es' }`.
2. **UI strings:** add `src/i18n/strings/es.ts` implementing `UiStrings` (TypeScript enforces
   completeness; until done, any missing key falls back to English).
3. **Content:** add `src/data/content/es/<topic>.json` for each topic, keeping the same
   filenames and the translation invariants above (same ids, order, counts, featured, and
   category-label lockstep). Choose the Spanish Bible for `translationUsed` the way French uses
   `BJ`.
4. **Wire up:** add the `es` key to each `content/<topic>.ts` `byLocale` map, and add `es`
   values to each topic's `navLabel`/`title`/`blurb` in `topics.ts`.
5. **Inline script:** add `'es'` to the `NON_DEFAULT` array in the `index.html` locale script —
   it is a hand-maintained mirror of the registry's non-default codes (the pre-React inline
   script cannot import the module), and it is the one line that must change there.

Run `npm run build` and `npm run typecheck` to confirm.

## In-topic navigation & filtering

Long topics (the Jesus-is-God case runs to 22+ arguments) carry a sticky control bar that
appears just below the NavBar on each `/topic/:id` page:

- **Category jump chips** — one chip per section, each showing the section label and its
  current argument count. Tapping a chip smooth-scrolls to that section heading (fully clear
  of the sticky nav and filter bar). On a phone the chip row scrolls horizontally; on wider
  screens the chips wrap.
- **Strength filter** — `All`, `Scriptural`, `Strong`, `Supplementary` toggles that filter
  which argument cards show. Selecting a strength updates every section's count, hides
  sections that become empty, and `All` restores everything. The active toggle is marked with
  `aria-pressed` and styled to match the per-strength badge colours.

The chips and counts are derived entirely from the loaded topic content, so newly added
categories or arguments appear in the bar automatically with no code change. Deep links from
search (`/topic/<id>#<argumentId>`) reset the filter to `All` so the target card is always
reachable, keeping the jump-and-flash highlight intact.

## Copy & share arguments

Every argument card carries two small, keyboard-accessible icon buttons in its header, next
to the strength badge:

- **Copy** — places a clean, plain-text block on the clipboard: the argument title, each
  primary reference formatted as `<citation> (<translationUsed>) — <text>`, then the short
  claim. Ready to paste into a message mid-debate.
- **Link** — copies an absolute deep link to that exact argument, built through the base- and
  locale-aware helpers so it includes the deploy base and the active locale prefix
  (e.g. `https://…/AveChristusRex/topic/<id>#<arg>` in English,
  `https://…/AveChristusRex/fr/topic/<id>#<arg>` in French). It is the same route pattern search
  results use, so a pasted link lands on — and flashes — the right card.

Both buttons use the async Clipboard API with a `<textarea>` + `execCommand('copy')` fallback
for insecure contexts and older browsers. A brief, `aria-live` "Copied" confirmation appears
after a successful copy and clears itself after ~1.5s (animation respects
`prefers-reduced-motion`).

## Run it locally

Requirements: Node 20+ and npm.

```bash
npm install
npm run dev
```

The dev server runs on **port 5317** (fixed — it fails loudly rather than silently moving to
another port). Open <http://localhost:5317> on the dev machine.

To preview the production build instead:

```bash
npm run build
npm run preview   # also serves on port 5317
```

## View it on your phone

The dev server binds to `0.0.0.0`, so any device on the **same wifi** can reach it. With the
phone on the same network, open:

```
http://192.168.12.101:5317
```

`192.168.12.101` is the dev machine's current LAN IP address. If that machine's IP has
changed, use the **Network** URL that `vite` prints in the terminal at startup — it shows the
live address to type on the phone, for example:

```
  ➜  Local:   http://localhost:5317/
  ➜  Network: http://192.168.x.x:5317/
```

## Install on your phone (PWA / offline)

The site is a Progressive Web App. From the production build (`npm run build` + `npm run
preview`, or any static host) you can **Add to Home Screen** on a phone — iOS Safari (Share →
Add to Home Screen) or Android Chrome (install prompt) — and it launches standalone, without
browser chrome, using the app icon and the ink theme color.

A service worker precaches the built assets, so once the app has loaded it keeps working
**offline** — handy for a debate on spotty signal. Client-side routes (`/`, `/topic/:id`, and
the 404) fall back to the app shell, so deep links and refreshes resolve offline too. The
worker uses `autoUpdate`, so a new build is picked up automatically on the next visit.

The service worker is generated at build time by
[`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) and only ships in the production build —
it is disabled in dev, so the running dev server is unaffected. The install metadata lives in
[`public/manifest.webmanifest`](public/manifest.webmanifest); the app icons
(`pwa-192.png`, `pwa-512.png`) are generated from `public/favicon.svg` with
`node scripts/generate-icons.mjs` (re-run that after editing the SVG).

The `<head>` also carries Open Graph and Twitter Card meta, so a pasted link renders a tidy
preview (title, description, and the app icon) in chat apps and social feeds.

## Project structure

```
index.html                  App entry HTML
vite.config.ts              Vite config (port 5317, host 0.0.0.0, strictPort)
tailwind.config.js          Theme tokens (ink / parchment / gold scales, serif + sans fonts)
src/
  main.tsx                  React bootstrap
  App.tsx                   Routes: / , /topic/:topicId , * (404), all inside Layout
  index.css                 Tailwind layers + base styles (focus rings, overflow guards)
  i18n/
    locales.ts              Locale registry (LOCALES) + URL helpers (resolve/withLocalePath)
    strings/                Per-locale UI chrome strings (types.ts, en.ts, fr.ts, index.ts)
    LocaleProvider.tsx      Locale context + LocaleRouter (peels the /fr prefix, sets locale)
    useLocale.ts            Active locale + setLocale (persists, navigates, sets <html lang>)
    useStrings.ts           The active locale's UiStrings
    useDocumentMeta.ts      Syncs document.title / meta description per locale
  data/
    types.ts                The data model (Argument, Topic, strength levels, LocalizedString)
    topics.ts               Topic registry + listTopics() / getTopicMeta() (localized labels)
    content/
      en/<topic>.json       English (authoritative) content per topic
      fr/<topic>.json       French translation per topic (same ids/order/counts)
      <topic>.ts            Locale-aware typed re-export (byLocale map, en fallback)
  search/
    searchIndex.ts          Data-driven search index + scoring (built from the topic registry)
  components/               StrengthBadge, ArgumentCard, ReferenceBlock, OriginalLanguageBlock,
                            Callout, SectionHeader, NavBar, Layout, SearchModal
  pages/                    Home, TopicPage, NotFound
```

The research source files live under `.agents/research/` (outside `src/`); the app's
authoritative copies are the files in `src/data/content/`. Edit those to change what the site
shows.

## Data model

All types live in [`src/data/types.ts`](src/data/types.ts). The shapes below are what the
content JSON must match.

### Strength levels

Each argument carries a `strength`, which renders as a visible colored badge:

| Value           | Badge        | Meaning                                              |
| --------------- | ------------ | ---------------------------------------------------- |
| `scriptural`    | solid gold   | Direct scriptural proof — the strongest claims       |
| `strong`        | amber outline| Strong corroborating argument                        |
| `supplementary` | muted slate  | Devotional or traditional note, not standalone proof |

### `Argument`

```ts
interface Argument {
  id: string                 // unique within the topic; used as the anchor target
  title: string              // argument heading
  shortClaim: string         // one-line summary shown under the title
  category: string           // must match an entry in the topic's categories/subCategories
  strength: 'scriptural' | 'strong' | 'supplementary'
  primaryReferences: {       // one or more scripture quotes
    citation: string         // e.g. "John 1:1"
    translationUsed: string  // e.g. "RSV-CE"
    text: string             // the verse text
  }[]
  originalLanguage?:         // optional; object (preferred) or a plain string note
    | { language: string; text: string; translit: string; note: string }
    | string
  nwtRebuttal?: string       // optional; the New World Translation dispute, if any
  explanation: string        // the full prose argument
}
```

### `TopicContent` (the shape of each content JSON file)

```ts
interface TopicContent {
  title: string              // headline (jw-critique uses `topic` instead — both supported)
  subtitle?: string
  disclaimer?: string        // rendered as an intro callout
  displayTranslation?: string
  displayTranslationNote?: string
  divineNameNote?: string
  methodologyNote?: string
  categories?: string[]      // ordered section labels (jesus-is-god)
  subCategories?: string[]   // ordered section labels (jw-critique)
  featured?: string[]        // ordered argument ids for the "Start here" block
  featuredTitle?: string     // optional per-topic override of the block heading
  featuredBlurb?: string     // optional per-topic override of the block blurb
  arguments: Argument[]
  uncertainCitations?: { citation: string; issue: string }[]  // "Honest caveats"
}
```

Arguments are grouped on the page by `category`, in the order the topic's `categories` /
`subCategories` array declares (any category not listed there falls to the end in the order it
first appears).

If a topic sets `featured` to an ordered list of argument ids, the page renders a **"Start
here — strongest arguments"** highlights block above the filter bar. Each entry is a compact,
tappable preview (title, strength badge, one-line claim) that jumps to the canonical card
below via the same `#<argumentId>` hash-scroll + flash used by search. Ids that don't resolve
are skipped, so any topic can add the array and get the block automatically. The block heading
and blurb come from the per-locale UI strings by default; a topic may override them with the
optional `featuredTitle` / `featuredBlurb` content fields (today only `jesus-is-god` sets
`featuredBlurb`).

### `TopicMeta` (the registry entry in `topics.ts`)

```ts
interface TopicMeta {
  id: string                 // URL slug: /topic/<id>
  navLabel: LocalizedString  // short label in the nav (per-locale, en required)
  title: LocalizedString     // card/page title
  blurb: LocalizedString     // short description on the home card
  status: 'live' | 'coming-soon'
  accent?: string
  loadContent?: (locale: LocaleCode) => TopicContent   // required for live topics
}

// LocalizedString requires English and allows any other locale optionally:
type LocalizedString = { en: string } & Partial<Record<LocaleCode, string>>
```

## How to add a new argument

You only edit data — no components or pages change.

1. Open the English content file for the topic under `src/data/content/en/`, e.g.
   [`src/data/content/en/jesus-is-god.json`](src/data/content/en/jesus-is-god.json) or
   [`src/data/content/en/jw-critique.json`](src/data/content/en/jw-critique.json).
2. Add a new object to the `arguments` array matching the [`Argument`](#argument) shape:
   - give it a unique `id`,
   - set `category` to one of the strings already listed in that file's `categories`
     (jesus-is-god) or `subCategories` (jw-critique) so it lands in an existing section,
   - choose a `strength` of `scriptural`, `strong`, or `supplementary`,
   - include at least one `primaryReferences` entry,
   - add `originalLanguage` and/or `nwtRebuttal` only if relevant (both are optional).
3. Mirror the same object in **every other locale file** for that topic (e.g.
   `src/data/content/fr/jesus-is-god.json`) with the **same `id`, in the same position**,
   translating only the human-readable text and keeping the translation invariants from
   [Internationalization](#internationalization-i18n). (If a locale is left untranslated for a
   topic the whole topic falls back to English, so partial per-argument translation of a single
   file is not supported — keep the files structurally identical.)
4. Save, then run `npm run build` to confirm the JSON still typechecks against `TopicContent`.

To create a brand-new section instead of reusing one, add the new label to each locale file's
`categories` / `subCategories` array (in the position you want it to appear, translated per
locale) and set each new argument's `category` to match that locale's label.

## How to add a new topic

Promoting a `coming-soon` placeholder (or adding a wholly new topic):

1. Create the content JSON for **each locale**, using the same filename in each locale folder,
   e.g. `src/data/content/en/trinity.json` and `src/data/content/fr/trinity.json`, both matching
   the [`TopicContent`](#topiccontent-the-shape-of-each-content-json-file) shape and sharing the
   same argument ids/order.
2. Create its locale-aware typed re-export next to the folders, e.g.
   `src/data/content/trinity.ts`:
   ```ts
   import en from './en/trinity.json'
   import fr from './fr/trinity.json'
   import type { TopicContent } from '../types'
   import type { LocaleCode } from '../../i18n/locales'

   const byLocale = {
     en: en as unknown as TopicContent,
     fr: fr as unknown as TopicContent,
   } satisfies Partial<Record<LocaleCode, TopicContent>>

   export default byLocale
   ```
3. In [`src/data/topics.ts`](src/data/topics.ts), import the module and either flip the
   existing placeholder entry or add a new `TopicMeta` with per-locale labels and a
   locale-aware `loadContent`:
   ```ts
   import trinity from './content/trinity'
   // ...
   {
     id: 'trinity',
     navLabel: { en: 'The Trinity', fr: 'La Trinité' },
     title: { en: 'The Trinity', fr: 'La Trinité' },
     blurb: {
       en: 'One God in three co-equal, co-eternal persons.',
       fr: 'Un seul Dieu en trois personnes co-égales et co-éternelles.',
     },
     status: 'live',                                  // was 'coming-soon'
     loadContent: (locale) => trinity[locale] ?? trinity.en,
   }
   ```

The navigation, home grid, `/topic/:id` page, language switcher, and search are all driven by
this registry, so no routes or components need to change. Run `npm run build` and
`npm run typecheck` to confirm.

## Verify

```bash
npm run build       # tsc typecheck + vite production build
npm run typecheck   # tsc --noEmit
```

Both must exit cleanly. The production build is written to `dist/` (gitignored); remove it after
a verification build so it is never committed.

When editing translations, also confirm the per-locale invariants hold: for every topic, each
locale file must have the same argument count and order as English, identical argument ids, the
identical `featured` id array (where present), and every argument `category` must match one of
that file's translated `categories`/`subCategories` labels. Keeping English the default means a
bare English URL must render exactly as before, with no redirect.
