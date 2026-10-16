import type { ReactNode } from 'react'

type CalloutVariant = 'info' | 'caveat' | 'disclaimer' | 'rebuttal'

const VARIANTS: Record<CalloutVariant, { container: string; title: string }> = {
  info: {
    container: 'border-gold-500/40 bg-gold-900/10 dark:bg-gold-900/15',
    title: 'text-gold-700 dark:text-gold-200',
  },
  caveat: {
    container: 'border-ink-300/60 bg-parchment-200/70 dark:border-parchment-500/30 dark:bg-ink-800/60',
    title: 'text-ink-700 dark:text-parchment-200',
  },
  disclaimer: {
    container: 'border-ink-300/70 bg-parchment-200/80 dark:border-ink-500/60 dark:bg-ink-800/70',
    title: 'text-ink-700 dark:text-parchment-200',
  },
  rebuttal: {
    container: 'border-gold-500/50 bg-gold-900/10 dark:border-gold-400/50 dark:bg-ink-900/70',
    title: 'text-gold-700 dark:text-gold-300',
  },
}

interface CalloutProps {
  variant?: CalloutVariant
  title?: string
  children: ReactNode
}

export default function Callout({ variant = 'info', title, children }: CalloutProps) {
  const styles = VARIANTS[variant]
  return (
    <div className={`rounded-lg border px-4 py-3 sm:px-5 ${styles.container}`}>
      {title ? (
        <p className={`mb-1.5 text-xs font-semibold uppercase tracking-widest ${styles.title}`}>
          {title}
        </p>
      ) : null}
      <div className="text-base leading-relaxed text-ink-800 dark:text-parchment-100">{children}</div>
    </div>
  )
}
