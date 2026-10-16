import { createContext, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import TopicPage from '../pages/TopicPage'
import NotFound from '../pages/NotFound'
import { DEFAULT_LOCALE, resolveLocaleFromPath, type LocaleCode } from './locales'
import { useDocumentMeta } from './useDocumentMeta'

/**
 * Carries the active LocaleCode to every component via context. `useLocale` and
 * `useStrings` read it. Default is the English locale so a component rendered
 * outside a provider (defensively) still resolves to English.
 */
export const LocaleContext = createContext<LocaleCode>(DEFAULT_LOCALE)

interface LocaleProviderProps {
  value: LocaleCode
  children: ReactNode
}

export function LocaleProvider({ value, children }: LocaleProviderProps) {
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

/**
 * The single component that decides the active locale and mounts the page
 * routes. It reads the (already-base-stripped) pathname, peels off the locale
 * prefix, and renders exactly ONE <Routes> tree identical to today's route set —
 * the locale lives in context, not as a route param.
 *
 * `/en/*` is a reserved convenience alias: it is redirected once to the
 * canonical unprefixed URL (preserving the rest + hash). Bare URLs are never
 * redirected for a saved preference — a bare URL always renders English.
 */
export default function LocaleRouter() {
  const location = useLocation()
  const { locale } = resolveLocaleFromPath(location.pathname)

  // Keep document.title and <meta name="description"> in sync with locale+route.
  useDocumentMeta()

  // `/en/...` -> redirect to the unprefixed equivalent (en is never a live prefix).
  const segments = location.pathname.split('/').filter(Boolean)
  if (segments[0] === 'en') {
    const remaining = segments.slice(1)
    const rest = remaining.length ? `/${remaining.join('/')}` : '/'
    return <Navigate replace to={`${rest}${location.hash}`} />
  }

  return (
    <LocaleProvider value={locale}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:topicId" element={<TopicPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </LocaleProvider>
  )
}
