import { Link } from 'react-router-dom'
import { getStorySubmissions, getMakerSubmissions } from '../lib/adminApi.js'
import { useAsync } from '../hooks/useAsync.js'
import './Admin.css'

function AdminHome() {
  const { status: storyStatus, data: storyData } = useAsync(
    () => getStorySubmissions({ status: 'PENDING' }),
    [],
  )
  const { status: makerStatus, data: makerData } = useAsync(
    () => getMakerSubmissions({ status: 'PENDING' }),
    [],
  )

  const pendingStoryCount = storyData?.data?.length
  const pendingMakerCount = makerData?.data?.length

  return (
    <section>
      <header className="admin-page__header">
        <h1>Admin Overview</h1>
      </header>

      <div className="admin-overview__grid">
        <Link to="/admin/story-submissions" className="admin-overview__card">
          <p>Pending Story Submissions</p>
          <p className="admin-overview__count">
            {storyStatus === 'success' ? pendingStoryCount : '—'}
          </p>
          <p>Review submissions →</p>
        </Link>

        <Link to="/admin/maker-submissions" className="admin-overview__card">
          <p>Pending Maker Submissions</p>
          <p className="admin-overview__count">
            {makerStatus === 'success' ? pendingMakerCount : '—'}
          </p>
          <p>Review submissions →</p>
        </Link>
      </div>
    </section>
  )
}

export default AdminHome
