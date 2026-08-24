import { Link } from 'react-router-dom'
import { getStories } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import StoryCard from './StoryCard.jsx'

/**
 * A quiet homepage teaser, not a data-browsing view — if the request fails
 * or there's nothing published yet, this section simply doesn't render
 * rather than putting an error banner on the front door of the site. Made
 * Whole itself is where loading/error/empty states are shown explicitly.
 */
function FeaturedStories() {
  const { status, data } = useAsync(() => getStories({ limit: 3 }), [])
  const stories = data?.data ?? []

  if (status !== 'success' || stories.length === 0) {
    return null
  }

  return (
    <section className="content-section" aria-labelledby="featured-stories-heading">
      <div className="content-section__intro">
        <h2 id="featured-stories-heading">Featured Stories</h2>
        <p className="content-section__tagline">Stories of making, healing, and becoming whole.</p>
      </div>

      <div className="card-grid">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      <p className="content-section__cta">
        <Link to="/made-whole" className="button button--secondary">
          Explore the Stories
        </Link>
      </p>
    </section>
  )
}

export default FeaturedStories
