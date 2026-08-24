import { Link } from 'react-router-dom'
import { getGatherings } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import GatheringCard from './GatheringCard.jsx'
import './GatherPreview.css'

/**
 * Unlike FeaturedStories/FeaturedMakers, this section always shows
 * something — real upcoming gatherings if there are any, otherwise the
 * PRD's "vision" copy. That fallback also quietly covers the loading and
 * error cases (nothing on the calendar yet reads the same as "the API
 * hiccupped"), which is the right failure mode for a homepage.
 */
function GatherPreview() {
  const { status, data } = useAsync(() => getGatherings(), [])
  const gatherings = (data?.data ?? []).slice(0, 3)
  const hasGatherings = status === 'success' && gatherings.length > 0

  return (
    <section className="content-section gather-preview" aria-labelledby="gather-heading">
      <div className="content-section__intro">
        <h2 id="gather-heading">Gather</h2>
        <p className="content-section__tagline">We believe making is better together.</p>
      </div>

      {status === 'loading' ? null : hasGatherings ? (
        <div className="gathering-list">
          {gatherings.map((gathering) => (
            <GatheringCard key={gathering.id} gathering={gathering} />
          ))}
        </div>
      ) : (
        <p className="gather-preview__vision">
          Woolen Bluebird Gatherings are places to learn, create, share stories, and belong —
          knitting circles, workshops, mending nights, storytelling evenings. There's nothing on
          the calendar just yet, but the vision is already taking shape.
        </p>
      )}

      <p className="content-section__cta">
        <Link to="/gather" className="button button--secondary">
          Learn More About Gather
        </Link>
      </p>
    </section>
  )
}

export default GatherPreview
