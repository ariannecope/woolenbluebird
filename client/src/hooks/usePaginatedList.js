import { useCallback, useEffect, useRef, useState } from 'react'

const PAGE_SIZE = 20

/**
 * Like useAsync, but for a "Load More" list: `fetchPage(offset, limit)`
 * fetches one page from an endpoint that returns { data, meta: { total } }
 * (see server/src/lib/pagination.js). Changing `deps` (e.g. a filter)
 * reloads from page one and replaces the list; calling `loadMore` instead
 * appends the next page to what's already shown.
 */
export function usePaginatedList(fetchPage, deps) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const offsetRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)

    fetchPage(0, PAGE_SIZE)
      .then((result) => {
        if (cancelled) return
        const data = result.data ?? []
        setItems(data)
        setTotal(result.meta?.total ?? data.length)
        offsetRef.current = data.length
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
    // `fetchPage` isn't a dep on purpose, same as useAsync's asyncFn — only
    // the caller's own `deps` (e.g. filter values) or a retry() should
    // trigger a reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const loadMore = useCallback(
    async () => {
      setLoadingMore(true)
      try {
        const result = await fetchPage(offsetRef.current, PAGE_SIZE)
        const data = result.data ?? []
        setItems((prev) => [...prev, ...data])
        offsetRef.current += data.length
        setTotal(result.meta?.total ?? offsetRef.current)
      } catch (err) {
        setError(err)
      } finally {
        setLoadingMore(false)
      }
    },
    // `fetchPage` *is* a dep here (unlike the effect above) — loadMore is
    // only ever called from a click, never on render, so it needs to
    // always use whatever filter is current rather than whatever filter
    // was active the first time this hook ran.
    [fetchPage],
  )

  return { status, items, error, total, hasMore: items.length < total, loadMore, loadingMore, retry }
}
