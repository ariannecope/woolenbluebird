import { Router } from 'express'
import { prisma } from '../db.js'
import { MakerStatus, SubmissionStatus } from '../generated/prisma/client.ts'
import { asyncHandler } from '../lib/asyncHandler.js'
import { uniqueSlug } from '../lib/slugify.js'
import { isNonEmptyString, validateOptionalUrl, validateSocialLinks } from '../lib/validation.js'
import { makerDetailSelect } from '../lib/selects.js'

export const adminMakerSubmissionsRouter = Router()

const SUBMISSION_STATUS_VALUES = Object.values(SubmissionStatus)
const PUBLISHABLE_MAKER_STATUSES = [MakerStatus.APPROVED, MakerStatus.FEATURED]

const submissionWithConvertedMakerSelect = {
  convertedToMaker: { select: { id: true, slug: true, name: true, status: true } },
}

adminMakerSubmissionsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status } = req.query
    const where = {}

    if (status === undefined) {
      where.status = 'PENDING'
    } else if (String(status).toUpperCase() !== 'ALL') {
      const normalized = String(status).toUpperCase()
      if (!SUBMISSION_STATUS_VALUES.includes(normalized)) {
        return res.status(400).json({
          error: `Invalid status "${status}". Expected one of: ALL, ${SUBMISSION_STATUS_VALUES.join(', ')}`,
        })
      }
      where.status = normalized
    }

    const submissions = await prisma.makerSubmission.findMany({
      where,
      include: submissionWithConvertedMakerSelect,
      orderBy: { createdAt: 'desc' },
    })

    res.json({ data: submissions })
  }),
)

adminMakerSubmissionsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const submission = await prisma.makerSubmission.findUnique({
      where: { id: req.params.id },
      include: submissionWithConvertedMakerSelect,
    })

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    res.json({ data: submission })
  }),
)

adminMakerSubmissionsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await prisma.makerSubmission.findUnique({ where: { id: req.params.id } })
    if (!existing) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    if (existing.convertedToMakerId) {
      return res.status(409).json({
        error: 'This submission has already been published and can no longer be modified.',
      })
    }

    const { status, reviewNotes } = req.body ?? {}
    const data = { reviewedAt: new Date() }

    if (status !== undefined) {
      const normalized = String(status).toUpperCase()
      if (!SUBMISSION_STATUS_VALUES.includes(normalized)) {
        return res.status(400).json({
          error: `Invalid status "${status}". Expected one of: ${SUBMISSION_STATUS_VALUES.join(', ')}`,
        })
      }
      data.status = normalized
    }

    if (reviewNotes !== undefined) {
      if (reviewNotes !== null && typeof reviewNotes !== 'string') {
        return res.status(400).json({ error: 'reviewNotes must be a string.' })
      }
      data.reviewNotes = reviewNotes
    }

    const updated = await prisma.makerSubmission.update({
      where: { id: req.params.id },
      data,
      include: submissionWithConvertedMakerSelect,
    })

    res.json({ data: updated })
  }),
)

adminMakerSubmissionsRouter.post(
  '/:id/publish',
  asyncHandler(async (req, res) => {
    const submission = await prisma.makerSubmission.findUnique({ where: { id: req.params.id } })
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    // Idempotent: publishing an already-published submission just returns
    // the maker that already exists, rather than erroring or creating a
    // second one.
    if (submission.convertedToMakerId) {
      const maker = await prisma.maker.findUnique({
        where: { id: submission.convertedToMakerId },
        select: makerDetailSelect,
      })
      return res.status(200).json({ data: maker, alreadyPublished: true })
    }

    if (submission.status !== 'APPROVED') {
      return res.status(409).json({
        error: 'Only approved submissions can be published. Approve this submission first.',
      })
    }

    const body = req.body ?? {}
    const errors = {}

    const name = isNonEmptyString(body.name) ? body.name.trim() : ''
    const bio = isNonEmptyString(body.bio) ? body.bio.trim() : ''

    if (!name) errors.name = 'Name is required.'
    if (!bio) errors.bio = 'Bio is required.'

    const makerStatus = isNonEmptyString(body.status) ? body.status.trim().toUpperCase() : 'APPROVED'
    if (!PUBLISHABLE_MAKER_STATUSES.includes(makerStatus)) {
      errors.status = `Invalid status. Expected one of: ${PUBLISHABLE_MAKER_STATUSES.join(', ')}`
    }

    const location = isNonEmptyString(body.location) ? body.location.trim() : null
    const photo = isNonEmptyString(body.photo) ? body.photo.trim() : null
    const workshopInfo = isNonEmptyString(body.workshopInfo) ? body.workshopInfo.trim() : null

    const website = validateOptionalUrl(body.website)
    if (website.error) errors.website = website.error

    const socialLinks = validateSocialLinks(body.socialLinks)
    if (socialLinks.error) errors.socialLinks = socialLinks.error

    let categoryIds = []
    if (body.categoryIds !== undefined) {
      if (!Array.isArray(body.categoryIds) || body.categoryIds.some((id) => typeof id !== 'string')) {
        errors.categoryIds = 'categoryIds must be an array of category IDs.'
      } else {
        categoryIds = body.categoryIds
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Please fix the errors below and try again.', fieldErrors: errors })
    }

    const slug = await uniqueSlug(body.slug || name, async (candidate) => {
      const found = await prisma.maker.findUnique({ where: { slug: candidate }, select: { id: true } })
      return Boolean(found)
    })

    // Interactive transaction: same reasoning as the story-publish route —
    // the new maker's id is only known after create, so the submission
    // link-back is a second statement inside the same DB transaction.
    const maker = await prisma.$transaction(async (tx) => {
      const created = await tx.maker.create({
        data: {
          name,
          slug,
          bio,
          location,
          photo,
          website: website.value,
          socialLinks: socialLinks.value ?? undefined,
          workshopInfo,
          status: makerStatus,
          categories: categoryIds.length ? { connect: categoryIds.map((id) => ({ id })) } : undefined,
        },
        select: makerDetailSelect,
      })

      await tx.makerSubmission.update({
        where: { id: submission.id },
        data: { convertedToMakerId: created.id, reviewedAt: new Date() },
      })

      return created
    })

    res.status(201).json({ data: maker })
  }),
)
