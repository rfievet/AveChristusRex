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

## Project structure

```
index.html                  App entry HTML
vite.config.ts              Vite config (port 5317, host 0.0.0.0, strictPort)
tailwind.config.js          Theme tokens (ink / parchment / gold scales, serif + sans fonts)
src/
  main.tsx                  React bootstrap
  App.tsx                   Routes: / , /topic/:topicId , * (404), all inside Layout
  index.css                 Tailwind layers + base styles (focus rings, overflow guards)
  data/
    types.ts                The data model (Argument, Topic, strength levels)
    topics.ts               Topic registry + listTopics() / getTopicMeta()
    content/
      jesus-is-god.json     Content data for the "Jesus Is God" topic
      jesus-is-god.ts       Typed re-export of the JSON
      jw-critique.json      Content data for the "Jehovah's Witnesses" topic
      jw-critique.ts        Typed re-export of the JSON
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
  arguments: Argument[]
  uncertainCitations?: { citation: string; issue: string }[]  // "Honest caveats"
}
```

Arguments are grouped on the page by `category`, in the order the topic's `categories` /
`subCategories` array declares (any category not listed there falls to the end in the order it
first appears).

### `TopicMeta` (the registry entry in `topics.ts`)

```ts
interface TopicMeta {
  id: string                 // URL slug: /topic/<id>
  navLabel: string           // short label in the nav
  title: string              // card/page title
  blurb: string              // short description on the home card
  status: 'live' | 'coming-soon'
  accent?: string
  loadContent?: () => TopicContent   // required for live topics
}
```

## How to add a new argument

You only edit data — no components or pages change.

1. Open the relevant content file, e.g.
   [`src/data/content/jesus-is-god.json`](src/data/content/jesus-is-god.json) or
   [`src/data/content/jw-critique.json`](src/data/content/jw-critique.json).
2. Add a new object to the `arguments` array matching the [`Argument`](#argument) shape:
   - give it a unique `id`,
   - set `category` to one of the strings already listed in that file's `categories`
     (jesus-is-god) or `subCategories` (jw-critique) so it lands in an existing section,
   - choose a `strength` of `scriptural`, `strong`, or `supplementary`,
   - include at least one `primaryReferences` entry,
   - add `originalLanguage` and/or `nwtRebuttal` only if relevant (both are optional).
3. Save, then run `npm run build` to confirm the JSON still typechecks against `TopicContent`.

To create a brand-new section instead of reusing one, add the new label to that file's
`categories` / `subCategories` array (in the position you want it to appear) and set each new
argument's `category` to match.

## How to add a new topic

Promoting a `coming-soon` placeholder (or adding a wholly new topic):

1. Create the content JSON under `src/data/content/`, e.g. `trinity.json`, matching the
   [`TopicContent`](#topiccontent-the-shape-of-each-content-json-file) shape.
2. Create its typed re-export next to it, e.g. `src/data/content/trinity.ts`:
   ```ts
   import data from './trinity.json'
   import type { TopicContent } from '../types'

   export default data as unknown as TopicContent
   ```
3. In [`src/data/topics.ts`](src/data/topics.ts), import the module and either flip the
   existing placeholder entry or add a new `TopicMeta`:
   ```ts
   import trinity from './content/trinity'
   // ...
   {
     id: 'trinity',
     navLabel: 'The Trinity',
     title: 'The Trinity',
     blurb: 'One God in three co-equal, co-eternal persons.',
     status: 'live',             // was 'coming-soon'
     loadContent: () => trinity, // add this for live topics
   }
   ```

The navigation, home grid, and `/topic/:id` page are all driven by this registry, so no routes
or components need to change. Run `npm run build` and `npm run typecheck` to confirm.

## Verify

```bash
npm run build       # tsc typecheck + vite production build
npm run typecheck   # tsc --noEmit
```

Both must exit cleanly. The production build is written to `dist/` (gitignored).
