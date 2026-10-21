import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'wb-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Site-wide light/dark theme, applied as data-theme on <html> so plain
 * CSS (tokens.css) can key off it. Defaults to the OS preference until the
 * viewer picks explicitly, then remembers that choice in localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return [theme, toggleTheme]
}
