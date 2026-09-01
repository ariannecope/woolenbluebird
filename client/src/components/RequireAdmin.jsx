import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAdminSession } from '../lib/adminApi.js'
import { useAsync } from '../hooks/useAsync.js'
import { LoadingState, ErrorState } from './StatusMessage.jsx'

/**
 * Client-side gate for /admin/* routes. This is a UX nicety, not the real
 * security boundary — every /api/admin/* request is independently checked
 * server-side by the requireAdmin middleware regardless of what this
 * component decides to render.
 */
function RequireAdmin() {
  const location = useLocation()
  const { status, data, error, retry } = useAsync(() => getAdminSession(), [])

  if (status === 'loading') {
    return <LoadingState label="Checking session…" />
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="We couldn't verify your session"
        message={error.message}
        onRetry={retry}
      />
    )
  }

  if (!data?.data?.authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireAdmin
