import { Link } from 'react-router-dom'
import FeaturedStories from '../components/FeaturedStories.jsx'
import FeaturedMakers from '../components/FeaturedMakers.jsx'
import GatherPreview from '../components/GatherPreview.jsx'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js'
import nestDrawing from './images/nest.png'
import bluebirdDrawing from './images/bluebirdthree.png'
import './Home.css'

function Home() {
  const [nestRef, nestRevealed] = useRevealOnScroll()
  const [closingRef, closingRevealed] = useRevealOnScroll()

  return (
    <>
      <section className="hero">
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
        <p className="mission__line">
          We make things because we are <span className="mission__highlight">human</span>.
        </p>
        <p className="mission__line">
          We make to <span className="mission__highlight">remember</span>.
        </p>
        <p className="mission__line">
          We make to <span className="mission__highlight">survive</span>.
        </p>
        <p className="mission__line">
          We make to <span className="mission__highlight">connect</span>.
        </p>
        <p className="mission__line mission__line--emphasis">
          We make because sometimes creating something with our hands helps us find our way back
          to ourselves.
        </p>
        <p className="mission__cta">
          <Link to="/made-whole">Explore Made Whole →</Link>
        </p>
      </section>

      <img
        ref={nestRef}
        src={nestDrawing}
        alt=""
        className={`home__nest bird-landing${nestRevealed ? ' bird-landing--in' : ''}`}
      />

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
        <div className="closing-statement__row" ref={closingRef}>
          <img
            src={bluebirdDrawing}
            alt=""
            className={`closing-statement__bird bird-landing${closingRevealed ? ' bird-landing--in' : ''}`}
          />
          <div className="closing-statement__text">
            <p>One story becomes another.</p>
            <p>One maker introduces us to another.</p>
            <p>One gathering becomes a community.</p>
            <p>Thread by thread, we weave something together.</p>
          </div>
          <img
            src={bluebirdDrawing}
            alt=""
            className={`closing-statement__bird closing-statement__bird--right bird-landing${closingRevealed ? ' bird-landing--in' : ''}`}
          />
        </div>
      </section>
    </>
  )
}

export default Home
