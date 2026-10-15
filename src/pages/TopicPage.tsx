import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getTopicMeta } from '../data/topics'
import type { Argument, Strength } from '../data/types'
import SectionHeader from '../components/SectionHeader'
import ArgumentCard from '../components/ArgumentCard'
import Callout from '../components/Callout'
import TopicFilterBar from '../components/TopicFilterBar'

// Build the ordered list of section labels, preferring the topic's declared order
// (categories for jesus-is-god, subCategories for jw-critique) and falling back to
// the order the arguments' own categories first appear.
function sectionOrder(declared: string[] | undefined, args: Argument[]): string[] {
  const seen = new Set<string>()
  const order: string[] = []
  const push = (label: string) => {
    if (label && !seen.has(label)) {
      seen.add(label)
      order.push(label)
    }
  }
  declared?.forEach(push)
  args.forEach((arg) => push(arg.category))
  return order
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const { hash } = useLocation()
  const meta = getTopicMeta(topicId)
  const [activeStrength, setActiveStrength] = useState<Strength | 'all'>('all')

  // A deep link (/topic/<id>#<argumentId>) must always be able to reach its
  // target card, even if a strength filter would otherwise hide it. Reset the
  // filter to 'all' whenever a hash is present so the hash-scroll effect below
  // can find and flash the card.
  useEffect(() => {
    if (hash) setActiveStrength('all')
  }, [hash, topicId])

  // When arriving with a hash (e.g. from search: /topic/<id>#<argumentId>),
  // scroll the target argument into view and flash a brief highlight. Runs after
  // the content for this topic has rendered.
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    if (!id) return
    // defer to the next frame so the argument cards are in the DOM
    const frame = window.requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el.classList.add('search-flash')
      window.setTimeout(() => el.classList.remove('search-flash'), 1600)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hash, topicId])

  if (!meta) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl text-ink-900 dark:text-parchment-50">Topic not found</h1>
        <p className="mt-3 text-ink-600 dark:text-parchment-300">We couldn't find that topic.</p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-md px-2 text-gold-700 hover:text-gold-600 dark:text-gold-300 dark:hover:text-gold-200"
        >
          ← Back to home
        </Link>
      </div>
    )
  }

  if (meta.status !== 'live' || !meta.loadContent) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <span className="mb-3 inline-flex rounded-full bg-ink-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-500 dark:bg-ink-700/70 dark:text-parchment-400">
          Coming soon
        </span>
        <h1 className="font-serif text-3xl text-ink-900 dark:text-parchment-50 sm:text-4xl">{meta.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-600 dark:text-parchment-300">{meta.blurb}</p>
        <p className="mt-4 text-sm text-ink-500 dark:text-parchment-400">
          This section is in preparation and will be published soon.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-md px-2 text-gold-700 hover:text-gold-600 dark:text-gold-300 dark:hover:text-gold-200"
        >
          ← Back to home
        </Link>
      </div>
    )
  }

  const content = meta.loadContent()
  const heading = content.title || content.topic || meta.title
  const declaredSections = content.categories ?? content.subCategories
  const order = sectionOrder(declaredSections, content.arguments)

  // Group arguments by their category, preserving document order within a group.
  const grouped = new Map<string, Argument[]>()
  content.arguments.forEach((arg) => {
    const list = grouped.get(arg.category) ?? []
    list.push(arg)
    grouped.set(arg.category, list)
  })

  // Intro callouts differ per topic shape.
  const introCallouts: { key: string; variant: 'info' | 'caveat' | 'disclaimer'; title: string; body: string }[] = []
  if (content.disclaimer) {
    introCallouts.push({ key: 'disclaimer', variant: 'disclaimer', title: 'Please note', body: content.disclaimer })
  }
  if (content.displayTranslationNote) {
    introCallouts.push({
      key: 'translation',
      variant: 'info',
      title: content.displayTranslation ? `Display translation — ${content.displayTranslation}` : 'Display translation',
      body: content.displayTranslationNote,
    })
  }
  if (content.divineNameNote) {
    introCallouts.push({ key: 'divine-name', variant: 'info', title: 'On the divine name', body: content.divineNameNote })
  }
  if (content.methodologyNote) {
    introCallouts.push({ key: 'methodology', variant: 'caveat', title: 'Methodology', body: content.methodologyNote })
  }

  // Apply the active strength filter per section, dropping empty sections. The
  // filter bar's chips and the rendered sections both derive from this list, so
  // later-added categories/arguments appear automatically with no code change.
  const visibleSections = order
    .map((label) => {
      const all = grouped.get(label) ?? []
      const args = activeStrength === 'all' ? all : all.filter((arg) => arg.strength === activeStrength)
      return { label, id: `section-${slugify(label)}`, args }
    })
    .filter((section) => section.args.length > 0)

  const filterSections = visibleSections.map(({ label, id, args }) => ({ label, id, count: args.length }))

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-8">
        <Link
          to="/"
          className="-ml-2 inline-flex min-h-[44px] items-center rounded-md px-2 text-sm text-gold-700 hover:text-gold-600 dark:text-gold-300 dark:hover:text-gold-200"
        >
          ← All topics
        </Link>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900 dark:text-parchment-50 sm:text-5xl">
          {heading}
        </h1>
        {content.subtitle ? (
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-600 dark:text-parchment-300">
            {content.subtitle}
          </p>
        ) : null}
      </header>

      {introCallouts.length ? (
        <div className="mb-10 space-y-3">
          {introCallouts.map((c) => (
            <Callout key={c.key} variant={c.variant} title={c.title}>
              {c.body}
            </Callout>
          ))}
        </div>
      ) : null}

      <TopicFilterBar
        sections={filterSections}
        activeStrength={activeStrength}
        onStrengthChange={setActiveStrength}
      />

      <div className="space-y-12">
        {visibleSections.map(({ label, id, args }) => (
          <section key={label} aria-labelledby={id}>
            <SectionHeader id={id} title={label} count={args.length} />
            <div className="space-y-6">
              {args.map((arg) => (
                <ArgumentCard key={arg.id} argument={arg} topicId={topicId} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {content.uncertainCitations?.length ? (
        <details className="mt-12 rounded-xl border border-ink-200/70 bg-parchment-50 p-5 dark:border-ink-600/50 dark:bg-ink-800/40 sm:p-6">
          <summary className="flex min-h-[44px] cursor-pointer items-center rounded-md font-serif text-xl font-semibold text-ink-900 dark:text-parchment-50">
            Honest caveats ({content.uncertainCitations.length})
          </summary>
          <p className="mt-2 text-sm text-ink-600 dark:text-parchment-300">
            Points of versification, translation uncertainty, or devotional (non-probative) claims,
            flagged for honest debate.
          </p>
          <ul className="mt-4 space-y-4">
            {content.uncertainCitations.map((item, index) => (
              <li key={`${item.citation}-${index}`} className="border-l-2 border-gold-500/50 pl-4 dark:border-gold-500/40">
                <p className="font-sans text-sm font-semibold text-gold-700 dark:text-gold-200">{item.citation}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-700 dark:text-parchment-200">{item.issue}</p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}
