import { useCallback, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LocaleContext } from './LocaleProvider'
import {
  LOCALE_STORAGE_KEY,
  LOCALES,
  resolveLocaleFromPath,
  withLocalePath,
  type LocaleCode,
  type LocaleMeta,
} from './locales'

/**
 * Read and switch the active locale. Mirrors useTheme's persistence shape: the
 * authoritative <html lang> is set by the inline script in index.html before
 * React mounts; switching persists the choice to localStorage['locale'], updates
 * <html lang>, and navigates to the locale-swapped equivalent URL (same path
 * remainder + hash) so the user stays on the same page.
 */
export function useLocale(): {
  locale: LocaleCode
  setLocale: (next: LocaleCode) => void
  locales: LocaleMeta[]
} {
  const locale = useContext(LocaleContext)
  const navigate = useNavigate()
  const location = useLocation()

  const setLocale = useCallback(
    (next: LocaleCode) => {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next)
      } catch {
        /* localStorage unavailable (private mode): switch still works for the session */
      }
      document.documentElement.lang = next
      const { rest } = resolveLocaleFromPath(location.pathname)
      navigate(`${withLocalePath(next, rest)}${location.hash}`)
    },
    [navigate, location.pathname, location.hash],
  )

  return { locale, setLocale, locales: LOCALES }
}
