import { useEffect, useRef, useState } from 'react'

/**
 * Tracks whether an element has scrolled into view at least once, so a
 * one-time entrance animation can be tied to when it's actually seen
 * rather than when it mounts — elements far below the fold otherwise
 * finish animating long before a viewer scrolls down to them.
 */
export function useRevealOnScroll(threshold = 0.3) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [ref, revealed]
}
