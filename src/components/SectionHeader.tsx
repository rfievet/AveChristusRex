import { useStrings } from '../i18n/useStrings'

interface SectionHeaderProps {
  title: string
  count?: number
  id?: string
}

export default function SectionHeader({ title, count, id }: SectionHeaderProps) {
  const strings = useStrings()
  return (
    <div className="mb-6 border-b border-gold-500/40 pb-3 dark:border-gold-500/30">
      <h2 id={id} className="scroll-mt-48 font-serif text-2xl font-semibold text-ink-900 dark:text-parchment-50 sm:text-3xl">
        {title}
        {typeof count === 'number' ? (
          <span className="ml-3 align-middle text-base font-normal text-gold-600 dark:text-gold-300">
            {count} {count === 1 ? strings.sectionHeader.argument : strings.sectionHeader.arguments}
          </span>
        ) : null}
      </h2>
    </div>
  )
}
