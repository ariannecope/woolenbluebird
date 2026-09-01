import { Link, useSearchParams } from 'react-router-dom'
import { getStorySubmissions } from '../lib/adminApi.js'
import { useAsync } from '../hooks/useAsync.js'
import FilterPills from '../components/FilterPills.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/StatusMessage.jsx'
import './Admin.css'

const STATUS_FILTERS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
  { value: 'ALL', label: 'All' },
]

function formatDate(isoDate) {
  if (!isoDate) return null
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function AdminStorySubmissionsList() {
  const [searchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'PENDING'

  const { status, data, error, retry } = useAsync(
    () => getStorySubmissions({ status: statusFilter }),
    [statusFilter],
  )

  const submissions = data?.data ?? []

  return (
    <section>
      <header className="admin-page__header">
        <h1>Story Submissions</h1>
      </header>

      <FilterPills
        ariaLabel="Filter submissions by status"
        filters={STATUS_FILTERS}
        activeValue={statusFilter}
        basePath="/admin/story-submissions"
        paramName="status"
      />

      {status === 'loading' && <LoadingState label="Loading submissions…" />}

      {status === 'error' && (
        <ErrorState title="We couldn't load submissions" message={error.message} onRetry={retry} />
      )}

      {status === 'success' && submissions.length === 0 && (
        <EmptyState title="Nothing here" message="No submissions match this filter." />
      )}

      {status === 'success' && submissions.length > 0 && (
        <ul className="admin-list">
          {submissions.map((submission) => (
            <li key={submission.id}>
              <Link to={`/admin/story-submissions/${submission.id}`} className="admin-list__row">
                <span className="admin-list__top">
                  <StatusBadge status={submission.publishedStory ? 'PUBLISHED' : submission.status} />
                  <span className="admin-list__title">{submission.title}</span>
                </span>
                <span className="admin-list__meta">
                  By {submission.name} · Submitted {formatDate(submission.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default AdminStorySubmissionsList
