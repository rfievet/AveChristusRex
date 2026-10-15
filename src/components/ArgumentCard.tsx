import type { Argument } from '../data/types'
import StrengthBadge from './StrengthBadge'
import ReferenceBlock from './ReferenceBlock'
import OriginalLanguageBlock from './OriginalLanguageBlock'
import Callout from './Callout'
import { useCopy } from '../hooks/useCopy'

interface ArgumentCardProps {
  argument: Argument
  // Optional: lets the Link button build an absolute deep link
  // (/topic/<topicId>#<argumentId>). When undefined, Link falls back to the
  // current pathname so the action still works.
  topicId?: string
}

// Plain-text block for the Copy action: title, each reference as
// `<citation> (<translationUsed>) — <text>`, then the shortClaim.
function buildCopyText(argument: Argument): string {
  const lines: string[] = [argument.title]
  argument.primaryReferences?.forEach((ref) => {
    lines.push(`${ref.citation} (${ref.translationUsed}) — ${ref.text}`)
  })
  lines.push(argument.shortClaim)
  return lines.join('\n\n')
}

export default function ArgumentCard({ argument, topicId }: ArgumentCardProps) {
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

  const { copied, copy } = useCopy()

  const handleCopy = () => {
    void copy(buildCopyText(argument))
  }

  const handleLink = () => {
    const origin = window.location.origin
    const href = topicId
      ? `${origin}/topic/${topicId}#${id}`
      : `${origin}${window.location.pathname}#${id}`
    void copy(href)
  }

  const actionButtonClasses =
    'inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-gold-900/10 hover:text-gold-700 dark:text-parchment-400 dark:hover:bg-ink-700/60 dark:hover:text-gold-200'

  return (
    <article
      id={id}
      className="scroll-mt-24 rounded-xl border border-ink-200/70 bg-parchment-50 p-5 shadow-sm dark:border-ink-600/50 dark:bg-ink-800/40 sm:p-6"
    >
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="font-serif text-xl font-semibold leading-snug text-ink-900 dark:text-parchment-50 sm:text-2xl">
          {title}
        </h3>
        <div className="flex shrink-0 items-center gap-1">
          <StrengthBadge strength={strength} />
          <button
            type="button"
            onClick={handleCopy}
            className={actionButtonClasses}
            aria-label={`Copy argument "${title}" with its references`}
            title="Copy argument text"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleLink}
            className={actionButtonClasses}
            aria-label={`Copy a link to argument "${title}"`}
            title="Copy link to this argument"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
            </svg>
          </button>
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

      <span aria-live="polite" role="status" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
      {copied ? (
        <div
          className="pointer-events-none mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold-900/10 px-3 py-1 text-xs font-semibold text-gold-700 motion-safe:animate-[fade-in_150ms_ease-out] dark:bg-gold-900/30 dark:text-gold-200"
          aria-hidden="true"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
          Copied
        </div>
      ) : null}
    </article>
  )
}
