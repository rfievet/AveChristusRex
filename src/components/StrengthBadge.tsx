import type { Strength } from '../data/types'

const CONFIG: Record<Strength, { label: string; className: string; description: string }> = {
  scriptural: {
    label: 'Scriptural',
    // Solid gold with ink text: legible in both themes. Strongest, directly probative.
    className: 'bg-gold-400 text-ink-900 ring-1 ring-inset ring-gold-500',
    description: 'Direct scriptural proof',
  },
  strong: {
    label: 'Strong',
    // Amber outline: strong corroborating arguments.
    className:
      'bg-gold-900/10 text-gold-700 ring-1 ring-inset ring-gold-500/50 dark:bg-gold-900/30 dark:text-gold-200 dark:ring-gold-400/60',
    description: 'Strong supporting argument',
  },
  supplementary: {
    label: 'Supplementary',
    // Muted: devotional or traditional, not standalone proof.
    className:
      'bg-ink-100 text-ink-600 ring-1 ring-inset ring-ink-300/70 dark:bg-ink-700/60 dark:text-parchment-300 dark:ring-ink-400/50',
    description: 'Supplementary or traditional note',
  },
}

interface StrengthBadgeProps {
  strength: Strength
}

export default function StrengthBadge({ strength }: StrengthBadgeProps) {
  const { label, className, description } = CONFIG[strength] ?? CONFIG.supplementary
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${className}`}
      aria-label={`Argument strength: ${description}`}
      title={description}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  )
}
