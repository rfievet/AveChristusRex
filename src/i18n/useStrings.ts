import { useContext } from 'react'
import { LocaleContext } from './LocaleProvider'
import { getStrings } from './strings'
import type { UiStrings } from './strings/types'

/** Return the active locale's UiStrings table (with per-key English fallback). */
export function useStrings(): UiStrings {
  const locale = useContext(LocaleContext)
  return getStrings(locale)
}
