import { Router } from 'express'
import crypto from 'node:crypto'
import rateLimit from 'express-rate-limit'
import { prisma } from '../db.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { isNonEmptyString, isValidEmail } from '../lib/validation.js'

export const newsletterSubscriptionsRouter = Router()

const EMAIL_MAX_LENGTH = 320
const TOKEN_TTL_MS = 48 * 60 * 60 * 1000

// Identifies which version of the signup consent language a subscriber
// agreed to (see Subscriber.consentTextVersion in schema.prisma). Stamped
// from this fixed constant, never from client input, so it always reflects
// what the server actually served — bump it if the consent copy changes.
const CONSENT_TEXT_VERSION = '2026-11-19-v1'

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many signup attempts. Please try again later.' },
})

function generateConfirmationToken() {
  return crypto.randomBytes(32).toString('hex')
}

// The response is identical regardless of whether the email was new,
// already pending, already active, or resubscribing — the public API never
// reveals a given address's subscription state, so it can't be used to
// check who is on the list.
const SIGNUP_RESPONSE = {
  data: {
    message:
      "Thanks for signing up — we've received your email address. " +
      "Email confirmation isn't available yet, so there's nothing to check " +
      'right now. You can unsubscribe at any time once that feature is live.',
  },
}

newsletterSubscriptionsRouter.post(
  '/',
  signupLimiter,
  asyncHandler(async (req, res) => {
    const body = req.body ?? {}
    const email = isNonEmptyString(body.email) ? body.email.trim() : ''

    if (!email) {
      return res.status(400).json({
        error: 'Please fix the errors below and try again.',
        fieldErrors: { email: 'Please enter your email address.' },
      })
    }
    if (!isValidEmail(email) || email.length > EMAIL_MAX_LENGTH) {
      return res.status(400).json({
        error: 'Please fix the errors below and try again.',
        fieldErrors: { email: 'Please enter a valid email address.' },
      })
    }

    const now = new Date()
    const existing = await prisma.subscriber.findUnique({ where: { email } })

    if (!existing) {
      await prisma.subscriber.create({
        data: {
          email,
          status: 'PENDING',
          consentedAt: now,
          consentTextVersion: CONSENT_TEXT_VERSION,
          confirmationToken: generateConfirmationToken(),
          confirmationTokenExpiresAt: new Date(now.getTime() + TOKEN_TTL_MS),
        },
      })
    } else if (existing.status === 'UNSUBSCRIBED') {
      // Resubscribing after an explicit unsubscribe is a new consent event.
      await prisma.subscriber.update({
        where: { id: existing.id },
        data: {
          status: 'PENDING',
          consentedAt: now,
          consentTextVersion: CONSENT_TEXT_VERSION,
          confirmedAt: null,
          unsubscribedAt: null,
          confirmationToken: generateConfirmationToken(),
          confirmationTokenExpiresAt: new Date(now.getTime() + TOKEN_TTL_MS),
        },
      })
    } else if (existing.status === 'PENDING') {
      // A duplicate signup while still PENDING is not a new consent event —
      // consentedAt/consentTextVersion stay as originally recorded. Only
      // the confirmation token is refreshed, which is the hook a future
      // resend-confirmation feature can reuse without a duplicate row.
      await prisma.subscriber.update({
        where: { id: existing.id },
        data: {
          confirmationToken: generateConfirmationToken(),
          confirmationTokenExpiresAt: new Date(now.getTime() + TOKEN_TTL_MS),
        },
      })
    }
    // existing.status === 'ACTIVE': already subscribed, nothing to do.

    res.status(200).json(SIGNUP_RESPONSE)
  }),
)
