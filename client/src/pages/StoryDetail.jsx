import { Link, useParams } from 'react-router-dom'
import { getStoryBySlug } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import { STORY_TYPE_LABELS } from '../lib/storyTypes.js'
import StoryCard from '../components/StoryCard.jsx'
import { LoadingState, ErrorState } from '../components/StatusMessage.jsx'
import './StoryDetail.css'

function formatDate(isoDate) {
  if (!isoDate) return null
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function StoryDetail() {
  const { slug } = useParams()
  const { status, data: story, error, retry } = useAsync(() => getStoryBySlug(slug), [slug])

  if (status === 'loading') {
    return <LoadingState label="Loading story…" />
  }

  if (status === 'error') {
    const isNotFound = error.status === 404
    return (
      <ErrorState
        title={isNotFound ? 'Story not found' : "We couldn't load this story"}
        message={
          isNotFound
            ? "We couldn't find the story you were looking for. It may have moved, or hasn't been published yet."
            : error.message
        }
        onRetry={isNotFound ? undefined : retry}
      />
    )
  }

  const publishedLabel = formatDate(story.publishedAt)

  return (
    <article className="story-detail">
      <div className="story-detail__reading">
        <p className="story-detail__back">
          <Link to="/made-whole">← Back to Made Whole</Link>
        </p>

        <header className="story-detail__header">
          <p className="story-detail__meta">
            <span className="story-detail__type">
              {STORY_TYPE_LABELS[story.type] ?? story.type}
            </span>
            {publishedLabel && <span>{publishedLabel}</span>}
          </p>

          {story.isDevelopmentContent && (
            <p>
              <span className="placeholder-badge">
                Development placeholder — not a real community member
              </span>
            </p>
          )}

          <h1>{story.title}</h1>

          {story.excerpt && <p className="story-detail__excerpt">{story.excerpt}</p>}

          {(story.author || story.maker) && (
            <p className="story-detail__byline">
              {story.author && <>By {story.author}</>}
              {story.maker && (
                <>
                  {story.author ? ' · ' : 'Featuring '}
                  <Link to={`/makers/${story.maker.slug}`}>
                    <strong>{story.maker.name}</strong>
                  </Link>
                  {story.maker.location && ` (${story.maker.location})`}
                </>
              )}
            </p>
          )}
        </header>

        {story.featuredImage && (
          <img src={story.featuredImage} alt="" className="story-detail__image" />
        )}

        <div className="story-detail__content">
          {story.content.split('\n\n').map((paragraph, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {story.relatedStories?.length > 0 && (
        <section className="story-detail__related" aria-labelledby="related-stories-heading">
          <h2 id="related-stories-heading">Related Stories</h2>
          <div className="card-grid">
            {story.relatedStories.map((related) => (
              <StoryCard key={related.id} story={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export default StoryDetail
