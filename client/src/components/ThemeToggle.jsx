import { useTheme } from '../hooks/useTheme.js'
import './ThemeToggle.css'

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.4 14.7A8.5 8.5 0 0 1 9.3 3.6a.75.75 0 0 0-.9-1 10 10 0 1 0 12.9 12.9.75.75 0 0 0-1-.9c-.3.1-.6.1-.9.1z"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="4.25" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 2.75v2.25" />
        <path d="M12 19v2.25" />
        <path d="M4.4 4.4l1.6 1.6" />
        <path d="M18 18l1.6 1.6" />
        <path d="M2.75 12H5" />
        <path d="M19 12h2.25" />
        <path d="M4.4 19.6l1.6-1.6" />
        <path d="M18 6l1.6-1.6" />
      </g>
    </svg>
  )
}

function ThemeToggle() {
  const [theme, toggleTheme] = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

export default ThemeToggle
