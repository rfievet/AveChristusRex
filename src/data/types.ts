// Shared data model for the Ave Christus Rex content site.
// The research JSON files in src/data/content are the single source of truth;
// these interfaces describe their shape so the app can render them with type safety.

export type Strength = 'scriptural' | 'strong' | 'supplementary'

export interface Reference {
  citation: string
  translationUsed: string
  text: string
}

export interface OriginalLanguage {
  language: string
  text: string
  translit: string
  note: string
}

export interface Argument {
  id: string
  title: string
  shortClaim: string
  category: string
  strength: Strength
  primaryReferences: Reference[]
  // Optional: only ~16/22 jesus-is-god arguments carry an original-language block,
  // and jw-critique arguments omit the structured object entirely (some carry a
  // plain-string note instead), so this stays optional and tolerant of both shapes.
  originalLanguage?: OriginalLanguage | string
  // Optional: present on jesus-is-god arguments, absent on jw-critique arguments.
  nwtRebuttal?: string
  explanation: string
}

export interface UncertainCitation {
  citation: string
  issue: string
}

export interface TopicContent {
  title: string
  subtitle?: string
  // jw-critique uses `topic` as its headline rather than `title`.
  topic?: string
  disclaimer?: string
  displayTranslation?: string
  displayTranslationNote?: string
  divineNameNote?: string
  methodologyNote?: string
  // Ordered section labels. jesus-is-god uses `categories`; jw-critique uses `subCategories`.
  categories?: string[]
  subCategories?: string[]
  // Optional ordered list of argument ids to surface in a "Start here" highlights
  // block above the sections (strongest-first). Any topic that adds this array
  // gets the block automatically; ids that don't resolve are skipped.
  featured?: string[]
  arguments: Argument[]
  uncertainCitations?: UncertainCitation[]
}

export interface TopicMeta {
  id: string
  navLabel: string
  title: string
  blurb: string
  status: 'live' | 'coming-soon'
  accent?: string
  loadContent?: () => TopicContent
}
