import { Router } from 'express'
import { prisma } from '../db.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { uniqueSlug } from '../lib/slugify.js'
import { isNonEmptyString } from '../lib/validation.js'
import { storyDetailSelect } from '../lib/selects.js'

/**
 * Journal entries are Arianne's own writing (Story rows with type:
 * JOURNAL) — unlike Made Whole stories, there's no public submission to
 * review, so this writes directly to Story rather than going through the
 * submission -> publish pipeline adminStorySubmissions.js uses.
 */
export const adminJournalRouter = Router()

const STATUS_VALUES = ['DRAFT', 'PUBLISHED']

function validateBody(body) {
  const errors = {}

  const title = isNonEmptyString(body.title) ? body.title.trim() : ''
  const content = isNonEmptyString(body.content) ? body.content.trim() : ''
  if (!title) errors.title = 'Title is required.'
  if (!content) errors.content = 'Content is required.'

  const excerpt = isNonEmptyString(body.excerpt) ? body.excerpt.trim() : null
  const featuredImage = isNonEmptyString(body.featuredImage) ? body.featuredImage.trim() : null
  const author = isNonEmptyString(body.author) ? body.author.trim() : 'Arianne'

  let status = 'PUBLISHED'
  if (body.status !== undefined) {
    const normalized = String(body.status).toUpperCase()
    if (!STATUS_VALUES.includes(normalized)) {
      errors.status = `Invalid status. Expected one of: ${STATUS_VALUES.join(', ')}`
    } else {
      status = normalized
    }
  }

  return { errors, title, content, excerpt, featuredImage, author, status }
}

adminJournalRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const entries = await prisma.story.findMany({
      where: { type: 'JOURNAL' },
      select: storyDetailSelect,
      orderBy: { createdAt: 'desc' },
    })

    res.json({ data: entries })
  }),
)

adminJournalRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const entry = await prisma.story.findFirst({
      where: { id: req.params.id, type: 'JOURNAL' },
      select: storyDetailSelect,
    })

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' })
    }

    res.json({ data: entry })
  }),
)

adminJournalRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = req.body ?? {}
    const { errors, title, content, excerpt, featuredImage, author, status } = validateBody(body)

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Please fix the errors below and try again.',
        fieldErrors: errors,
      })
    }

    const slug = await uniqueSlug(body.slug || title, async (candidate) => {
      const found = await prisma.story.findUnique({ where: { slug: candidate }, select: { id: true } })
      return Boolean(found)
    })

    const entry = await prisma.story.create({
      data: {
        title,
        slug,
        type: 'JOURNAL',
        excerpt,
        content,
        featuredImage,
        author,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
      select: storyDetailSelect,
    })

    res.status(201).json({ data: entry })
  }),
)

adminJournalRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await prisma.story.findFirst({ where: { id: req.params.id, type: 'JOURNAL' } })
    if (!existing) {
      return res.status(404).json({ error: 'Journal entry not found' })
    }

    const body = req.body ?? {}
    const { errors, title, content, excerpt, featuredImage, author, status } = validateBody(body)

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Please fix the errors below and try again.',
        fieldErrors: errors,
      })
    }

    const data = { title, content, excerpt, featuredImage, author, status }

    // Set publishedAt the first time an entry goes live; leave it alone
    // on later edits so it keeps reading as the original publish date,
    // and clear it if moved back to draft.
    if (status === 'PUBLISHED' && !existing.publishedAt) {
      data.publishedAt = new Date()
    } else if (status === 'DRAFT') {
      data.publishedAt = null
    }

    const updated = await prisma.story.update({
      where: { id: req.params.id },
      data,
      select: storyDetailSelect,
    })

    res.json({ data: updated })
  }),
)

adminJournalRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await prisma.story.findFirst({ where: { id: req.params.id, type: 'JOURNAL' } })
    if (!existing) {
      return res.status(404).json({ error: 'Journal entry not found' })
    }

    await prisma.story.delete({ where: { id: req.params.id } })

    res.status(204).end()
  }),
)
