import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../lib/asyncHandler.js'
import { ADMIN_COOKIE_NAME, adminCookieOptions, signAdminToken, verifyAdminToken } from '../lib/auth.js'

export const adminAuthRouter = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
})

adminAuthRouter.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

    if (!adminEmail || !adminPasswordHash) {
      console.error('ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not configured — see server/.env.example')
      return res.status(500).json({ error: 'Admin login is not configured.' })
    }

    const { email, password } = req.body ?? {}
    const invalidCredentials = { error: 'Invalid email or password.' }

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json(invalidCredentials)
    }

    // Run both checks unconditionally (rather than short-circuiting on a
    // failed email match) so response timing doesn't hint at which part
    // of the credential pair was wrong.
    const emailMatches = email.trim().toLowerCase() === adminEmail.trim().toLowerCase()
    const passwordMatches = await bcrypt.compare(password, adminPasswordHash)

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json(invalidCredentials)
    }

    const token = signAdminToken({ sub: 'admin', email: adminEmail })
    res.cookie(ADMIN_COOKIE_NAME, token, adminCookieOptions())
    res.json({ data: { email: adminEmail } })
  }),
)

adminAuthRouter.post('/logout', (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, { ...adminCookieOptions(), maxAge: undefined })
  res.json({ data: { loggedOut: true } })
})

adminAuthRouter.get('/me', (req, res) => {
  const token = req.cookies?.[ADMIN_COOKIE_NAME]

  if (!token) {
    return res.json({ data: { authenticated: false } })
  }

  try {
    const payload = verifyAdminToken(token)
    res.json({ data: { authenticated: true, email: payload.email } })
  } catch {
    res.json({ data: { authenticated: false } })
  }
})
