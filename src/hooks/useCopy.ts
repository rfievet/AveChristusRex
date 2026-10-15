import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Writes text to the clipboard and tracks a brief "copied" confirmation.
 *
 * Uses the async Clipboard API when available (secure contexts), and falls back
 * to a temporary <textarea> + document.execCommand('copy') for insecure
 * contexts / older browsers. The `copied` flag flips true on success and clears
 * itself after ~1.5s so callers can render an aria-live confirmation.
 */
export function useCopy(resetMs = 1500) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>()

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      let ok = false
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
          ok = true
        } else {
          ok = legacyCopy(text)
        }
      } catch {
        ok = legacyCopy(text)
      }

      if (ok) {
        setCopied(true)
        if (timer.current) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), resetMs)
      }
      return ok
    },
    [resetMs],
  )

  return { copied, copy }
}

function legacyCopy(text: string): boolean {
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '-9999px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
