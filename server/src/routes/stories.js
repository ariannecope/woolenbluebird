import { Router } from 'express'
import { prisma } from '../db.js'
import { StoryType } from '../generated/prisma/client.ts'
import { asyncHandler } from '../lib/asyncHandler.js'
import { parsePagination } from '../lib/pagination.js'
import { storyCardSelect, storyDetailSelect } from '../lib/selects.js'

export const storiesRouter = Router()

const STORY_TYPE_VALUES = Object.values(StoryType)

storiesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { type, category, maker } = req.query
    const { limit, offset } = parsePagination(req.query)

    const where = { status: 'PUBLISHED' }

    if (type !== undefined) {
      const normalizedType = String(type).toUpperCase()
      if (!STORY_TYPE_VALUES.includes(normalizedType)) {
        return res.status(400).json({
          error: `Invalid type "${type}". Expected one of: ${STORY_TYPE_VALUES.join(', ')}`,
        })
      }
      where.type = normalizedType
    }

    if (category !== undefined) {
      where.categories = { some: { slug: String(category) } }
    }

    if (maker !== undefined) {
      where.maker = { slug: String(maker) }
    }

    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where,
        select: storyCardSelect,
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.story.count({ where }),
    ])

    res.json({ data: stories, meta: { total, limit, offset } })
  }),
)

storiesRouter.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const story = await prisma.story.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      select: storyDetailSelect,
    })

    if (!story) {
      return res.status(404).json({ error: 'Story not found' })
    }

    const categorySlugs = story.categories.map((c) => c.slug)
    const relatedConditions = [
      story.maker ? { maker: { slug: story.maker.slug } } : undefined,
      categorySlugs.length ? { categories: { some: { slug: { in: categorySlugs } } } } : undefined,
    ].filter(Boolean)

    const relatedStories = relatedConditions.length
      ? await prisma.story.findMany({
          where: {
            status: 'PUBLISHED',
            slug: { not: story.slug },
            OR: relatedConditions,
          },
          select: storyCardSelect,
          orderBy: { publishedAt: 'desc' },
          take: 3,
        })
      : []

    res.json({ ...story, relatedStories })
  }),
)
