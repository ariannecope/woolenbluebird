const HAS_SCHEME = /^https?:\/\//i

/**
 * Requiring "https://" trips people up for no real reason — assume it if
 * they left it off, mirroring the server's own normalization (see
 * server/src/lib/validation.js) so what's validated here matches what
 * actually gets stored.
 */
export function normalizeUrl(raw) {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return ''
  return HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function isLikelyUrl(raw) {
  try {
    // eslint-disable-next-line no-new
    new URL(normalizeUrl(raw))
    return true
  } catch {
    return false
  }
}
