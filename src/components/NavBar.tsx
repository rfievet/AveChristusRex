import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { listTopics } from '../data/topics'
import { useTheme } from '../hooks/useTheme'
import { useLocale } from '../i18n/useLocale'
import { useStrings } from '../i18n/useStrings'
import { localized, withLocalePath } from '../i18n/locales'

interface NavBarProps {
  onOpenSearch: () => void
}

export default function NavBar({ onOpenSearch }: NavBarProps) {
  const [open, setOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { locale, setLocale, locales } = useLocale()
  const strings = useStrings()
  const topics = listTopics()
  const liveTopics = topics.filter((t) => t.status === 'live')

  const close = () => setOpen(false)
  const openSearch = () => {
    close()
    onOpenSearch()
  }

  const themeButtonClasses =
    'inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-700 hover:bg-gold-900/10 hover:text-gold-700 dark:text-parchment-100 dark:hover:bg-ink-700/60 dark:hover:text-gold-200'

  // Language switcher. Registry-driven so a third language appears automatically:
  // two locales render a single h-11 w-11 toggle (same footprint as the theme
  // toggle — NavBar height is unchanged); 3+ render a small inline menu.
  const languageSwitcher =
    locales.length <= 2 ? (
      (() => {
        const other = locales.find((l) => l.code !== locale) ?? locales[0]
        return (
          <button
            type="button"
            onClick={() => setLocale(other.code)}
            className={themeButtonClasses}
            aria-label={strings.nav.languageLabel}
            title={other.label}
          >
            <span className="text-sm font-semibold uppercase tracking-wide">{other.code}</span>
          </button>
        )
      })()
    ) : (
      <div className="flex items-center gap-0.5" role="group" aria-label={strings.nav.languageLabel}>
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-current={l.code === locale ? 'true' : undefined}
            className={`inline-flex h-11 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm font-semibold uppercase tracking-wide ${
              l.code === locale
                ? 'text-gold-700 dark:text-gold-200'
                : 'text-ink-700 hover:bg-gold-900/10 hover:text-gold-700 dark:text-parchment-100 dark:hover:bg-ink-700/60 dark:hover:text-gold-200'
            }`}
            title={l.label}
          >
            {l.code}
          </button>
        ))}
      </div>
    )

  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      className={themeButtonClasses}
      aria-pressed={isDark}
      aria-label={isDark ? strings.nav.toLightTheme : strings.nav.toDarkTheme}
      title={isDark ? strings.nav.toLightTheme : strings.nav.toDarkTheme}
    >
      {isDark ? (
        // Sun — shown in dark mode (click to go light)
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          />
        </svg>
      ) : (
        // Moon — shown in light mode (click to go dark)
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-gold-500/30 bg-parchment-50/90 backdrop-blur dark:border-gold-500/20 dark:bg-ink-900/90">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6" aria-label={strings.nav.primaryLabel}>
        <Link
          to={withLocalePath(locale, '/')}
          onClick={close}
          className="whitespace-nowrap font-serif text-xl font-semibold tracking-wide text-ink-900 transition-colors hover:text-gold-700 dark:text-parchment-50 dark:hover:text-gold-300"
        >
          {strings.nav.brand}
        </Link>

        <div className="flex items-center gap-1.5">
          {/* Desktop links — only live topics belong in the always-visible bar.
              Coming-soon topics live in the menu so the header stays uncrowded. */}
          <ul className="hidden items-center gap-0.5 lg:flex">
          {liveTopics.map((topic) => (
            <li key={topic.id}>
              <NavLink
                to={withLocalePath(locale, `/topic/${topic.id}`)}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-900/15 text-gold-700 dark:bg-gold-900/30 dark:text-gold-200'
                      : 'text-ink-700 hover:bg-gold-900/10 hover:text-gold-700 dark:text-parchment-200 dark:hover:bg-ink-700/50 dark:hover:text-gold-200'
                  }`
                }
              >
                {localized(topic.navLabel, locale)}
              </NavLink>
            </li>
          ))}
          </ul>

          {/* Desktop search box (opens the command palette) */}
          <button
            type="button"
            onClick={openSearch}
            className="ml-1 hidden items-center gap-2 rounded-md border border-ink-300/70 bg-parchment-200/60 py-2 pl-2.5 pr-2 text-sm text-ink-500 transition-colors hover:border-gold-500/60 hover:text-ink-800 dark:border-ink-500/60 dark:bg-ink-800/60 dark:text-parchment-400 dark:hover:border-gold-500/50 dark:hover:text-parchment-200 lg:inline-flex"
            aria-label={strings.nav.searchDesktopLabel}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
            <kbd className="rounded bg-ink-200/80 px-1.5 py-0.5 text-xs font-medium text-ink-600 dark:bg-ink-700/80 dark:text-parchment-300">
              ⌘K
            </kbd>
          </button>

          {/* Mobile search icon */}
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-700 hover:bg-gold-900/10 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 dark:text-parchment-100 dark:hover:bg-ink-700/60 dark:focus-visible:outline-gold-400 lg:hidden"
            aria-label={strings.nav.searchMobileLabel}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
          </button>

          {/* Language switcher (visible on all breakpoints, next to theme toggle) */}
          {languageSwitcher}

          {/* Theme toggle (visible on all breakpoints) */}
          {themeToggle}

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-700 hover:bg-gold-900/10 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 dark:text-parchment-100 dark:hover:bg-ink-700/60 dark:focus-visible:outline-gold-400 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? strings.nav.closeMenu : strings.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {open ? (
        <div id="mobile-menu" className="border-t border-gold-500/30 bg-parchment-50 dark:border-gold-500/20 dark:bg-ink-900 lg:hidden">
          <ul className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3 sm:px-6">
            {topics.map((topic) =>
              topic.status === 'live' ? (
                <li key={topic.id}>
                  <NavLink
                    to={withLocalePath(locale, `/topic/${topic.id}`)}
                    onClick={close}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-gold-900/15 text-gold-700 dark:bg-gold-900/30 dark:text-gold-200'
                          : 'text-ink-800 hover:bg-gold-900/10 hover:text-gold-700 dark:text-parchment-100 dark:hover:bg-ink-700/50 dark:hover:text-gold-200'
                      }`
                    }
                  >
                    {localized(topic.navLabel, locale)}
                  </NavLink>
                </li>
              ) : (
                <li key={topic.id}>
                  <span
                    className="flex items-center justify-between rounded-md px-3 py-3 text-base font-medium text-ink-400 dark:text-parchment-500"
                    aria-disabled="true"
                  >
                    {localized(topic.navLabel, locale)}
                    <span className="rounded-full bg-ink-200/70 px-2 py-0.5 text-xs uppercase tracking-wide dark:bg-ink-700/70">
                      {strings.nav.comingSoonShort}
                    </span>
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>
      ) : null}
    </header>
  )
}
