import { Router } from 'express'
import { prisma } from '../db.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { parsePagination } from '../lib/pagination.js'
import { MAKER_PUBLIC_STATUSES, makerCardSelect, makerDetailSelect } from '../lib/selects.js'

export const makersRouter = Router()

makersRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, location } = req.query
    const { limit, offset } = parsePagination(req.query)

    const where = { status: { in: MAKER_PUBLIC_STATUSES } }

    if (category !== undefined) {
      where.categories = { some: { slug: String(category) } }
    }

    if (location !== undefined) {
      where.location = { contains: String(location), mode: 'insensitive' }
    }

    const [makers, total] = await Promise.all([
      prisma.maker.findMany({
        where,
        select: makerCardSelect,
        orderBy: { name: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.maker.count({ where }),
    ])

    res.json({ data: makers, meta: { total, limit, offset } })
  }),
)

makersRouter.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const maker = await prisma.maker.findFirst({
      where: { slug: req.params.slug, status: { in: MAKER_PUBLIC_STATUSES } },
      select: makerDetailSelect,
    })

    if (!maker) {
      return res.status(404).json({ error: 'Maker not found' })
    }

    res.json(maker)
  }),
)
