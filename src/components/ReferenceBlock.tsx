import type { Reference } from '../data/types'

interface ReferenceBlockProps {
  reference: Reference
}

export default function ReferenceBlock({ reference }: ReferenceBlockProps) {
  const { citation, translationUsed, text } = reference
  return (
    <figure className="rounded-lg border-l-4 border-gold-500/70 bg-parchment-200/70 px-4 py-3 dark:bg-ink-800/50 sm:px-5">
      <figcaption className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <cite className="font-sans text-base font-semibold not-italic text-gold-700 dark:text-gold-200">{citation}</cite>
        {translationUsed ? (
          <span className="rounded bg-ink-200/70 px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-ink-600 dark:bg-ink-700/70 dark:text-parchment-300">
            {translationUsed}
          </span>
        ) : null}
      </figcaption>
      <blockquote className="font-serif text-xl leading-relaxed text-ink-800 dark:text-parchment-100 sm:text-lg">
        {text}
      </blockquote>
    </figure>
  )
}
