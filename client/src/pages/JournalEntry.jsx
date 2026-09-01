import { Link, useParams } from 'react-router-dom'
import { getStoryBySlug, getStories } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
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

/**
 * Reuses the same reading layout as StoryDetail (imports StoryDetail.css
 * directly) since both are long-form single-piece reading views — the
 * distinction between Made Whole and Journal is about content and
 * navigation (where "back" goes, what's suggested next), not a different
 * visual treatment.
 */
function JournalEntry() {
  const { slug } = useParams()
  const { status, data: entry, error, retry } = useAsync(() => getStoryBySlug(slug), [slug])

  const { data: recentData } = useAsync(() => getStories({ type: 'journal', limit: 4 }), [slug])
  const moreEntries = (recentData?.data ?? []).filter((story) => story.slug !== slug).slice(0, 3)

  if (status === 'loading') {
    return <LoadingState label="Loading journal entry…" />
  }

  if (status === 'error') {
    const isNotFound = error.status === 404
    return (
      <ErrorState
        title={isNotFound ? 'Entry not found' : "We couldn't load this entry"}
        message={
          isNotFound
            ? "We couldn't find the journal entry you were looking for. It may have moved, or hasn't been published yet."
            : error.message
        }
        onRetry={isNotFound ? undefined : retry}
      />
    )
  }

  const publishedLabel = formatDate(entry.publishedAt)

  return (
    <article className="story-detail">
      <div className="story-detail__reading">
        <p className="story-detail__back">
          <Link to="/journal">← Back to Journal</Link>
        </p>

        <header className="story-detail__header">
          {publishedLabel && <p className="story-detail__meta">{publishedLabel}</p>}

          {entry.isDevelopmentContent && (
            <p>
              <span className="placeholder-badge">
                Development placeholder — not Arianne's real writing
              </span>
            </p>
          )}

          <h1>{entry.title}</h1>

          {entry.excerpt && <p className="story-detail__excerpt">{entry.excerpt}</p>}

          {entry.author && <p className="story-detail__byline">By {entry.author}</p>}
        </header>

        {entry.featuredImage && (
          <img src={entry.featuredImage} alt="" className="story-detail__image" />
        )}

        <div className="story-detail__content">
          {entry.content.split('\n\n').map((paragraph, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {moreEntries.length > 0 && (
        <section className="story-detail__related" aria-labelledby="more-journal-heading">
          <h2 id="more-journal-heading">More from the Journal</h2>
          <div className="card-grid">
            {moreEntries.map((related) => (
              <StoryCard key={related.id} story={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export default JournalEntry
