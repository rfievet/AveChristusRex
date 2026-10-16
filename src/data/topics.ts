import type { TopicMeta } from './types'
import jesusIsGod from './content/jesus-is-god'
import objections from './content/objections'
import jwCritique from './content/jw-critique'
import sources from './content/sources'

// Ordered topic registry. This is the single place the site is extended:
// - add a new argument -> edit the matching JSON in src/data/content/<locale>/
// - add a new topic -> add a TopicMeta entry here (and content files + loadContent for a live one)
// - publish a coming-soon topic -> flip status to 'live' and wire loadContent
// - add a language -> extend LocaleCode + LOCALES, then add the locale key to each
//   content byLocale map and each label below (en stays required + the fallback)
export const topics: TopicMeta[] = [
  {
    id: 'jesus-is-god',
    navLabel: { en: 'Jesus Is God', fr: 'Jésus est Dieu' },
    title: { en: 'The Divinity of Christ', fr: 'La divinité du Christ' },
    blurb: {
      en: 'A source-cited case that Jesus is God — each claim with its Scripture and the disputed NWT rendering.',
      fr: "Une démonstration sourcée que Jésus est Dieu — chaque affirmation avec son passage biblique et la traduction contestée de la TMN.",
    },
    status: 'live',
    accent: 'gold',
    loadContent: (locale) => jesusIsGod[locale] ?? jesusIsGod.en,
  },
  {
    id: 'objections',
    navLabel: { en: 'Objections & Rebuttals', fr: 'Objections et réfutations' },
    title: { en: "Answering the Watch Tower's Verses", fr: 'Répondre aux versets de la Watch Tower' },
    blurb: {
      en: "The verses a Jehovah's Witness raises to deny Christ's divinity — each with the orthodox, debate-ready answer.",
      fr: "Les versets qu'un témoin de Jéhovah invoque pour nier la divinité du Christ — chacun avec la réponse orthodoxe, prête pour le débat.",
    },
    status: 'live',
    accent: 'gold',
    loadContent: (locale) => objections[locale] ?? objections.en,
  },
  {
    id: 'jw-critique',
    navLabel: { en: "Jehovah's Witnesses", fr: 'Les témoins de Jéhovah' },
    title: { en: 'Examining the Watch Tower', fr: 'Examen de la Watch Tower' },
    blurb: {
      en: "Why the Jehovah's Witnesses organization's claim to be the restored true religion is historically and doctrinally problematic.",
      fr: "Pourquoi la prétention de l'organisation des témoins de Jéhovah à être la vraie religion restaurée pose problème sur les plans historique et doctrinal.",
    },
    status: 'live',
    accent: 'ink',
    loadContent: (locale) => jwCritique[locale] ?? jwCritique.en,
  },
  {
    id: 'sources',
    navLabel: { en: 'Sources & Method', fr: 'Sources et méthode' },
    title: { en: 'Sources & Method', fr: 'Sources et méthode' },
    blurb: {
      en: 'The translations, manuscripts, and grammar rules behind the arguments — and an honest look at the New World Translation.',
      fr: "Les traductions, les manuscrits et les règles de grammaire qui sous-tendent les arguments — et un regard honnête sur la Traduction du monde nouveau.",
    },
    status: 'live',
    accent: 'ink',
    loadContent: (locale) => sources[locale] ?? sources.en,
  },
  {
    id: 'trinity',
    navLabel: { en: 'The Trinity', fr: 'La Trinité' },
    title: { en: 'The Trinity', fr: 'La Trinité' },
    blurb: {
      en: 'One God in three co-equal, co-eternal persons: Father, Son, and Holy Spirit.',
      fr: 'Un seul Dieu en trois personnes égales et coéternelles : le Père, le Fils et le Saint-Esprit.',
    },
    status: 'coming-soon',
  },
  {
    id: 'eucharist',
    navLabel: { en: 'The Real Presence', fr: 'La présence réelle' },
    title: { en: 'The Real Presence', fr: 'La présence réelle' },
    blurb: {
      en: 'Christ truly present — body, blood, soul, and divinity — in the Eucharist.',
      fr: "Le Christ vraiment présent — corps, sang, âme et divinité — dans l'Eucharistie.",
    },
    status: 'coming-soon',
  },
  {
    id: 'papacy',
    navLabel: { en: 'The Papacy', fr: 'La papauté' },
    title: { en: 'The Papacy', fr: 'La papauté' },
    blurb: {
      en: 'The office of Peter and the authority Christ gave to his Church.',
      fr: "La charge de Pierre et l'autorité que le Christ a donnée à son Église.",
    },
    status: 'coming-soon',
  },
  {
    id: 'marian',
    navLabel: { en: 'Marian Doctrine', fr: 'La doctrine mariale' },
    title: { en: 'Marian Doctrine', fr: 'La doctrine mariale' },
    blurb: {
      en: 'What the Church teaches about Mary, and the Scripture behind it.',
      fr: "Ce que l'Église enseigne au sujet de Marie, et les Écritures qui le fondent.",
    },
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
