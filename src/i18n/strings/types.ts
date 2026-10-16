// The UiStrings contract — one interface that BOTH en.ts and fr.ts (and every
// future locale table) must satisfy. Because `export const en: UiStrings = {…}`
// is type-checked, a missing or mistyped key is a compile error: `npm run
// typecheck` fails closed if a locale forgets a chrome string. Grouped by the
// component/page that consumes each group (see design Decision 3 for the shape).

export interface UiStrings {
  htmlLang: string // 'en' / 'fr' — also drives <html lang>
  nav: {
    brand: string // "Ave Christus Rex" (same in both; still centralized)
    primaryLabel: string // aria-label "Primary"
    searchDesktopLabel: string // "Search (Cmd or Ctrl + K)"
    searchMobileLabel: string // "Search"
    openMenu: string
    closeMenu: string
    toLightTheme: string
    toDarkTheme: string
    comingSoonShort: string // "Soon"
    languageLabel: string // aria-label for the switcher, e.g. "Language"
  }
  search: {
    dialogLabel: string // aria-label "Search the site"
    closeLabel: string // "Close search"
    inputLabel: string // "Search query"
    placeholder: string // "Search topics, arguments, scripture (e.g. John 1:1)"
    escLabel: string // "Close search (Escape)"
    emptyTitle: string // "Find any argument, topic, or verse."
    emptyHintPrefix: string // "Try "
    // example chips are locale-appropriate verses/words:
    exampleCitation: string
    exampleWord: string
    exampleTopic: string
    noResultsFor: (q: string) => string // "No results for “{q}”."
    noResultsHint: string
    topicBadge: string // "Topic"
    topicComingSoonBadge: string // "Topic · coming soon"
    navHintMove: string
    navHintOpen: string
    navHintClose: string
  }
  filterBar: {
    jumpLabel: string // aria-label "Jump to section"
    groupLabel: string // aria-label "Filter arguments by strength"
    all: string
    scriptural: string
    strong: string
    supplementary: string
  }
  strengthBadge: {
    // label + description per strength, used by StrengthBadge aria-label/title
    scriptural: { label: string; description: string }
    strong: { label: string; description: string }
    supplementary: { label: string; description: string }
  }
  argumentCard: {
    copyAria: (title: string) => string // `Copy argument "${title}" with its references`
    copyTitle: string // "Copy argument text"
    linkAria: (title: string) => string // `Copy a link to argument "${title}"`
    linkTitle: string // "Copy link to this argument"
    copiedLive: string // "Copied to clipboard" (aria-live region text)
    copiedBadge: string // "Copied" (the transient badge)
    nwtRebuttalTitle: string // Callout title "New World Translation — the dispute"
  }
  originalLanguage: { fallbackLabel: string } // "Original language" when only a note string
  callout: {
    pleaseNote: string
    displayTranslation: string
    displayTranslationWith: (name: string) => string // "Display translation — {name}"
    divineName: string
    methodology: string
  }
  sectionHeader: { argument: string; arguments: string } // singular/plural count label
  topicPage: {
    backHome: string // "← Back to home"
    allTopics: string // "← All topics"
    topicNotFoundTitle: string
    topicNotFoundBody: string
    comingSoonBadge: string
    comingSoonBody: string
    strongestTitle: string // "Strongest arguments" (the "Start here" block heading)
    strongestBlurb: string // GENERIC fallback only (no topic-specific noun)
    honestCaveats: (n: number) => string // "Honest caveats ({n})"
    honestCaveatsBody: string
  }
  home: {
    eyebrow: string // "Veritas"
    brand: string // "Ave Christus Rex"
    tagline: string // "Hail Christ the King"
    intro: string
    topicsHeading: string // "Topics"
    live: string // "Live"
    comingSoon: string // "Coming soon"
    explore: string // "Explore the case →"
  }
  layout: {
    skipToContent: string
    footerBrand: string
    footerTagline: string
    footerNote: string
  }
  notFound: {
    code: string
    title: string
    body: string
    backHome: string
  }
  meta: {
    // drives the per-locale <title>/description (see index.html Decision 9)
    title: string
    description: string
  }
}
