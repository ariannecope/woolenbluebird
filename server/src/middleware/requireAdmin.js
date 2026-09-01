import { ADMIN_COOKIE_NAME, verifyAdminToken } from '../lib/auth.js'

/**
 * Protects /api/admin/* routes (except login). The session cookie is the
 * sole source of truth — there's no server-side session store, so this is
 * just signature + expiry verification.
 */
export function requireAdmin(req, res, next) {
  const token = req.cookies?.[ADMIN_COOKIE_NAME]

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' })
  }

  try {
    req.admin = verifyAdminToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Your session has expired. Please log in again.' })
  }
}
