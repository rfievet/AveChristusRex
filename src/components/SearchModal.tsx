import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchEntries, type SearchResult } from '../search/searchIndex'
import { useLocale } from '../i18n/useLocale'
import { useStrings } from '../i18n/useStrings'
import { withLocalePath, type LocaleCode } from '../i18n/locales'
import StrengthBadge from './StrengthBadge'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

function resultHref(result: SearchResult, locale: LocaleCode): string {
  if (result.kind === 'argument' && result.argumentId) {
    return withLocalePath(locale, `/topic/${result.topicId}#${result.argumentId}`)
  }
  return withLocalePath(locale, `/topic/${result.topicId}`)
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const { locale } = useLocale()
  const strings = useStrings()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const results = useMemo(
    () => (query.trim() ? searchEntries(query, locale) : []),
    [query, locale],
  )

  // Reset the active row whenever the result set changes.
  useEffect(() => {
    setActive(0)
  }, [query])

  // Focus the input when the modal opens; clear the query when it closes.
  useEffect(() => {
    if (open) {
      // defer so the element exists and the browser honours focus
      const id = window.setTimeout(() => inputRef.current?.focus(), 0)
      return () => window.clearTimeout(id)
    }
    setQuery('')
    setActive(0)
    return undefined
  }, [open])

  // Lock background scroll while the overlay is open.
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Keep the active row scrolled into view during arrow navigation.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const el = list.querySelector<HTMLElement>(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const go = (result: SearchResult) => {
    onClose()
    navigate(resultHref(result, locale))
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (results.length ? (i + 1) % results.length : 0))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const chosen = results[active]
      if (chosen) go(chosen)
    }
  }

  const trimmed = query.trim()

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-3 pt-[12vh] sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label={strings.search.dialogLabel}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={strings.search.closeLabel}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-900/40 backdrop-blur-sm dark:bg-ink-950/80"
      />

      {/* Panel */}
      <div
        className="relative flex max-h-[76vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-gold-500/40 bg-parchment-50 shadow-2xl shadow-ink-900/20 dark:border-gold-500/30 dark:bg-ink-800 dark:shadow-ink-950/60"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-ink-200/70 px-4 py-3 dark:border-ink-600/60 sm:px-5">
          <svg
            className="h-5 w-5 shrink-0 text-gold-600 dark:text-gold-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={strings.search.placeholder}
            spellCheck={false}
            autoComplete="off"
            aria-label={strings.search.inputLabel}
            className="min-w-0 flex-1 bg-transparent py-1 text-base text-ink-900 placeholder:text-ink-400 focus:outline-none dark:text-parchment-50 dark:placeholder:text-parchment-500"
          />
          <button
            type="button"
            onClick={onClose}
            className="hidden shrink-0 rounded-md border border-ink-300/70 px-2 py-1 text-xs font-medium text-ink-500 hover:text-ink-800 dark:border-ink-500/60 dark:text-parchment-400 dark:hover:text-parchment-200 sm:inline-block"
            aria-label={strings.search.escLabel}
          >
            Esc
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {!trimmed ? (
            <div className="px-5 py-10 text-center text-sm text-ink-500 dark:text-parchment-400">
              <p className="text-ink-600 dark:text-parchment-300">{strings.search.emptyTitle}</p>
              <p className="mt-2">
                {strings.search.emptyHintPrefix}
                <span className="font-medium text-gold-600 dark:text-gold-300">{strings.search.exampleCitation}</span>,{' '}
                <span className="font-medium text-gold-600 dark:text-gold-300">{strings.search.exampleWord}</span>, or{' '}
                <span className="font-medium text-gold-600 dark:text-gold-300">{strings.search.exampleTopic}</span>.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-ink-500 dark:text-parchment-400">
              <p className="text-ink-600 dark:text-parchment-300">{strings.search.noResultsFor(trimmed)}</p>
              <p className="mt-2">{strings.search.noResultsHint}</p>
            </div>
          ) : (
            <ul ref={listRef} className="divide-y divide-ink-200/70 py-1 dark:divide-ink-700/60">
              {results.map((result, index) => {
                const isActive = index === active
                const key =
                  result.kind === 'argument'
                    ? `${result.topicId}:${result.argumentId}`
                    : `topic:${result.topicId}`
                return (
                  <li key={key}>
                    <button
                      type="button"
                      data-index={index}
                      onMouseMove={() => setActive(index)}
                      onClick={() => go(result)}
                      className={`flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors sm:px-5 ${
                        isActive
                          ? 'bg-gold-900/15 dark:bg-gold-900/25'
                          : 'hover:bg-ink-900/5 dark:hover:bg-ink-700/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400">
                          {result.topicLabel}
                        </span>
                        {result.kind === 'topic' ? (
                          <span className="rounded-full bg-ink-200/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:bg-ink-700/70 dark:text-parchment-400">
                            {result.comingSoon ? strings.search.topicComingSoonBadge : strings.search.topicBadge}
                          </span>
                        ) : null}
                      </div>

                      <span className="font-serif text-base font-semibold leading-snug text-ink-900 dark:text-parchment-50">
                        {result.title}
                      </span>

                      {result.kind === 'argument' && result.shortClaim ? (
                        <span className="line-clamp-2 text-sm leading-relaxed text-ink-600 dark:text-parchment-300">
                          {result.shortClaim}
                        </span>
                      ) : null}

                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        {(result.matchedCitations.length
                          ? result.matchedCitations
                          : result.citations
                        )
                          .slice(0, 3)
                          .map((citation) => (
                            <span
                              key={citation}
                              className="rounded bg-gold-900/10 px-2 py-0.5 font-sans text-xs font-medium text-gold-700 ring-1 ring-inset ring-gold-500/40 dark:bg-ink-900/70 dark:text-gold-200 dark:ring-gold-500/30"
                            >
                              {citation}
                            </span>
                          ))}
                        {result.strength ? (
                          <StrengthBadge strength={result.strength} />
                        ) : null}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="hidden items-center justify-between gap-3 border-t border-ink-200/70 px-5 py-2 text-xs text-ink-500 dark:border-ink-600/60 dark:text-parchment-500 sm:flex">
          <span>
            <kbd className="rounded bg-ink-200/70 px-1.5 py-0.5 dark:bg-ink-700/70">↑</kbd>{' '}
            <kbd className="rounded bg-ink-200/70 px-1.5 py-0.5 dark:bg-ink-700/70">↓</kbd> {strings.search.navHintMove}
          </span>
          <span>
            <kbd className="rounded bg-ink-200/70 px-1.5 py-0.5 dark:bg-ink-700/70">↵</kbd> {strings.search.navHintOpen} ·{' '}
            <kbd className="rounded bg-ink-200/70 px-1.5 py-0.5 dark:bg-ink-700/70">esc</kbd> {strings.search.navHintClose}
          </span>
        </div>
      </div>
    </div>
  )
}
