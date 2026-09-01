import jwt from 'jsonwebtoken'

export const ADMIN_COOKIE_NAME = 'wb_admin_session'
const TOKEN_TTL = '7d'
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

function requireSecret() {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not set — see server/.env.example')
  }
  return secret
}

export function signAdminToken(payload) {
  return jwt.sign(payload, requireSecret(), { expiresIn: TOKEN_TTL })
}

export function verifyAdminToken(token) {
  return jwt.verify(token, requireSecret())
}

/**
 * Cross-origin (frontend/backend on different domains) requires
 * SameSite=None, which browsers only honor alongside Secure — so in
 * production both flip on together. Locally, http://localhost:5173 and
 * :4000 are same-site to each other, so Lax without Secure works over
 * plain http.
 */
export function adminCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE_MS,
  }
}
