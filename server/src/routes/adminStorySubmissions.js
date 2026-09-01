import { Router } from 'express'
import { prisma } from '../db.js'
import { StoryType, SubmissionStatus } from '../generated/prisma/client.ts'
import { asyncHandler } from '../lib/asyncHandler.js'
import { uniqueSlug } from '../lib/slugify.js'
import { isNonEmptyString } from '../lib/validation.js'
import { storyDetailSelect } from '../lib/selects.js'

export const adminStorySubmissionsRouter = Router()

const SUBMISSION_STATUS_VALUES = Object.values(SubmissionStatus)
const STORY_TYPE_VALUES = Object.values(StoryType)

const submissionWithPublishedStorySelect = {
  publishedStory: { select: { id: true, slug: true, title: true, status: true } },
}

adminStorySubmissionsRouter.get(
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

    const submissions = await prisma.storySubmission.findMany({
      where,
      include: submissionWithPublishedStorySelect,
      orderBy: { createdAt: 'desc' },
    })

    res.json({ data: submissions })
  }),
)

adminStorySubmissionsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const submission = await prisma.storySubmission.findUnique({
      where: { id: req.params.id },
      include: submissionWithPublishedStorySelect,
    })

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    res.json({ data: submission })
  }),
)

adminStorySubmissionsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await prisma.storySubmission.findUnique({ where: { id: req.params.id } })
    if (!existing) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    if (existing.publishedStoryId) {
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

    const updated = await prisma.storySubmission.update({
      where: { id: req.params.id },
      data,
      include: submissionWithPublishedStorySelect,
    })

    res.json({ data: updated })
  }),
)

adminStorySubmissionsRouter.post(
  '/:id/publish',
  asyncHandler(async (req, res) => {
    const submission = await prisma.storySubmission.findUnique({ where: { id: req.params.id } })
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    // Idempotent: publishing an already-published submission just returns
    // the story that already exists, rather than erroring or creating a
    // second one.
    if (submission.publishedStoryId) {
      const story = await prisma.story.findUnique({
        where: { id: submission.publishedStoryId },
        select: storyDetailSelect,
      })
      return res.status(200).json({ data: story, alreadyPublished: true })
    }

    if (submission.status !== 'APPROVED') {
      return res.status(409).json({
        error: 'Only approved submissions can be published. Approve this submission first.',
      })
    }

    const body = req.body ?? {}
    const errors = {}

    const title = isNonEmptyString(body.title) ? body.title.trim() : ''
    const content = isNonEmptyString(body.content) ? body.content.trim() : ''
    const type = isNonEmptyString(body.type) ? body.type.trim().toUpperCase() : ''

    if (!title) errors.title = 'Title is required.'
    if (!content) errors.content = 'Content is required.'
    if (!type) errors.type = 'Story type is required.'
    else if (!STORY_TYPE_VALUES.includes(type)) {
      errors.type = `Invalid type. Expected one of: ${STORY_TYPE_VALUES.join(', ')}`
    }

    const excerpt = isNonEmptyString(body.excerpt) ? body.excerpt.trim() : null
    const author = isNonEmptyString(body.author) ? body.author.trim() : submission.name
    const featuredImage = isNonEmptyString(body.featuredImage) ? body.featuredImage.trim() : null

    let categoryIds = []
    if (body.categoryIds !== undefined) {
      if (!Array.isArray(body.categoryIds) || body.categoryIds.some((id) => typeof id !== 'string')) {
        errors.categoryIds = 'categoryIds must be an array of category IDs.'
      } else {
        categoryIds = body.categoryIds
      }
    }

    let makerId = null
    if (isNonEmptyString(body.makerId)) {
      makerId = body.makerId.trim()
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Please fix the errors below and try again.', fieldErrors: errors })
    }

    const slug = await uniqueSlug(body.slug || title, async (candidate) => {
      const found = await prisma.story.findUnique({ where: { slug: candidate }, select: { id: true } })
      return Boolean(found)
    })

    // Interactive transaction: the new story's id isn't known until after
    // create, so the submission link-back has to be a second statement —
    // but both run in the same DB transaction, so either both succeed or
    // neither does (no orphaned Story with no submission pointing at it).
    const story = await prisma.$transaction(async (tx) => {
      const created = await tx.story.create({
        data: {
          title,
          slug,
          type,
          excerpt,
          content,
          featuredImage,
          author,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          maker: makerId ? { connect: { id: makerId } } : undefined,
          categories: categoryIds.length ? { connect: categoryIds.map((id) => ({ id })) } : undefined,
        },
        select: storyDetailSelect,
      })

      await tx.storySubmission.update({
        where: { id: submission.id },
        data: { publishedStoryId: created.id, reviewedAt: new Date() },
      })

      return created
    })

    res.status(201).json({ data: story })
  }),
)
