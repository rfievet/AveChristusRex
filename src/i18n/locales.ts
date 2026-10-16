// The locale registry — the SINGLE source of truth for which languages the site
// supports and how locales map to URL prefixes and <html lang>. Adding a language
// is (ideally) a one-line edit to the LocaleCode union plus one LOCALES entry here,
// plus shipping the data/strings files. Routing, the switcher, content loading, and
// fallbacks all read from this module so they agree automatically.

export type LocaleCode = 'en' | 'fr' // extend the union to add a language

export interface LocaleMeta {
  code: LocaleCode
  label: string // native name shown in the switcher, e.g. "Français"
  htmlLang: string // value for <html lang>, e.g. "fr"
  isDefault?: boolean
}

export const LOCALES: LocaleMeta[] = [
  { code: 'en', label: 'English', htmlLang: 'en', isDefault: true },
  { code: 'fr', label: 'Français', htmlLang: 'fr' },
]

export const DEFAULT_LOCALE: LocaleCode = 'en'
export const LOCALE_STORAGE_KEY = 'locale'

/** Type guard: is the given string one of the supported locale codes? */
export function isSupportedLocale(x: string): x is LocaleCode {
  return LOCALES.some((l) => l.code === x)
}

/**
 * The non-default locale codes, i.e. the ones that carry a URL prefix (['fr']).
 * `resolveLocaleFromPath` keys off this list, so a path's first segment is only
 * treated as a locale when it appears here (never for 'en' or 'topic').
 */
export function nonDefaultCodes(): string[] {
  return LOCALES.filter((l) => l.code !== DEFAULT_LOCALE).map((l) => l.code)
}

/**
 * Split the active locale off an ALREADY-BASE-STRIPPED app path (the router
 * basename is never part of the input). The default locale carries no prefix.
 *
 *   resolveLocaleFromPath('/fr/topic/x') -> { locale: 'fr', rest: '/topic/x' }
 *   resolveLocaleFromPath('/topic/x')    -> { locale: 'en', rest: '/topic/x' }
 *   resolveLocaleFromPath('/')           -> { locale: 'en', rest: '/' }
 *   resolveLocaleFromPath('/fr')         -> { locale: 'fr', rest: '/' }
 *   resolveLocaleFromPath('/fr/')        -> { locale: 'fr', rest: '/' }
 */
export function resolveLocaleFromPath(pathname: string): { locale: LocaleCode; rest: string } {
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  if (first && nonDefaultCodes().includes(first) && isSupportedLocale(first)) {
    const remaining = segments.slice(1)
    const rest = remaining.length ? `/${remaining.join('/')}` : '/'
    return { locale: first, rest }
  }
  return { locale: DEFAULT_LOCALE, rest: pathname }
}

/**
 * The inverse of `resolveLocaleFromPath`: prefix an ALREADY-BASE-STRIPPED app
 * path with the locale segment. The default locale is returned unprefixed; a
 * non-default locale's home ('/') becomes '/<code>' (no trailing slash).
 *
 *   withLocalePath('en', '/')          -> '/'
 *   withLocalePath('en', '/topic/x')   -> '/topic/x'
 *   withLocalePath('fr', '/')          -> '/fr'
 *   withLocalePath('fr', '/topic/x')   -> '/fr/topic/x'
 */
export function withLocalePath(locale: LocaleCode, rest: string): string {
  const normalized = rest.startsWith('/') ? rest : `/${rest}`
  if (locale === DEFAULT_LOCALE) return normalized
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`
}

/**
 * A string that is always available in English and optionally translated. Used
 * for topic registry labels so a missing locale silently falls back to English.
 */
export type LocalizedString = { en: string } & Partial<Record<LocaleCode, string>>

/** Resolve a LocalizedString for a locale, falling back to English. */
export function localized(value: LocalizedString, locale: LocaleCode): string {
  return value[locale] ?? value.en
}
