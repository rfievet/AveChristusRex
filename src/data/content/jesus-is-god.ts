import en from './en/jesus-is-god.json'
import fr from './fr/jesus-is-god.json'
import type { TopicContent } from '../types'
import type { LocaleCode } from '../../i18n/locales'

// en is authoritative; fr matches its structure (same ids, slugs, order).
const byLocale = {
  en: en as unknown as TopicContent,
  fr: fr as unknown as TopicContent,
} satisfies Partial<Record<LocaleCode, TopicContent>>

export default byLocale
