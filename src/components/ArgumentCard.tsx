import type { Argument } from '../data/types'
import StrengthBadge from './StrengthBadge'
import ReferenceBlock from './ReferenceBlock'
import OriginalLanguageBlock from './OriginalLanguageBlock'
import Callout from './Callout'

interface ArgumentCardProps {
  argument: Argument
}

export default function ArgumentCard({ argument }: ArgumentCardProps) {
  const {
    id,
    title,
    shortClaim,
    strength,
    primaryReferences,
    originalLanguage,
    nwtRebuttal,
    explanation,
  } = argument

  return (
    <article
      id={id}
      className="scroll-mt-24 rounded-xl border border-ink-200/70 bg-parchment-50 p-5 shadow-sm dark:border-ink-600/50 dark:bg-ink-800/40 sm:p-6"
    >
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="font-serif text-xl font-semibold leading-snug text-ink-900 dark:text-parchment-50 sm:text-2xl">
          {title}
        </h3>
        <div className="shrink-0">
          <StrengthBadge strength={strength} />
        </div>
      </header>

      <p className="mb-5 max-w-prose text-base leading-relaxed text-ink-700 dark:text-parchment-200">{shortClaim}</p>

      {primaryReferences?.length ? (
        <div className="mb-5 space-y-3">
          {primaryReferences.map((reference, index) => (
            <ReferenceBlock key={`${id}-ref-${index}`} reference={reference} />
          ))}
        </div>
      ) : null}

      {originalLanguage ? (
        <div className="mb-5">
          <OriginalLanguageBlock originalLanguage={originalLanguage} />
        </div>
      ) : null}

      {nwtRebuttal ? (
        <div className="mb-5">
          <Callout variant="rebuttal" title="New World Translation — the dispute">
            {nwtRebuttal}
          </Callout>
        </div>
      ) : null}

      <div className="max-w-prose text-base leading-relaxed text-ink-800 dark:text-parchment-100">
        <p>{explanation}</p>
      </div>
    </article>
  )
}
