import type { LocaleCode } from '../locales'
import type { UiStrings } from './types'
import { en } from './en'
import { fr } from './fr'

const TABLES: Record<LocaleCode, UiStrings> = { en, fr }

// A plain object is a nested string group (nav, search, …). Functions, strings,
// and arrays are leaf values and are taken whole from the override.
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Deep-merge the locale table over English so any key a future partial locale
// omits falls back to the English value rather than rendering `undefined`.
function deepMerge<T>(base: T, override: Partial<T>): T {
  const result = { ...base } as Record<string, unknown>
  for (const key of Object.keys(override) as (keyof T)[]) {
    const overrideValue = override[key]
    if (overrideValue === undefined) continue
    const baseValue = (base as Record<string, unknown>)[key as string]
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key as string] = deepMerge(baseValue, overrideValue as Record<string, unknown>)
    } else {
      result[key as string] = overrideValue
    }
  }
  return result as T
}

/**
 * Return the active locale's UiStrings, deep-merged over English so a missing or
 * partial key falls back to English (Decision 5). Both en/fr are fully typed, so
 * this run has no gaps; the merge is the safety net for future languages.
 */
export function getStrings(locale: LocaleCode): UiStrings {
  const table = TABLES[locale]
  if (!table || table === en) return en
  return deepMerge(en, table)
}
