import { ApiError } from './api.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Separate from api.js's apiFetch/apiPost because every admin request needs
 * `credentials: 'include'` (to send/receive the httpOnly session cookie)
 * and any method (not just GET/POST) — the public client never needs
 * either of those.
 */
async function adminFetch(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
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

export function adminLogin(payload) {
  return adminFetch('/api/admin/login', { method: 'POST', body: JSON.stringify(payload) })
}

export function adminLogout() {
  return adminFetch('/api/admin/logout', { method: 'POST' })
}

export function getAdminSession() {
  return adminFetch('/api/admin/me')
}

export function getStorySubmissions(params = {}) {
  return adminFetch(`/api/admin/story-submissions${toQueryString(params)}`)
}

export function getStorySubmission(id) {
  return adminFetch(`/api/admin/story-submissions/${encodeURIComponent(id)}`)
}

export function reviewStorySubmission(id, payload) {
  return adminFetch(`/api/admin/story-submissions/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function publishStorySubmission(id, payload) {
  return adminFetch(`/api/admin/story-submissions/${encodeURIComponent(id)}/publish`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getMakerSubmissions(params = {}) {
  return adminFetch(`/api/admin/maker-submissions${toQueryString(params)}`)
}

export function getMakerSubmission(id) {
  return adminFetch(`/api/admin/maker-submissions/${encodeURIComponent(id)}`)
}

export function reviewMakerSubmission(id, payload) {
  return adminFetch(`/api/admin/maker-submissions/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function publishMakerSubmission(id, payload) {
  return adminFetch(`/api/admin/maker-submissions/${encodeURIComponent(id)}/publish`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
