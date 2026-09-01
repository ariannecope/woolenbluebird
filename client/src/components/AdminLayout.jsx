import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminLogout } from '../lib/adminApi.js'
import './AdminLayout.css'

function AdminLayout() {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await adminLogout()
    } catch {
      // Even if the request fails, there's nothing useful to do but send
      // the admin back to the login screen and let requireAdmin re-check.
    }
    navigate('/admin/login')
  }

  return (
    <div className="admin">
      <div className="admin__bar container">
        <nav className="admin__nav" aria-label="Admin">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? 'admin__nav-link is-active' : 'admin__nav-link')}
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin/story-submissions"
            className={({ isActive }) => (isActive ? 'admin__nav-link is-active' : 'admin__nav-link')}
          >
            Story Submissions
          </NavLink>
          <NavLink
            to="/admin/maker-submissions"
            className={({ isActive }) => (isActive ? 'admin__nav-link is-active' : 'admin__nav-link')}
          >
            Maker Submissions
          </NavLink>
        </nav>
        <button
          type="button"
          className="button button--secondary"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Logging out…' : 'Log out'}
        </button>
      </div>

      <main className="container admin__main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
