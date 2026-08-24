import { useCallback, useEffect, useState } from 'react'

/**
 * Runs an async fetch on mount and whenever `deps` change, exposing a
 * status/data/error shape plus a `retry` you can wire to an error state's
 * "try again" action.
 */
export function useAsync(asyncFn, deps = []) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ status: 'loading', data: null, error: null })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', data: null, error: null })

    asyncFn()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', data: null, error })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { ...state, retry }
}
