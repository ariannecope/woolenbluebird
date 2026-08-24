import './StatusMessage.css'

export function LoadingState({ label = 'Loading…' }) {
  return (
    <p className="state-message state-message--loading" role="status" aria-live="polite">
      {label}
    </p>
  )
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="state-message state-message--error" role="alert">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {onRetry && (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, message }) {
  return (
    <div className="state-message state-message--empty">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
    </div>
  )
}
