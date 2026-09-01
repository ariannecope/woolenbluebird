import { getStories } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import StoryCard from '../components/StoryCard.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/StatusMessage.jsx'
import './Journal.css'

function Journal() {
  const { status, data, error, retry } = useAsync(() => getStories({ type: 'journal' }), [])
  const entries = data?.data ?? []

  return (
    <section className="journal">
      <header className="journal__intro">
        <h1>Journal</h1>
        <p className="journal__tagline">
          Arianne's personal writing space — reflections, essays, and notes on building Woolen
          Bluebird. Where Made Whole tells the wider community's stories, this is one voice,
          written as it happens.
        </p>
      </header>

      {status === 'loading' && <LoadingState label="Loading journal entries…" />}

      {status === 'error' && (
        <ErrorState
          title="We couldn't load the journal"
          message={error.message}
          onRetry={retry}
        />
      )}

      {status === 'success' && entries.length === 0 && (
        <EmptyState
          title="Nothing here yet"
          message="The first journal entry hasn't been written yet. Check back soon."
        />
      )}

      {status === 'success' && entries.length > 0 && (
        <div className="card-grid">
          {entries.map((entry) => (
            <StoryCard key={entry.id} story={entry} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Journal
