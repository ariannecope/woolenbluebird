const LABELS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
  PUBLISHED: 'Published',
}

/**
 * `status` is a SubmissionStatus value, except "PUBLISHED" which isn't a
 * real SubmissionStatus — callers pass it explicitly once a submission has
 * a publishedStory/convertedToMaker, since that's a distinct, terminal
 * state worth calling out separately from "approved".
 */
function StatusBadge({ status }) {
  const normalized = String(status ?? '').toUpperCase()
  return (
    <span className={`status-badge status-badge--${normalized.toLowerCase()}`}>
      {LABELS[normalized] ?? status}
    </span>
  )
}

export default StatusBadge
