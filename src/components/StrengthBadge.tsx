import { useStrings } from '../i18n/useStrings'
import type { Strength } from '../data/types'

// Per-strength Tailwind classes stay in-component; the text (label/description)
// comes from the active locale's strings table.
const CLASS_MAP: Record<Strength, string> = {
  // Solid gold with ink text: legible in both themes. Strongest, directly probative.
  scriptural: 'bg-gold-400 text-ink-900 ring-1 ring-inset ring-gold-500',
  // Amber outline: strong corroborating arguments.
  strong:
    'bg-gold-900/10 text-gold-700 ring-1 ring-inset ring-gold-500/50 dark:bg-gold-900/30 dark:text-gold-200 dark:ring-gold-400/60',
  // Muted: devotional or traditional, not standalone proof.
  supplementary:
    'bg-ink-100 text-ink-600 ring-1 ring-inset ring-ink-300/70 dark:bg-ink-700/60 dark:text-parchment-300 dark:ring-ink-400/50',
}

interface StrengthBadgeProps {
  strength: Strength
}

export default function StrengthBadge({ strength }: StrengthBadgeProps) {
  const strings = useStrings()
  const className = CLASS_MAP[strength] ?? CLASS_MAP.supplementary
  const { label, description } = strings.strengthBadge[strength] ?? strings.strengthBadge.supplementary
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
