import { Link } from 'react-router-dom'
import FeaturedStories from '../components/FeaturedStories.jsx'
import FeaturedMakers from '../components/FeaturedMakers.jsx'
import GatherPreview from '../components/GatherPreview.jsx'
import BluebirdEmblem from '../components/BluebirdEmblem.jsx'
import './Home.css'

function Home() {
  return (
    <>
      <section className="hero">
        <BluebirdEmblem />
        <h1>Woolen Bluebird</h1>
        <p className="hero__tagline">
          Connecting people through the healing power of making
        </p>
        <div className="hero__actions">
          <Link to="/made-whole" className="button button--primary">
            Explore the Stories
          </Link>
          <Link to="/makers" className="button button--secondary">
            Find Makers
          </Link>
        </div>
      </section>

      <section className="mission" aria-labelledby="mission-heading">
        <h2 id="mission-heading" className="visually-hidden">
          Our Philosophy
        </h2>
        <p className="mission__line">We make things because we are human.</p>
        <p className="mission__line">We make to remember.</p>
        <p className="mission__line">We make to survive.</p>
        <p className="mission__line">We make to connect.</p>
        <p className="mission__line mission__line--emphasis">
          We make because sometimes creating something with our hands helps us find our way back
          to ourselves.
        </p>
        <p className="mission__cta">
          <Link to="/made-whole">Explore Made Whole →</Link>
        </p>
      </section>

      <FeaturedStories />

      <FeaturedMakers />

      <GatherPreview />

      <section className="share-cta">
        <div className="share-cta__inner">
          <h2>Share Your Story</h2>
          <p>
            Have you found healing, connection, or meaning through making? We want to hear your
            story.
          </p>
          <Link to="/submit-story" className="button button--on-dark">
            Share Your Story
          </Link>
        </div>
      </section>

      <section className="closing-statement" aria-label="Closing statement">
        <p>One story becomes another.</p>
        <p>One maker introduces us to another.</p>
        <p>One gathering becomes a community.</p>
        <p>Thread by thread, we weave something together.</p>
      </section>
    </>
  )
}

export default Home
