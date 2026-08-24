import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { prisma } from './db.js'
import { storiesRouter } from './routes/stories.js'
import { makersRouter } from './routes/makers.js'
import { categoriesRouter } from './routes/categories.js'
import { gatheringsRouter } from './routes/gatherings.js'
import { storySubmissionsRouter } from './routes/storySubmissions.js'
import { makerSubmissionsRouter } from './routes/makerSubmissions.js'

const app = express()
const port = process.env.PORT || 4000
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: clientOrigin }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok' })
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Database unreachable' })
  }
})

app.use('/api/stories', storiesRouter)
app.use('/api/makers', makersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/gatherings', gatheringsRouter)
app.use('/api/story-submissions', storySubmissionsRouter)
app.use('/api/maker-submissions', makerSubmissionsRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Woolen Bluebird API listening on http://localhost:${port}`)
})
