// Shared Prisma `select` shapes so list/detail endpoints return consistent,
// intentionally-scoped fields (e.g. never leaking submitter emails, review
// notes, etc. through the public content endpoints).

export const MAKER_PUBLIC_STATUSES = ['APPROVED', 'FEATURED']

export const categoryRefSelect = {
  id: true,
  name: true,
  slug: true,
}

export const makerRefSelect = {
  id: true,
  name: true,
  slug: true,
  location: true,
  photo: true,
  status: true,
}

export const storyCardSelect = {
  id: true,
  title: true,
  slug: true,
  type: true,
  excerpt: true,
  featuredImage: true,
  author: true,
  publishedAt: true,
  isDevelopmentContent: true,
  maker: { select: makerRefSelect },
  categories: { select: categoryRefSelect },
}

export const storyDetailSelect = {
  ...storyCardSelect,
  content: true,
  createdAt: true,
  updatedAt: true,
}

export const makerCardSelect = {
  id: true,
  name: true,
  slug: true,
  location: true,
  photo: true,
  bio: true,
  website: true,
  status: true,
  isDevelopmentContent: true,
  categories: { select: categoryRefSelect },
}

export const makerDetailSelect = {
  ...makerCardSelect,
  socialLinks: true,
  workshopInfo: true,
  createdAt: true,
  updatedAt: true,
  stories: {
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    select: storyCardSelect,
  },
}

export const gatheringSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  location: true,
  startsAt: true,
  endsAt: true,
  isDevelopmentContent: true,
}
