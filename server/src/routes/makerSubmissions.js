import { Router } from 'express'
import { prisma } from '../db.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { isNonEmptyString, isValidEmail, validateOptionalUrl, validateSocialLinks } from '../lib/validation.js'

export const makerSubmissionsRouter = Router()

const MAX_LENGTHS = {
  name: 200,
  email: 320,
  location: 200,
  description: 3000,
  craftCategory: 500,
  workshopInformation: 2000,
  recommendationReason: 2000,
}

/**
 * This phase treats Maker Submission as self-submission ("tell us about
 * yourself") rather than the PRD's fuller third-party-nomination flow —
 * see the schema comments and the frontend for details. `name`/`email`
 * populate both the maker-facing and submitter-facing columns.
 */
makerSubmissionsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = req.body ?? {}
    const errors = {}

    const name = isNonEmptyString(body.name) ? body.name.trim() : ''
    const email = isNonEmptyString(body.email) ? body.email.trim() : ''
    const location = isNonEmptyString(body.location) ? body.location.trim() : ''
    const description = isNonEmptyString(body.description) ? body.description.trim() : ''
    const craftCategory = isNonEmptyString(body.craftCategory) ? body.craftCategory.trim() : ''

    if (!name) errors.name = 'Please enter your name.'
    else if (name.length > MAX_LENGTHS.name) errors.name = 'Name is too long.'

    if (!email) errors.email = 'Please enter your email address.'
    else if (!isValidEmail(email)) errors.email = 'Please enter a valid email address.'
    else if (email.length > MAX_LENGTHS.email) errors.email = 'Email is too long.'

    if (!location) errors.location = 'Please enter your location.'
    else if (location.length > MAX_LENGTHS.location) errors.location = 'Location is too long.'

    if (!description) errors.description = 'Please share a short bio or description.'
    else if (description.length > MAX_LENGTHS.description) errors.description = 'Description is too long.'

    if (!craftCategory) {
      errors.craftCategory = 'Please choose at least one craft or making category.'
    } else if (craftCategory.length > MAX_LENGTHS.craftCategory) {
      errors.craftCategory = 'Too many categories selected.'
    }

    const website = validateOptionalUrl(body.website)
    if (website.error) errors.website = website.error

    const socialLinks = validateSocialLinks(body.socialLinks)
    if (socialLinks.error) errors.socialLinks = socialLinks.error

    let workshopInformation = null
    if (isNonEmptyString(body.workshopInformation)) {
      if (
        typeof body.workshopInformation !== 'string' ||
        body.workshopInformation.length > MAX_LENGTHS.workshopInformation
      ) {
        errors.workshopInformation = 'Workshop information is too long.'
      } else {
        workshopInformation = body.workshopInformation.trim()
      }
    }

    let recommendationReason = null
    if (isNonEmptyString(body.recommendationReason)) {
      if (
        typeof body.recommendationReason !== 'string' ||
        body.recommendationReason.length > MAX_LENGTHS.recommendationReason
      ) {
        errors.recommendationReason = 'That note is too long.'
      } else {
        recommendationReason = body.recommendationReason.trim()
      }
    }

    const permissionToContact = body.permissionToContact === true
    const publicationPermission = body.publicationPermission === true

    // permissionToContact is optional; publicationPermission (listing
    // permission) is required — a submission cannot be accepted without it.
    if (!publicationPermission) {
      errors.publicationPermission =
        'Please check the listing permission box to submit your information.'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Please fix the errors below and try again.',
        fieldErrors: errors,
      })
    }

    const submission = await prisma.makerSubmission.create({
      data: {
        makerName: name,
        submitterName: name,
        submitterEmail: email,
        location,
        description,
        craftCategory,
        website: website.value,
        socialLinks: socialLinks.value ?? undefined,
        workshopInformation,
        recommendationReason,
        permissionToContact,
        publicationPermission,
        status: 'PENDING',
      },
      select: { id: true, status: true, createdAt: true },
    })

    res.status(201).json({ data: submission })
  }),
)
