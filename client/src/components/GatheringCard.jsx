import './GatheringCard.css'

function formatDateRange(startsAt, endsAt) {
  const start = new Date(startsAt)
  const startLabel = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (!endsAt) return startLabel

  const end = new Date(endsAt)
  if (start.toDateString() === end.toDateString()) {
    const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    return `${startLabel}, ${startTime}–${endTime}`
  }

  const endLabel = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${startLabel} – ${endLabel}`
}

function GatheringCard({ gathering }) {
  const start = gathering.startsAt ? new Date(gathering.startsAt) : null

  return (
    <article className="gathering-card">
      <div
        className={start ? 'gathering-card__date' : 'gathering-card__date gathering-card__date--tbd'}
        aria-hidden="true"
      >
        <span className="gathering-card__month">
          {start ? start.toLocaleDateString('en-US', { month: 'short' }) : 'TBD'}
        </span>
        {start && <span className="gathering-card__day">{start.getDate()}</span>}
      </div>

      <div className="gathering-card__body">
        {gathering.isDevelopmentContent && (
          <span className="placeholder-badge">Development placeholder</span>
        )}
        <h3 className="gathering-card__title">{gathering.title}</h3>
        <p className="gathering-card__meta">
          {gathering.startsAt && formatDateRange(gathering.startsAt, gathering.endsAt)}
          {gathering.location && ` · ${gathering.location}`}
        </p>
        <p className="gathering-card__description">{gathering.description}</p>
      </div>
    </article>
  )
}

export default GatheringCard
