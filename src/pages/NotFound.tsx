import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/useLocale'
import { useStrings } from '../i18n/useStrings'
import { withLocalePath } from '../i18n/locales'

export default function NotFound() {
  const { locale } = useLocale()
  const strings = useStrings()

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-600 dark:text-gold-400">{strings.notFound.code}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900 dark:text-parchment-50">{strings.notFound.title}</h1>
      <p className="mt-3 text-ink-600 dark:text-parchment-300">{strings.notFound.body}</p>
      <Link
        to={withLocalePath(locale, '/')}
        className="mt-6 inline-flex min-h-[44px] items-center rounded-md px-2 text-gold-700 hover:text-gold-600 dark:text-gold-300 dark:hover:text-gold-200"
      >
        {strings.notFound.backHome}
      </Link>
    </div>
  )
}
