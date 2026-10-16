import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { resolveLocaleFromPath } from './locales'
import { getStrings } from './strings'

/**
 * Keep document.title and <meta name="description"> in sync with the active
 * locale (and route). Invoked once from LocaleRouter so it reacts to both locale
 * and route changes. The static OG/Twitter tags in index.html are intentionally
 * left as the English canonical (Decision 9) — only these two runtime values
 * update. Resolves the locale from the pathname directly because it runs above
 * the LocaleProvider in the tree.
 */
export function useDocumentMeta(): void {
  const location = useLocation()
  const { locale } = resolveLocaleFromPath(location.pathname)
  const { meta } = getStrings(locale)

  useEffect(() => {
    document.title = meta.title
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', meta.description)
  }, [meta.title, meta.description])
}
