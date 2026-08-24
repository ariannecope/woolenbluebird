// Development seed data for Woolen Bluebird.
//
// This script is safe to re-run: every upsert's `update` branch mirrors its
// `create` branch (relations use `set`, not `connect`, on update) so editing
// a record here and re-running `npm run db:seed` actually applies the
// change to an existing database, instead of silently no-op'ing.
//
// It seeds:
//   - the real category taxonomy
//   - Woolen Bluebird's actual origin story (real launch content)
//   - clearly-labeled placeholder stories, makers, gatherings, and
//     submissions so the frontend/API have something to render during
//     development
//
// Every placeholder record has `isDevelopmentContent: true` and a title/name
// that says so out loud. None of it should be mistaken for a real person or
// real Woolen Bluebird community member — replace it as real content arrives.
import 'dotenv/config'
import { prisma } from '../src/db.js'

const CATEGORIES = [
  { name: 'Fiber Arts', slug: 'fiber-arts' },
  { name: 'Woodworking', slug: 'woodworking' },
  { name: 'Pottery & Ceramics', slug: 'pottery-ceramics' },
  { name: 'Gardening', slug: 'gardening' },
  { name: 'Cooking & Food', slug: 'cooking-food' },
  { name: 'Sewing', slug: 'sewing' },
  { name: 'Weaving', slug: 'weaving' },
  { name: 'Painting & Drawing', slug: 'painting-drawing' },
  { name: 'Leatherwork', slug: 'leatherwork' },
  { name: 'Metalwork', slug: 'metalwork' },
  { name: 'Repair & Mending', slug: 'repair-mending' },
  { name: 'Traditional Skills', slug: 'traditional-skills' },
  { name: 'Other', slug: 'other' },
]

async function seedCategories() {
  const bySlug = {}
  for (const category of CATEGORIES) {
    bySlug[category.slug] = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    })
  }
  return bySlug
}

function upsertStory(slug, data, { categoryIds = [], makerId } = {}) {
  const categories = { set: categoryIds.map((id) => ({ id })) }
  const maker = makerId ? { connect: { id: makerId } } : { disconnect: true }

  return prisma.story.upsert({
    where: { slug },
    update: { ...data, categories, maker },
    create: {
      slug,
      ...data,
      categories: { connect: categoryIds.map((id) => ({ id })) },
      ...(makerId ? { maker: { connect: { id: makerId } } } : {}),
    },
  })
}

function upsertMaker(slug, data, { categoryIds = [] } = {}) {
  const categories = { set: categoryIds.map((id) => ({ id })) }

  return prisma.maker.upsert({
    where: { slug },
    update: { ...data, categories },
    create: { slug, ...data, categories: { connect: categoryIds.map((id) => ({ id })) } },
  })
}

function upsertGathering(slug, data) {
  return prisma.gathering.upsert({
    where: { slug },
    update: data,
    create: { slug, ...data },
  })
}

async function seedOriginStory(categories) {
  await upsertStory(
    'how-woolen-bluebird-began',
    {
      title: 'How Woolen Bluebird Began',
      type: 'ESSAY',
      excerpt:
        'Making has been part of my healing journey, and I started wondering how many other people have found healing through creating.',
      content: `Woolen Bluebird was my story before it was anything else.

Making has been part of my healing journey, and somewhere along the way I started wondering how many other people have found healing through creating — through knitting, through fixing something that was broken, through growing food, through sitting down at a wheel or a workbench or a kitchen table and making something with their hands.

Making does not have to be productive, profitable, impressive, or perfect to matter. It can simply be a way of staying, of remembering, of finding your way back to yourself.

I started collecting these stories because I wanted to know I wasn't alone in that, and because I suspected other people needed to hear it too. One story became a collection of stories. I hope, over time, that collection becomes a community.

Woolen Bluebird was my story. Woolen Bluebird became a collection of stories. Woolen Bluebird became a community.

If making has ever helped you keep singing, we want to hear about it.`,
      author: 'Arianne',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-05T00:00:00.000Z'),
      isDevelopmentContent: false,
    },
    { categoryIds: [categories['other'].id] },
  )
}

async function seedMakers(categories) {
  const makers = {}

  makers.fiber = await upsertMaker(
    'dev-placeholder-fiber-maker',
    {
      name: '[DEV] Placeholder Fiber Artist',
      bio: 'Development placeholder content — this is not a real Woolen Bluebird community member. Replace with a real maker profile before launch.',
      location: 'Placeholder, OR',
      status: 'FEATURED',
      isDevelopmentContent: true,
      website: 'https://example.com/dev-placeholder-fiber-maker',
      socialLinks: { instagram: 'https://instagram.com/example', etsy: 'https://etsy.com/shop/example' },
      workshopInfo:
        'Development placeholder content for the "workshops/classes" profile field — not a real class listing.',
    },
    { categoryIds: [categories['fiber-arts'].id] },
  )

  makers.woodworker = await upsertMaker(
    'dev-placeholder-woodworker',
    {
      name: '[DEV] Placeholder Woodworker',
      bio: 'Development placeholder content — this is not a real Woolen Bluebird community member. Replace with a real maker profile before launch.',
      location: 'Placeholder, VT',
      status: 'APPROVED',
      isDevelopmentContent: true,
    },
    { categoryIds: [categories['woodworking'].id] },
  )

  makers.potter = await upsertMaker(
    'dev-placeholder-potter',
    {
      name: '[DEV] Placeholder Potter',
      bio: 'Development placeholder content — this is not a real Woolen Bluebird community member. Replace with a real maker profile before launch.',
      location: 'Placeholder, NC',
      status: 'APPROVED',
      isDevelopmentContent: true,
    },
    { categoryIds: [categories['pottery-ceramics'].id] },
  )

  makers.mender = await upsertMaker(
    'dev-placeholder-mender',
    {
      name: '[DEV] Placeholder Mending Teacher',
      bio: 'Development placeholder content — this is not a real Woolen Bluebird community member. Seeded with PENDING status to demonstrate an unapproved maker that should not appear in the public directory.',
      location: 'Placeholder, ME',
      status: 'PENDING',
      isDevelopmentContent: true,
    },
    { categoryIds: [categories['repair-mending'].id, categories['traditional-skills'].id] },
  )

  return makers
}

async function seedStories(categories, makers) {
  await upsertStory(
    'dev-placeholder-interview-fiber',
    {
      title: '[DEV] Placeholder Interview — Fiber Arts',
      type: 'INTERVIEW',
      excerpt: 'Development placeholder content for the Made Whole interview format. Not a real interview or real person.',
      content:
        'This is placeholder development content standing in for a Made Whole interview. It does not represent a real conversation or a real Woolen Bluebird community member. Replace before launch.',
      author: 'Arianne',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-01T00:00:00.000Z'),
      isDevelopmentContent: true,
    },
    { categoryIds: [categories['fiber-arts'].id], makerId: makers.fiber.id },
  )

  await upsertStory(
    'dev-placeholder-interview-woodworking',
    {
      title: '[DEV] Placeholder Interview — Woodworking',
      type: 'INTERVIEW',
      excerpt: 'Development placeholder content for the Made Whole interview format. Not a real interview or real person.',
      content:
        'This is placeholder development content standing in for a Made Whole interview. It does not represent a real conversation or a real Woolen Bluebird community member. Replace before launch.',
      author: 'Arianne',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-08T00:00:00.000Z'),
      isDevelopmentContent: true,
    },
    { categoryIds: [categories['woodworking'].id], makerId: makers.woodworker.id },
  )

  await upsertStory(
    'dev-placeholder-maker-profile-pottery',
    {
      title: '[DEV] Placeholder Maker Profile — Pottery',
      type: 'MAKER_PROFILE',
      excerpt: 'Development placeholder content for the Made Whole maker-profile format. Not a real profile of a real person.',
      content:
        'This is placeholder development content standing in for a Made Whole maker profile. It does not represent a real Woolen Bluebird community member. Replace before launch.',
      author: 'Arianne',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-15T00:00:00.000Z'),
      isDevelopmentContent: true,
    },
    { categoryIds: [categories['pottery-ceramics'].id], makerId: makers.potter.id },
  )

  await upsertStory(
    'dev-placeholder-podcast-episode',
    {
      title: '[DEV] Placeholder Podcast Episode',
      type: 'PODCAST',
      excerpt: 'Development placeholder content for the future Made Whole podcast format.',
      content:
        'This is placeholder development content standing in for a Made Whole podcast episode. No audio is attached yet. Replace before launch.',
      author: 'Arianne',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-20T00:00:00.000Z'),
      isDevelopmentContent: true,
    },
    { categoryIds: [categories['other'].id] },
  )

  await upsertStory(
    'dev-placeholder-unpublished-essay',
    {
      title: '[DEV] Placeholder Draft Essay (Unpublished)',
      type: 'ESSAY',
      excerpt: 'Development placeholder content seeded as a DRAFT to verify unpublished stories stay out of the public API.',
      content:
        'This draft-status story exists only to confirm that draft/pending/archived content is excluded from public API responses.',
      author: 'Arianne',
      status: 'DRAFT',
      isDevelopmentContent: true,
    },
    { categoryIds: [categories['other'].id] },
  )

  await upsertStory(
    'dev-placeholder-journal-entry-one',
    {
      title: '[DEV] Placeholder Journal Entry One',
      type: 'JOURNAL',
      excerpt: 'Development placeholder content for the Journal page. Does not represent Arianne’s real writing.',
      content:
        'This is placeholder development content standing in for a Journal entry so the Journal page has something to render. It does not represent Arianne’s real writing or reflections. Replace before launch.',
      author: 'Arianne',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-20T00:00:00.000Z'),
      isDevelopmentContent: true,
    },
  )

  await upsertStory(
    'dev-placeholder-journal-entry-two',
    {
      title: '[DEV] Placeholder Journal Entry Two',
      type: 'JOURNAL',
      excerpt: 'Development placeholder content for the Journal page. Does not represent Arianne’s real writing.',
      content:
        'This is placeholder development content standing in for a second Journal entry so pagination/listing can be tested. It does not represent Arianne’s real writing or reflections. Replace before launch.',
      author: 'Arianne',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-10T00:00:00.000Z'),
      isDevelopmentContent: true,
    },
  )
}

async function seedGatherings() {
  await upsertGathering('dev-placeholder-mending-night', {
    title: '[DEV] Placeholder Mending Night',
    description:
      'Development placeholder content for a future Woolen Bluebird gathering. No real event is scheduled yet.',
    location: 'Placeholder Location',
    startsAt: new Date('2026-09-15T23:00:00.000Z'),
    endsAt: new Date('2026-09-16T01:30:00.000Z'),
    isPublished: true,
    isDevelopmentContent: true,
  })

  await upsertGathering('dev-placeholder-unpublished-gathering', {
    title: '[DEV] Placeholder Unpublished Gathering',
    description:
      'Development placeholder content seeded as unpublished to verify the public API excludes it.',
    location: 'Placeholder Location',
    startsAt: new Date('2026-10-01T18:00:00.000Z'),
    isPublished: false,
    isDevelopmentContent: true,
  })
}

async function seedSubmissions() {
  const storySubmission = {
    name: '[DEV] Test Submitter',
    email: 'dev-test-submitter@example.com',
    title: '[DEV] Placeholder Pending Story Submission',
    story:
      'This is a development seed record used to exercise the pending-submission review queue. It is not a real submission from a real person.',
    craftCategory: 'Fiber Arts',
    permissionToContact: true,
    publicationPermission: true,
    status: 'PENDING',
  }
  await prisma.storySubmission.upsert({
    where: { id: 'dev-seed-story-submission-pending' },
    update: storySubmission,
    create: { id: 'dev-seed-story-submission-pending', ...storySubmission },
  })

  const makerSubmission = {
    makerName: '[DEV] Test Nominated Maker',
    submitterName: '[DEV] Test Submitter',
    submitterEmail: 'dev-test-submitter@example.com',
    description:
      'This is a development seed record used to exercise the pending-submission review queue. It is not a real maker nomination.',
    craftCategory: 'Woodworking',
    recommendationReason: 'Seeded for development/testing only.',
    permissionToContact: true,
    status: 'PENDING',
  }
  await prisma.makerSubmission.upsert({
    where: { id: 'dev-seed-maker-submission-pending' },
    update: makerSubmission,
    create: { id: 'dev-seed-maker-submission-pending', ...makerSubmission },
  })
}

async function main() {
  const categories = await seedCategories()
  await seedOriginStory(categories)
  const makers = await seedMakers(categories)
  await seedStories(categories, makers)
  await seedGatherings()
  await seedSubmissions()
}

main()
  .then(async () => {
    console.log('Seed complete.')
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
