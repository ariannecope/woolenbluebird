const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  constructor(message, { status, fieldErrors } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function apiFetch(path) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`)
  } catch {
    throw new ApiError(
      'Unable to reach the Woolen Bluebird server. Check your connection and try again.',
    )
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(body?.error ?? `Request failed with status ${response.status}`, {
      status: response.status,
    })
  }

  return body
}

async function apiPost(path, payload) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new ApiError(
      'Unable to reach the Woolen Bluebird server. Check your connection and try again.',
    )
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(body?.error ?? `Request failed with status ${response.status}`, {
      status: response.status,
      fieldErrors: body?.fieldErrors,
    })
  }

  return body
}

function toQueryString(params = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value)
    }
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}

export function getStories(params = {}) {
  return apiFetch(`/api/stories${toQueryString(params)}`)
}

export function getStoryBySlug(slug) {
  return apiFetch(`/api/stories/${encodeURIComponent(slug)}`)
}

export function getMakers(params = {}) {
  return apiFetch(`/api/makers${toQueryString(params)}`)
}

export function getMakerBySlug(slug) {
  return apiFetch(`/api/makers/${encodeURIComponent(slug)}`)
}

export function getCategories() {
  return apiFetch('/api/categories')
}

export function getGatherings() {
  return apiFetch('/api/gatherings')
}

export function submitStory(payload) {
  return apiPost('/api/story-submissions', payload)
}

export function submitMaker(payload) {
  return apiPost('/api/maker-submissions', payload)
}
