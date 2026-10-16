import type { OriginalLanguage } from '../data/types'

interface OriginalLanguageBlockProps {
  // jesus-is-god carries a structured object; jw-critique sometimes carries a plain string.
  originalLanguage: OriginalLanguage | string
}

export default function OriginalLanguageBlock({ originalLanguage }: OriginalLanguageBlockProps) {
  // Normalize the two shapes the research data uses.
  const isObject = typeof originalLanguage === 'object' && originalLanguage !== null
  const language = isObject ? originalLanguage.language : 'Original language'
  const text = isObject ? originalLanguage.text : undefined
  const translit = isObject ? originalLanguage.translit : undefined
  const note = isObject ? originalLanguage.note : originalLanguage

  return (
    <div className="rounded-lg border border-ink-200/70 bg-parchment-200/60 px-4 py-4 dark:border-ink-600/60 dark:bg-ink-900/60 sm:px-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-700 dark:text-gold-300">
        {language}
      </p>
      {text ? (
        <p lang={language === 'Greek' ? 'el' : language === 'Hebrew' ? 'he' : undefined} className="mb-1 break-words font-serif text-2xl leading-relaxed text-ink-900 dark:text-parchment-50">
          {text}
        </p>
      ) : null}
      {translit ? <p className="mb-2 font-sans text-base italic text-ink-500 dark:text-parchment-300">{translit}</p> : null}
      {note ? <p className="text-base leading-relaxed text-ink-700 dark:text-parchment-200">{note}</p> : null}
    </div>
  )
}
