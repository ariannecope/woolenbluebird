import { Link } from 'react-router-dom'
import { STORY_TYPE_LABELS } from '../lib/storyTypes.js'
import './StoryCard.css'

const QUILT_VARIANTS = ['quilt-a', 'quilt-b', 'quilt-c', 'quilt-d']

/**
 * Assigns each story a stable "quilt square" variant based on its slug, so
 * the same story always renders the same way (no reshuffling on refetch or
 * re-render) regardless of where it appears or how the list is filtered.
 */
function getQuiltVariant(key) {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return QUILT_VARIANTS[hash % QUILT_VARIANTS.length]
}

function formatDate(isoDate) {
  if (!isoDate) return null
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function StoryCard({ story }) {
  const href = story.type === 'JOURNAL' ? `/journal/${story.slug}` : `/made-whole/${story.slug}`
  const publishedLabel = formatDate(story.publishedAt)
  const byline = story.maker?.name ?? story.author
  const variant = getQuiltVariant(story.slug ?? story.id)

  return (
    <article className={`story-card ${variant}`}>
      <div className="story-card__panel">
        <Link to={href} className="story-card__image-link" tabIndex={-1} aria-hidden="true">
          {story.featuredImage ? (
            <img src={story.featuredImage} alt="" className="story-card__image" />
          ) : (
            <div className="story-card__image story-card__image--placeholder" />
          )}
        </Link>

        <div className="story-card__body">
          <p className="story-card__meta">
            <span className="story-card__type">{STORY_TYPE_LABELS[story.type] ?? story.type}</span>
            {publishedLabel && <span className="story-card__date">{publishedLabel}</span>}
          </p>

          {story.isDevelopmentContent && (
            <span className="placeholder-badge">Development placeholder</span>
          )}

          <h3 className="story-card__title">
            <Link to={href}>{story.title}</Link>
          </h3>

          {byline && <p className="story-card__byline">{byline}</p>}

          {story.excerpt && <p className="story-card__excerpt">{story.excerpt}</p>}
        </div>
      </div>
    </article>
  )
}

export default StoryCard
