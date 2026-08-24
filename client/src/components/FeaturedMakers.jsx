import { Link } from 'react-router-dom'
import { getMakers } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import MakerCard from './MakerCard.jsx'

/**
 * Same quiet-teaser approach as FeaturedStories — see that file for why
 * this renders nothing on error/empty instead of a banner.
 */
function FeaturedMakers() {
  const { status, data } = useAsync(() => getMakers({ limit: 3 }), [])
  const makers = data?.data ?? []

  if (status !== 'success' || makers.length === 0) {
    return null
  }

  return (
    <section className="content-section content-section--alt" aria-labelledby="featured-makers-heading">
      <div className="content-section__intro">
        <h2 id="featured-makers-heading">The Maker Directory</h2>
        <p className="content-section__tagline">
          Find the people who make, teach, repair, grow, gather, and share.
        </p>
      </div>

      <div className="card-grid">
        {makers.map((maker) => (
          <MakerCard key={maker.id} maker={maker} />
        ))}
      </div>

      <p className="content-section__cta">
        <Link to="/makers" className="button button--secondary">
          Explore the Maker Directory
        </Link>
      </p>
    </section>
  )
}

export default FeaturedMakers
