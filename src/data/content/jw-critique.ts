import en from './en/jw-critique.json'
import fr from './fr/jw-critique.json'
import type { TopicContent } from '../types'
import type { LocaleCode } from '../../i18n/locales'

// en is authoritative; fr matches its structure (same ids, slugs, order).
const byLocale = {
  en: en as unknown as TopicContent,
  fr: fr as unknown as TopicContent,
} satisfies Partial<Record<LocaleCode, TopicContent>>

export default byLocale
