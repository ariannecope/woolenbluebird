import { Router } from 'express'
import { prisma } from '../db.js'
import { asyncHandler } from '../lib/asyncHandler.js'

export const categoriesRouter = Router()

categoriesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, description: true },
    })

    res.json({ data: categories })
  }),
)
