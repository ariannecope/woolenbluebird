import { Link, useSearchParams } from 'react-router-dom'
import { getStories } from '../lib/api.js'
import { usePaginatedList } from '../hooks/usePaginatedList.js'
import { STORY_TYPE_FILTERS } from '../lib/storyTypes.js'
import FilterPills from '../components/FilterPills.jsx'
import StoryCard from '../components/StoryCard.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/StatusMessage.jsx'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js'
import bluebirdDrawing from './images/bluebirdthree.png'
import './MadeWhole.css'

function MadeWhole() {
  const [birdRef, birdRevealed] = useRevealOnScroll()
  const [searchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') ?? ''
  const isKnownFilter = STORY_TYPE_FILTERS.some((filter) => filter.value === typeFilter)

  const { status, items: stories, error, hasMore, loadMore, loadingMore, retry } = usePaginatedList(
    (offset, limit) =>
      getStories({ ...(isKnownFilter && typeFilter ? { type: typeFilter } : {}), offset, limit }),
    [isKnownFilter, typeFilter],
  )

  const activeLabel = STORY_TYPE_FILTERS.find((filter) => filter.value === typeFilter)?.label

  return (
    <section className="made-whole">
      <header className="made-whole__intro">
        <img
          ref={birdRef}
          src={bluebirdDrawing}
          alt=""
          className={`made-whole__bird bird-landing${birdRevealed ? ' bird-landing--in' : ''}`}
        />
        <div className="made-whole__intro-text">
          <h1 className="page-heading-fade-in">Made Whole</h1>
          <p className="made-whole__tagline">
            A collection of human stories stitched together by making.
          </p>
          <p className="made-whole__cta">
            <Link to="/submit-story" className="button button--primary">
              Share Your Story
            </Link>
          </p>
        </div>
      </header>

      <FilterPills
        ariaLabel="Filter stories by type"
        filters={STORY_TYPE_FILTERS}
        activeValue={typeFilter}
        basePath="/made-whole"
        paramName="type"
      />

      {status === "loading" && <LoadingState label="Loading stories…" />}

      {status === "error" && (
        <ErrorState
          title="We couldn't load these stories"
          message={error.message}
          onRetry={retry}
        />
      )}

      {status === "success" && stories.length === 0 && (
        <EmptyState
          title={
            activeLabel
              ? `No ${activeLabel.toLowerCase()} yet`
              : "No stories yet"
          }
          message="Every good collection starts with one thread. Check back soon — we're just getting started."
        />
      )}

      {status === "success" && stories.length > 0 && (
        <div className="made-whole__quilt">
          <div className="made-whole__grid">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {hasMore && (
            <p className="made-whole__load-more">
              <button
                type="button"
                className="button button--secondary"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading…' : 'See More Stories'}
              </button>
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default MadeWhole
