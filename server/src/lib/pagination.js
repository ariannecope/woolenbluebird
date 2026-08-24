const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

/**
 * Parses `limit`/`offset` query params, clamping to sane bounds so a bad or
 * malicious value can't force an unbounded or negative query.
 */
export function parsePagination(query) {
  const rawLimit = Number.parseInt(query.limit, 10)
  const rawOffset = Number.parseInt(query.offset, 10)

  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT) : DEFAULT_LIMIT
  const offset = Number.isFinite(rawOffset) ? Math.max(rawOffset, 0) : 0

  return { limit, offset }
}
