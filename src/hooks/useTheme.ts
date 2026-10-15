import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Reads and toggles the site theme. The authoritative state lives on
 * <html class="dark">, set synchronously by the no-flash script in index.html
 * before React mounts — so initializing from the class here matches what the
 * user already sees, with no hydration flash. Toggling flips the class and
 * persists the choice to localStorage['theme'].
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => currentTheme())

  // Keep local state in sync if the class changes outside this hook (e.g. the
  // OS color-scheme updates on first visit before a choice is saved).
  useEffect(() => {
    setTheme(currentTheme())
  }, [])

  const setAndPersist = useCallback((next: Theme) => {
    const root = document.documentElement
    if (next === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* localStorage unavailable (private mode): toggle still works for the session */
    }
    setTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setAndPersist(currentTheme() === 'dark' ? 'light' : 'dark')
  }, [setAndPersist])

  return { theme, isDark: theme === 'dark', toggleTheme }
}
