import { Link } from 'react-router-dom'
import { listTopics } from '../data/topics'
import { useLocale } from '../i18n/useLocale'
import { useStrings } from '../i18n/useStrings'
import { localized, withLocalePath } from '../i18n/locales'

export default function Home() {
  const { locale } = useLocale()
  const strings = useStrings()
  const topics = listTopics()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* Hero */}
      <section className="py-14 text-center sm:py-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-gold-600 dark:text-gold-400">{strings.home.eyebrow}</p>
        <h1 className="font-serif text-5xl font-semibold text-ink-900 dark:text-parchment-50 sm:text-6xl md:text-7xl">
          {strings.home.brand}
        </h1>
        <p className="mt-3 font-serif text-xl text-ink-600 dark:text-parchment-300 sm:text-2xl">{strings.home.tagline}</p>
        <div className="mx-auto my-6 h-px w-24 bg-gold-500" />
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-ink-700 dark:text-parchment-200 sm:text-lg">
          {strings.home.intro}
        </p>
      </section>

      {/* Topic grid */}
      <section className="pb-16">
        <h2 className="mb-6 font-serif text-2xl font-semibold text-ink-900 dark:text-parchment-50">{strings.home.topicsHeading}</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {topics.map((topic) => {
            const isLive = topic.status === 'live'
            const cardBase =
              'flex h-full flex-col rounded-xl border p-6 transition-colors'

            if (isLive) {
              return (
                <Link
                  key={topic.id}
                  to={withLocalePath(locale, `/topic/${topic.id}`)}
                  className={`${cardBase} border-gold-500/40 bg-parchment-50 hover:border-gold-500 hover:bg-parchment-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 dark:bg-ink-800/50 dark:hover:border-gold-400 dark:hover:bg-ink-800/80 dark:focus-visible:outline-gold-400`}
                >
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">
                    {strings.home.live}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-ink-900 dark:text-parchment-50">
                    {localized(topic.title, locale)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700 dark:text-parchment-200">
                    {localized(topic.blurb, locale)}
                  </p>
                  <span className="mt-4 text-sm font-medium text-gold-700 dark:text-gold-300">{strings.home.explore}</span>
                </Link>
              )
            }

            return (
              <div
                key={topic.id}
                aria-disabled="true"
                className={`${cardBase} cursor-default border-ink-200/70 bg-parchment-200/50 dark:border-ink-600/50 dark:bg-ink-900/40`}
              >
                <span className="mb-2 inline-flex w-fit rounded-full bg-ink-200/70 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-ink-500 dark:bg-ink-700/70 dark:text-parchment-400">
                  {strings.home.comingSoon}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-ink-500 dark:text-parchment-300">
                  {localized(topic.title, locale)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-400 dark:text-parchment-400">
                  {localized(topic.blurb, locale)}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
