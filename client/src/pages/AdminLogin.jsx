import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { adminLogin, getAdminSession } from '../lib/adminApi.js'
import { useAsync } from '../hooks/useAsync.js'
import { ErrorState } from '../components/StatusMessage.jsx'
import './Admin.css'

function AdminLogin() {
  const location = useLocation()
  const navigate = useNavigate()
  const destination = location.state?.from?.pathname ?? '/admin'

  const { status: sessionStatus, data: sessionData } = useAsync(() => getAdminSession(), [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Already logged in? Skip the form entirely.
  if (sessionStatus === 'success' && sessionData?.data?.authenticated) {
    return <Navigate to={destination} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await adminLogin({ email: email.trim(), password })
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="submission-page admin-login">
      <h1>Admin Login</h1>
      <p className="admin-page__intro">Private area for reviewing and publishing submissions.</p>

      {error && (
        <div className="form-status">
          <ErrorState title="Couldn't log in" message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email" className="field__label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password" className="field__label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
            required
          />
        </div>

        <button type="submit" className="button button--primary" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log In'}
        </button>
      </form>
    </section>
  )
}

export default AdminLogin
