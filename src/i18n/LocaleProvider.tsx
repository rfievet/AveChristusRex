import { createContext, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import TopicPage from '../pages/TopicPage'
import NotFound from '../pages/NotFound'
import { DEFAULT_LOCALE, nonDefaultCodes, resolveLocaleFromPath, type LocaleCode } from './locales'
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

  // The page routes, identical for every locale. They are mounted once at the
  // root (the default locale is unprefixed) and once under each non-default
  // locale's URL prefix (e.g. `/fr`), so `/fr`, `/fr/`, and `/fr/topic/:id` all
  // match the same tree instead of falling through to the `*` NotFound. The
  // prefixed branch uses an index route so the BARE `/fr` (no trailing slash)
  // resolves to Home just like the trailing-slash `/fr/`.
  return (
    <LocaleProvider value={locale}>
      <Routes>
        <Route element={<Layout />}>
          {pageRoutes()}
          {nonDefaultCodes().map((code) => (
            <Route key={code} path={code}>
              {pageRoutes()}
            </Route>
          ))}
        </Route>
      </Routes>
    </LocaleProvider>
  )
}

/** The locale-agnostic page routes, rendered once per locale branch. */
function pageRoutes() {
  return (
    <>
      <Route index element={<Home />} />
      <Route path="topic/:topicId" element={<TopicPage />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
}
