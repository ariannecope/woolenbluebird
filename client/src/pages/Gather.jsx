import { Link } from 'react-router-dom'
import { getGatherings } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import GatheringCard from '../components/GatheringCard.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/StatusMessage.jsx'
import './Gather.css'

function Gather() {
  const { status, data, error, retry } = useAsync(() => getGatherings(), [])
  const gatherings = data?.data ?? []

  return (
    <article className="gather">
      <header className="gather__intro">
        <h1>Gather</h1>
        <p className="gather__tagline">Where do I belong?</p>
        <p>
          Making doesn't have to happen alone. Some of it is even better when
          it doesn't — a room full of people quietly working with their
          hands, a table someone is teaching you to set, a circle where the
          conversation moves at the same unhurried pace as the stitches.
          Gather is about finding that kind of room, or starting one.
        </p>
      </header>

      <section
        className="content-section content-section--alt gather__section"
        aria-labelledby="gather-kinds-heading"
      >
        <h2 id="gather-kinds-heading">What gathering could look like</h2>
        <p>
          Not all of this exists yet. Some of it might never exist in exactly
          this form. But this is the shape Woolen Bluebird hopes to help
          people find, or build for themselves:
        </p>
        <p className="gather__kinds">
          Knitting circles. Mending nights. Craft workshops. Storytelling
          evenings. Shared meals. Making days. Retreats.
        </p>
        <p>
          The stories in Made Whole are the pieces. The people behind them
          are the hands. Gathering is simply where those hands end up in the
          same room.
        </p>
      </section>

      <section
        className="content-section gather__section"
        aria-labelledby="gather-calendar-heading"
      >
        <h2 id="gather-calendar-heading">On the calendar</h2>

        {status === 'loading' && <LoadingState label="Loading gatherings…" />}

        {status === 'error' && (
          <ErrorState
            title="We couldn't load the calendar"
            message={error.message}
            onRetry={retry}
          />
        )}

        {status === 'success' && gatherings.length === 0 && (
          <EmptyState
            title="The calendar is still being woven"
            message="There's nothing scheduled yet. A young community's calendar fills in one thread at a time — check back soon."
          />
        )}

        {status === 'success' && gatherings.length > 0 && (
          <div className="gather__list">
            {gatherings.map((gathering) => (
              <GatheringCard key={gathering.id} gathering={gathering} />
            ))}
          </div>
        )}
      </section>

      <section
        className="content-section content-section--alt gather__section"
        aria-labelledby="gather-nearby-heading"
      >
        <h2 id="gather-nearby-heading">Maybe it already exists near you</h2>
        <p>
          Woolen Bluebird doesn't have to be the one to start every
          gathering. Maybe there's already a knitting circle at your local
          yarn shop, a community mending night, or a woodworking class taught
          by someone down the street. The Maker Directory is a place to start
          looking for the people already doing this kind of work.
        </p>
        <p>
          And if you know a maker, teacher, or gathering that belongs there,
          tell us about them.
        </p>
        <ul className="gather__links">
          <li>
            <Link to="/makers">Browse the Maker Directory</Link>
          </li>
          <li>
            <Link to="/made-whole">Read stories in Made Whole</Link>
          </li>
          <li>
            <Link to="/submit-maker">Submit a maker</Link>
          </li>
        </ul>
      </section>

      <section
        className="content-section gather__section"
        aria-labelledby="gather-future-heading"
      >
        <h2 id="gather-future-heading">Where this is headed</h2>
        <p>
          Right now, Gather is small and mostly a promise. Over time, the
          hope is for it to grow into something larger: regular local
          gatherings, real workshops, storytelling evenings with a set place
          and time, retreats, eventually a Woolen Bluebird Festival, and —
          someday — a physical place where people can grow food, work with
          natural fiber, mend clothing, and learn traditional skills
          together.
        </p>
        <p>
          None of that exists yet. It's the direction Woolen Bluebird is
          walking toward.
        </p>
      </section>
    </article>
  )
}

export default Gather
