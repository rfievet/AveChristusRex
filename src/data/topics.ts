import type { TopicMeta } from './types'
import jesusIsGod from './content/jesus-is-god'
import jwCritique from './content/jw-critique'

// Ordered topic registry. This is the single place the site is extended:
// - add a new argument -> edit the matching JSON in src/data/content/
// - add a new topic -> add a TopicMeta entry here (and a content file + loadContent for a live one)
// - publish a coming-soon topic -> flip status to 'live' and wire loadContent
export const topics: TopicMeta[] = [
  {
    id: 'jesus-is-god',
    navLabel: 'Jesus Is God',
    title: 'The Divinity of Christ',
    blurb:
      'A source-cited case that Jesus is God — each claim with its Scripture and the disputed NWT rendering.',
    status: 'live',
    accent: 'gold',
    loadContent: () => jesusIsGod,
  },
  {
    id: 'jw-critique',
    navLabel: "Jehovah's Witnesses",
    title: 'Examining the Watch Tower',
    blurb:
      "Why the Jehovah's Witnesses organization's claim to be the restored true religion is historically and doctrinally problematic.",
    status: 'live',
    accent: 'ink',
    loadContent: () => jwCritique,
  },
  {
    id: 'trinity',
    navLabel: 'The Trinity',
    title: 'The Trinity',
    blurb: 'One God in three co-equal, co-eternal persons: Father, Son, and Holy Spirit.',
    status: 'coming-soon',
  },
  {
    id: 'eucharist',
    navLabel: 'The Real Presence',
    title: 'The Real Presence',
    blurb: 'Christ truly present — body, blood, soul, and divinity — in the Eucharist.',
    status: 'coming-soon',
  },
  {
    id: 'papacy',
    navLabel: 'The Papacy',
    title: 'The Papacy',
    blurb: 'The office of Peter and the authority Christ gave to his Church.',
    status: 'coming-soon',
  },
  {
    id: 'marian',
    navLabel: 'Marian Doctrine',
    title: 'Marian Doctrine',
    blurb: 'What the Church teaches about Mary, and the Scripture behind it.',
    status: 'coming-soon',
  },
]

export function listTopics(): TopicMeta[] {
  return topics
}

export function getTopicMeta(id: string | undefined): TopicMeta | undefined {
  if (!id) return undefined
  return topics.find((t) => t.id === id)
}
