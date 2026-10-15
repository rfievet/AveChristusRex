import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-600 dark:text-gold-400">404</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900 dark:text-parchment-50">Page not found</h1>
      <p className="mt-3 text-ink-600 dark:text-parchment-300">The page you were looking for isn't here.</p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-[44px] items-center rounded-md px-2 text-gold-700 hover:text-gold-600 dark:text-gold-300 dark:hover:text-gold-200"
      >
        ← Back to home
      </Link>
    </div>
  )
}
