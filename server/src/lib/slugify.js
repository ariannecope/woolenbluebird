export function slugify(input) {
  const slug = String(input ?? '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200)

  return slug || 'untitled'
}

/**
 * Appends -2, -3, ... to `base` until `exists(candidate)` reports false —
 * used to keep publish-time slugs unique against Story/Maker without a
 * database-level retry loop.
 */
export async function uniqueSlug(base, exists) {
  const root = slugify(base)
  let candidate = root
  let attempt = 2

  while (await exists(candidate)) {
    candidate = `${root}-${attempt}`
    attempt += 1
  }

  return candidate
}
