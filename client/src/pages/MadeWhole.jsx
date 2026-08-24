import { useSearchParams } from 'react-router-dom'
import { getStories } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import { STORY_TYPE_FILTERS } from '../lib/storyTypes.js'
import FilterPills from '../components/FilterPills.jsx'
import StoryCard from '../components/StoryCard.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/StatusMessage.jsx'
import './MadeWhole.css'

function MadeWhole() {
  const [searchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') ?? ''
  const isKnownFilter = STORY_TYPE_FILTERS.some((filter) => filter.value === typeFilter)

  const { status, data, error, retry } = useAsync(
    () => getStories(isKnownFilter && typeFilter ? { type: typeFilter } : {}),
    [isKnownFilter, typeFilter],
  )

  const stories = data?.data ?? []
  const activeLabel = STORY_TYPE_FILTERS.find((filter) => filter.value === typeFilter)?.label

  return (
    <section className="made-whole">
      <header className="made-whole__intro">
        <h1>Made Whole</h1>
        <p className="made-whole__tagline">
          A collection of human stories stitched together by making.
        </p>
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
        </div>
      )}
    </section>
  );
}

export default MadeWhole
