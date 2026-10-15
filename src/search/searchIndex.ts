import { listTopics } from '../data/topics'
import type { OriginalLanguage, Strength } from '../data/types'

// A single searchable record. There are two kinds:
// - kind: 'argument' -> deep-links to /topic/<topicId>#<argumentId>
// - kind: 'topic'     -> links to /topic/<topicId> (and may be a coming-soon stub)
export interface SearchEntry {
  kind: 'argument' | 'topic'
  topicId: string
  topicLabel: string // short nav label of the owning topic
  topicTitle: string // full topic title
  // argument fields (empty for topic entries)
  argumentId?: string
  title: string // argument title, or topic title for topic entries
  shortClaim?: string
  category?: string
  strength?: Strength
  citations: string[] // display citations, e.g. ['John 20:28']
  // whether this entry can be deep-linked to a live argument
  comingSoon: boolean
  // precomputed haystacks for matching (all lowercased)
  // `primary` ranks higher than `body` when scoring
  primary: string // title, citations (normalized + raw), category, short claim
  body: string // explanation, rebuttal, reference text, original-language text
}

// Normalize text for case/punctuation-insensitive matching. Collapses any run
// of non-alphanumeric characters to a single space so that 'Col 1:16',
// 'colossians 1 16' and 'John 1:1' all reduce to comparable token streams.
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    // strip combining marks so accented/transliterated text still matches
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function originalLanguageText(ol: OriginalLanguage | string | undefined): string {
  if (!ol) return ''
  if (typeof ol === 'string') return ol
  return [ol.language, ol.text, ol.translit, ol.note].filter(Boolean).join(' ')
}

let cachedIndex: SearchEntry[] | null = null

// Build the search index once from the topic registry. Because it iterates
// listTopics() and each live topic's loadContent(), any argument or topic the
// user adds under src/data is indexed automatically with no code changes.
export function buildSearchIndex(): SearchEntry[] {
  if (cachedIndex) return cachedIndex

  const entries: SearchEntry[] = []

  for (const topic of listTopics()) {
    const isLive = topic.status === 'live' && typeof topic.loadContent === 'function'

    // Index the topic itself so queries like 'trinity' or 'watch tower' land here.
    entries.push({
      kind: 'topic',
      topicId: topic.id,
      topicLabel: topic.navLabel,
      topicTitle: topic.title,
      title: topic.title,
      citations: [],
      comingSoon: !isLive,
      primary: normalize([topic.navLabel, topic.title].join(' ')),
      body: normalize(topic.blurb),
    })

    if (!isLive || !topic.loadContent) continue

    const content = topic.loadContent()
    for (const arg of content.arguments) {
      const citations = (arg.primaryReferences ?? []).map((r) => r.citation).filter(Boolean)
      const refText = (arg.primaryReferences ?? [])
        .map((r) => [r.citation, r.text, r.translationUsed].filter(Boolean).join(' '))
        .join(' ')

      // Primary haystack: high-value fields. Citations are included both raw
      // (so 'John 20:28' matches) and normalized by `normalize()` later.
      const primaryParts = [
        arg.title,
        arg.shortClaim,
        arg.category,
        ...citations,
      ].filter(Boolean) as string[]

      const bodyParts = [
        arg.explanation,
        arg.nwtRebuttal ?? '',
        refText,
        originalLanguageText(arg.originalLanguage),
      ].filter(Boolean)

      entries.push({
        kind: 'argument',
        topicId: topic.id,
        topicLabel: topic.navLabel,
        topicTitle: topic.title,
        argumentId: arg.id,
        title: arg.title,
        shortClaim: arg.shortClaim,
        category: arg.category,
        strength: arg.strength,
        citations,
        comingSoon: false,
        primary: normalize(primaryParts.join(' ')),
        body: normalize(bodyParts.join(' ')),
      })
    }
  }

  cachedIndex = entries
  return entries
}

export interface SearchResult extends SearchEntry {
  score: number
  // the subset of citations that matched the query, for display emphasis
  matchedCitations: string[]
}

// Lightweight scoring: split the query into normalized tokens and require every
// token to appear somewhere (AND semantics). Hits in the `primary` haystack
// (title / citation / category / claim) outrank hits in the `body`.
export function searchEntries(query: string, limit = 24): SearchResult[] {
  const index = buildSearchIndex()
  const normQuery = normalize(query)
  if (!normQuery) return []

  const tokens = normQuery.split(' ').filter(Boolean)
  if (tokens.length === 0) return []

  const results: SearchResult[] = []

  for (const entry of index) {
    let score = 0
    let allMatched = true

    for (const token of tokens) {
      const inPrimary = entry.primary.includes(token)
      const inBody = entry.body.includes(token)
      if (!inPrimary && !inBody) {
        allMatched = false
        break
      }
      if (inPrimary) {
        score += 10
        // whole-phrase / exact-title boosts
        if (entry.primary.includes(normQuery)) score += 6
      } else {
        score += 2
      }
    }

    if (!allMatched) continue

    // Prefer argument hits over topic hits when scores are otherwise equal,
    // but keep topic hits competitive for short topic-name queries.
    if (entry.kind === 'topic') score += 1

    const matchedCitations = entry.citations.filter((c) => {
      const nc = normalize(c)
      return tokens.every((t) => nc.includes(t)) || nc.includes(normQuery)
    })
    // Citation-specific match is a strong signal for a debater typing a verse.
    if (matchedCitations.length > 0) score += 8

    results.push({ ...entry, score, matchedCitations })
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    // stable-ish tiebreak: shorter titles first, then alphabetical
    if (a.title.length !== b.title.length) return a.title.length - b.title.length
    return a.title.localeCompare(b.title)
  })

  return results.slice(0, limit)
}
