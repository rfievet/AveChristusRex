import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useStrings } from '../i18n/useStrings'
import NavBar from './NavBar'
import SearchModal from './SearchModal'

export default function Layout() {
  const strings = useStrings()
  const [searchOpen, setSearchOpen] = useState(false)
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  // Global shortcuts: Cmd/Ctrl+K and '/' open search from anywhere.
  // '/' is ignored while the user is typing in a field so it doesn't hijack input.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (isCmdK) {
        event.preventDefault()
        setSearchOpen((v) => !v)
        return
      }

      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null
        const tag = target?.tagName
        const typing =
          tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable
        if (!typing) {
          event.preventDefault()
          setSearchOpen(true)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-parchment-50 dark:focus:bg-gold-400 dark:focus:text-ink-900"
      >
        {strings.layout.skipToContent}
      </a>

      <NavBar onOpenSearch={openSearch} />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gold-500/30 bg-parchment-200/60 px-4 py-8 dark:border-gold-500/20 dark:bg-ink-900 sm:px-6">
        <div className="mx-auto max-w-5xl text-center text-sm text-ink-500 dark:text-parchment-400">
          <p className="font-serif text-base text-gold-700 dark:text-gold-300">{strings.layout.footerBrand}</p>
          <p className="mt-1">{strings.layout.footerTagline}</p>
          <p className="mt-3 text-xs text-ink-500 dark:text-parchment-400">
            {strings.layout.footerNote}
          </p>
        </div>
      </footer>

      <SearchModal open={searchOpen} onClose={closeSearch} />
    </div>
  )
}
