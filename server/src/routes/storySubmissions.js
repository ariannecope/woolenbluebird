import { Router } from 'express'
import { prisma } from '../db.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { isNonEmptyString, isValidEmail, validateOptionalUrl, validateSocialLinks } from '../lib/validation.js'

export const storySubmissionsRouter = Router()

const MAX_LENGTHS = {
  name: 200,
  email: 320,
  title: 300,
  story: 20000,
  craftCategory: 500,
}

storySubmissionsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = req.body ?? {}
    const errors = {}

    const name = isNonEmptyString(body.name) ? body.name.trim() : ''
    const email = isNonEmptyString(body.email) ? body.email.trim() : ''
    const title = isNonEmptyString(body.title) ? body.title.trim() : ''
    const story = isNonEmptyString(body.story) ? body.story.trim() : ''

    if (!name) errors.name = 'Please enter your name.'
    else if (name.length > MAX_LENGTHS.name) errors.name = 'Name is too long.'

    if (!email) errors.email = 'Please enter your email address.'
    else if (!isValidEmail(email)) errors.email = 'Please enter a valid email address.'
    else if (email.length > MAX_LENGTHS.email) errors.email = 'Email is too long.'

    if (!title) errors.title = 'Please enter a title for your story.'
    else if (title.length > MAX_LENGTHS.title) errors.title = 'Title is too long.'

    if (!story) errors.story = 'Please share your story.'
    else if (story.length > MAX_LENGTHS.story) errors.story = 'Story is too long.'

    let craftCategory = null
    if (body.craftCategory !== undefined && body.craftCategory !== null && body.craftCategory !== '') {
      if (typeof body.craftCategory !== 'string' || body.craftCategory.length > MAX_LENGTHS.craftCategory) {
        errors.craftCategory = 'Craft category selection is invalid.'
      } else {
        craftCategory = body.craftCategory.trim()
      }
    }

    const website = validateOptionalUrl(body.website)
    if (website.error) errors.website = website.error

    const socialLinks = validateSocialLinks(body.socialLinks)
    if (socialLinks.error) errors.socialLinks = socialLinks.error

    const permissionToContact = body.permissionToContact === true
    const publicationPermission = body.publicationPermission === true

    // permissionToContact is optional; publicationPermission is required —
    // a submission cannot be accepted without explicit publish consent.
    if (!publicationPermission) {
      errors.publicationPermission =
        'Please check the publication permission box to submit your story.'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Please fix the errors below and try again.',
        fieldErrors: errors,
      })
    }

    const submission = await prisma.storySubmission.create({
      data: {
        name,
        email,
        title,
        story,
        craftCategory,
        website: website.value,
        socialLinks: socialLinks.value ?? undefined,
        permissionToContact,
        publicationPermission,
        status: 'PENDING',
      },
      select: { id: true, status: true, createdAt: true },
    })

    res.status(201).json({ data: submission })
  }),
)
