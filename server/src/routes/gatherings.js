import { Router } from 'express'
import { prisma } from '../db.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { gatheringSelect } from '../lib/selects.js'

export const gatheringsRouter = Router()

gatheringsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const gatherings = await prisma.gathering.findMany({
      where: { isPublished: true },
      select: gatheringSelect,
      orderBy: [{ startsAt: { sort: 'asc', nulls: 'last' } }],
    })

    res.json({ data: gatherings })
  }),
)
