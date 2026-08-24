// Shared server-side validation helpers for submission endpoints (Story
// Submission, Maker Submission). Client-side validation is a UX nicety;
// these are the checks that actually decide what gets persisted.

const DEFAULT_URL_MAX_LENGTH = 2000

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validates an optional URL field, returning { value, error }. `value` is
 * the trimmed string to persist (or null if the field was left blank);
 * `error` is a user-facing message if the field was non-blank but invalid.
 */
export function validateOptionalUrl(raw, maxLength = DEFAULT_URL_MAX_LENGTH) {
  if (raw === undefined || raw === null || raw === '') {
    return { value: null, error: null }
  }
  if (typeof raw !== 'string' || raw.length > maxLength || !isValidUrl(raw.trim())) {
    return { value: null, error: 'Please enter a valid link starting with http:// or https://.' }
  }
  return { value: raw.trim(), error: null }
}

/**
 * Validates a `socialLinks`-shaped object (arbitrary string keys -> URL
 * values), returning { value, error }. `value` is a cleaned object with
 * only non-blank, valid entries (or null if none survive), `error` is set
 * if any provided entry was invalid or the shape itself was wrong.
 */
export function validateSocialLinks(raw, maxLength = DEFAULT_URL_MAX_LENGTH) {
  if (raw === undefined || raw === null) {
    return { value: null, error: null }
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return { value: null, error: 'Social links are invalid.' }
  }

  const cleaned = {}
  for (const [key, rawValue] of Object.entries(raw)) {
    const { value, error } = validateOptionalUrl(rawValue, maxLength)
    if (error) {
      return { value: null, error: 'Please enter valid links starting with http:// or https://.' }
    }
    if (value) cleaned[key] = value
  }

  return { value: Object.keys(cleaned).length > 0 ? cleaned : null, error: null }
}
