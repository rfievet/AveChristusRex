import type { Strength } from '../data/types'

export interface FilterSection {
  label: string
  id: string
  count: number
}

type StrengthFilter = Strength | 'all'

interface TopicFilterBarProps {
  sections: FilterSection[]
  activeStrength: StrengthFilter
  onStrengthChange: (strength: StrengthFilter) => void
}

// Strength toggle options. Styling mirrors StrengthBadge's per-strength colour
// intent (gold solid for scriptural, amber outline for strong, muted for
// supplementary) with a neutral style for "All".
const STRENGTH_OPTIONS: {
  value: StrengthFilter
  label: string
  active: string
  idle: string
}[] = [
  {
    value: 'all',
    label: 'All',
    active: 'bg-ink-900 text-parchment-50 ring-1 ring-inset ring-ink-900 dark:bg-parchment-100 dark:text-ink-900 dark:ring-parchment-100',
    idle: 'bg-transparent text-ink-700 ring-1 ring-inset ring-ink-300/70 hover:text-ink-900 dark:text-parchment-200 dark:ring-ink-500/60 dark:hover:text-parchment-50',
  },
  {
    value: 'scriptural',
    label: 'Scriptural',
    active: 'bg-gold-400 text-ink-900 ring-1 ring-inset ring-gold-500',
    idle: 'bg-transparent text-gold-700 ring-1 ring-inset ring-gold-500/50 hover:bg-gold-900/10 dark:text-gold-200 dark:ring-gold-400/50 dark:hover:bg-gold-900/20',
  },
  {
    value: 'strong',
    label: 'Strong',
    active: 'bg-gold-900/15 text-gold-700 ring-1 ring-inset ring-gold-500/60 dark:bg-gold-900/40 dark:text-gold-200 dark:ring-gold-400/70',
    idle: 'bg-transparent text-gold-700 ring-1 ring-inset ring-gold-500/40 hover:bg-gold-900/10 dark:text-gold-200 dark:ring-gold-400/40 dark:hover:bg-gold-900/20',
  },
  {
    value: 'supplementary',
    label: 'Supplementary',
    active: 'bg-ink-200 text-ink-700 ring-1 ring-inset ring-ink-300/70 dark:bg-ink-700/70 dark:text-parchment-200 dark:ring-ink-400/50',
    idle: 'bg-transparent text-ink-600 ring-1 ring-inset ring-ink-300/60 hover:bg-ink-200/60 dark:text-parchment-300 dark:ring-ink-500/50 dark:hover:bg-ink-700/50',
  },
]

// Scroll a jumped-to section heading into view with the sticky nav + filter bar
// cleared. The section headings carry a matching scroll-mt so native anchor
// behaviour also lands correctly; this keeps the smooth-scroll consistent.
function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function TopicFilterBar({ sections, activeStrength, onStrengthChange }: TopicFilterBarProps) {
  return (
    <div className="sticky top-[56px] z-30 -mx-4 mb-10 border-b border-gold-500/30 bg-parchment-50/90 px-4 py-2.5 backdrop-blur dark:border-gold-500/20 dark:bg-ink-900/90 sm:-mx-6 sm:px-6">
      {/* Category jump chips — horizontally scrollable on mobile, wrapping on wider screens */}
      {sections.length ? (
        <nav aria-label="Jump to section" className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible sm:pb-0">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-ink-300/70 bg-parchment-100/80 px-3.5 text-sm font-medium text-ink-700 transition-colors hover:border-gold-500/60 hover:text-gold-700 dark:border-ink-500/50 dark:bg-ink-800/60 dark:text-parchment-200 dark:hover:border-gold-500/50 dark:hover:text-gold-200"
            >
              <span>{section.label}</span>
              <span className="rounded-full bg-ink-200/80 px-1.5 py-0.5 text-xs font-semibold text-ink-600 dark:bg-ink-700/80 dark:text-parchment-300">
                {section.count}
              </span>
            </button>
          ))}
        </nav>
      ) : null}

      {/* Strength filter toggles */}
      <div
        className="mt-2 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible sm:pb-0"
        role="group"
        aria-label="Filter arguments by strength"
      >
        {STRENGTH_OPTIONS.map((option) => {
          const isActive = activeStrength === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onStrengthChange(option.value)}
              aria-pressed={isActive}
              className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActive ? option.active : option.idle
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
