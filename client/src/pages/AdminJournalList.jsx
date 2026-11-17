import { Link } from 'react-router-dom'
import { getJournalEntries } from '../lib/adminApi.js'
import { useAsync } from '../hooks/useAsync.js'
import StatusBadge from '../components/StatusBadge.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/StatusMessage.jsx'
import './Admin.css'

function formatDate(isoDate) {
  if (!isoDate) return null
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function AdminJournalList() {
  const { status, data, error, retry } = useAsync(() => getJournalEntries(), [])
  const entries = data?.data ?? []

  return (
    <section>
      <header className="admin-page__header">
        <h1>Journal</h1>
        <Link to="/admin/journal/new" className="button button--primary">
          New Entry
        </Link>
      </header>

      {status === 'loading' && <LoadingState label="Loading journal entries…" />}

      {status === 'error' && (
        <ErrorState title="We couldn't load journal entries" message={error.message} onRetry={retry} />
      )}

      {status === 'success' && entries.length === 0 && (
        <EmptyState title="Nothing here yet" message="Write your first journal entry to get started." />
      )}

      {status === 'success' && entries.length > 0 && (
        <ul className="admin-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link to={`/admin/journal/${entry.id}`} className="admin-list__row">
                <span className="admin-list__top">
                  <StatusBadge status={entry.status} />
                  <span className="admin-list__title">{entry.title}</span>
                </span>
                <span className="admin-list__meta">
                  {entry.status === 'PUBLISHED'
                    ? `Published ${formatDate(entry.publishedAt)}`
                    : `Last updated ${formatDate(entry.updatedAt)}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default AdminJournalList
