import { Link } from 'react-router-dom'
import aboutPhoto from './images/about.jpg'
import './About.css'

/*
 * Future visual direction (not implemented here):
 * Made Whole, and the StoryCard component specifically, should eventually read
 * as a quilt made of individual story pieces — each card a "quilt square"
 * drawn from one shared visual system (Woolen Bluebird's existing muted
 * palette), with subtle per-card variation in texture, patchwork geometry,
 * borders, stitching details, and typography placement. Aim for a
 * thoughtfully designed contemporary art quilt / editorial textile feel, not
 * literal cartoon quilts, craft-store fabric textures, or decorative clutter.
 * The feeling to communicate: different stories, stitched together.
 */

function About() {
  return (
    <article className="about">
      <header className="about__opening">
        <h1>Woolen Bluebird</h1>
        <p className="about__tagline">
          Connecting people through the healing power of making
        </p>
        <div className="about__lede">
          <p>Woolen Bluebird began with one story.</p>
          <p>Mine.</p>
          <p>
            A story about making, and what it can mean to create something with
            your hands when life feels uncertain or difficult. Over time, I
            began wondering how many other people had found something similar
            through making.
          </p>
          <p>
            I started collecting their stories like beautiful little scraps of
            cloth.
          </p>
          <p>
            Woolen Bluebird is the place where those pieces are being stitched
            together.
          </p>
        </div>

        <blockquote className="about__manifesto about__progression">
          <p>Woolen Bluebird began with one story.</p>
          <p>That story led to other stories.</p>
          <p>The stories are being stitched together.</p>
          <p>The collection is becoming a community.</p>
        </blockquote>
      </header>

      <section
        className="content-section about__section"
        aria-labelledby="my-story-heading"
      >
        <h2 id="my-story-heading">Woolen Bluebird was my story.</h2>
        <figure className="about__portrait">
          <img
            src={aboutPhoto}
            alt="Arianne wearing a handmade crocheted wrap, holding a small bundle of wildflowers"
          />
        </figure>
        <blockquote className="about__pullquote">
          <p>My hands could create as well as endure</p>
        </blockquote>
        <p>
          I healed with my hands. When I
          was living through trauma, I discovered the simple, repetitive
          motion of knitting could help settle something in me that words couldn't reach.
        </p>
        <p>
          The needles moved back and forth. Left, right. Left, right. Again
          and again. That bilateral rhythm gave my my nervous system something steady to follow as I healed from PTSD.
        </p>
        <p>
          Knitting became a way of staying present when my mind wanted to disappear. It
          gave me a small, tangible way back into my body. Eventually I stitched a whole new life. I began raising sheep, learning to handspin their wool, and dyeing the fiber with plants I grew or gathered wild.
        </p>
        <p>
          The process restored me—
          caring for a living thing, gathering what it gave me, washing and
          carding the wool, spinning it into something useful, and eventually
          making something beautiful with my own hands.
        </p>
        <p>
          I was broken by the deliberate actions
          of other human beings. Working with sheep and wool connected me instead to something gentle, living, and tangible. I could take something ordinary and turn it into something warm. I could take
          loose, tangled fibers and patiently make them into something whole, returning to wholeness myself in the process.
        </p>
        <p>
          Making didn't erase what happened to me, but it gave me a way to move through it. It helped me remember that my hands could
          create as well as endure, and that something beautiful could still
          come from a life that had been broken open.
        </p>
        <p>
          That's part of why Woolen Bluebird exists. It began as one piece —
          my story. Then I started hearing pieces of other people's stories —
          the ways they had found connection, meaning, survival, identity, or
          healing through making. And I began to see that perhaps we weren't
          telling separate stories at all. We were adding our pieces to the
          same quilt.
        </p>
      </section>

      <section
        className="content-section content-section--alt about__section about__section--quilt"
        aria-labelledby="collection-heading"
      >
        <h2 id="collection-heading">
          Woolen Bluebird became a collection of stories.
        </h2>
        <p>
          A knitter's story. A gardener's story. A woodworker's story. A maker
          who learned from a parent. Someone who began creating during a
          difficult season. Someone who found friendship around a table. Someone
          who simply discovered that making something with their hands helped
          them feel a little more like themselves.
        </p>
        <p>Each story is a different piece. </p>
        <p>
          Woolen Bluebird is becoming a place where those pieces can be
          stitched together into a beautiful quilt.
        </p>
        <p>One story becomes another.</p>
        <p>One maker leads us to another.</p>
        <p>One thread crosses another.</p>
        <p>Together, they become a quilt.</p>
        <p>
          Not a perfect one. Not one where every square matches. Different
          hands, different patterns, different crafts, different seasons of
          life — pieces that were never made to match, only to be placed
          next to each other.
        </p>
        <p>
          A living quilt made from different hands, different histories,
          different kinds of making, and different ways of finding our way
          through the world. Together, those pieces come to make something
          larger than any single square could be on its own.
        </p>
        <p>
          The object almost never turns out to be the point. A finished sweater,
          a repaired chair, a jar of something put up for winter — those are the
          doorway. The person behind the making is the story.
        </p>
        <blockquote className="about__pullquote about__pullquote--question">
          <p>What helped you keep singing?</p>
        </blockquote>
        <p>
          That's the question Woolen Bluebird keeps asking, in as many forms of
          making as people want to bring to it — knitting, sewing, woodworking,
          gardening, pottery, cooking, repairing, building, fiber arts, and
          whatever else counts as making with your hands.
        </p>
        <p className="content-section__cta about__section-cta">
          <Link to="/submit-story" className="button button--primary">
            Submit Your Story
          </Link>
        </p>
      </section>

      <section
        className="content-section about__section"
        aria-labelledby="community-heading"
      >
        <h2 id="community-heading">Woolen Bluebird became a community.</h2>
        <p>
          Right now, Woolen Bluebird is still small, and it's honest about that.
          Every story shared here, and every maker added to the directory, is
          another piece finding its place in the quilt. Today, it includes:
        </p>
        <ul className="about__current-list">
          <li>
            <strong>Made Whole</strong>, the collection of stories itself —
            interviews, essays, maker profiles, and eventually podcast episodes.
          </li>
          <li>
            <strong>The Maker Directory</strong>, a starting place to find real
            people who make, teach, repair, grow, gather, and share.
          </li>
          <li>
            A simple way to{" "}
            <strong>share your own story or ask to be listed as a maker</strong>
            , both reviewed by hand before anything is published.
          </li>
          <li>
            <strong>Gather</strong>, a page describing the vision for gatherings
            and, when they exist, listing the ones that are actually happening.
          </li>
        </ul>
        <p>
          The larger vision reaches further than any of that: gatherings with
          real registration and a regular rhythm, a Woolen Bluebird Festival,
          and — someday — a physical place, a farm or community space where
          people could grow food, work with natural fiber, mend clothing, and
          learn traditional skills together. None of that exists yet. It's the
          direction Woolen Bluebird is walking toward, not a promise with a date
          attached.
        </p>
      </section>

      <section
        className="content-section content-section--alt about__section"
        aria-labelledby="larger-idea-heading"
      >
        <h2 id="larger-idea-heading">The larger idea</h2>
        <p>
          For most of human history, making was woven into community life.
          People made, repaired, cooked, built, taught, and learned together,
          out of necessity as much as anything else. A lot of that has come
          apart in modern life — we make things alone now, if we make them at
          all, and we've lost some of the community that used to come with it.
        </p>
        <p>
          Woolen Bluebird is interested in helping weave some of that back
          together. Technology isn't the destination here. It's a trail marker —
          something that helps people find their way to an actual human
          gathering.
        </p>
        <blockquote className="about__manifesto">
          <p>The website is the trail marker.</p>
          <p>The stories are the invitation.</p>
          <p>The directory is the map.</p>
          <p>The gatherings are the hearth.</p>
        </blockquote>
        <p>
          And the community is what we're ultimately trying to weave together.
        </p>
      </section>

      <section
        className="about__invitation"
        aria-labelledby="invitation-heading"
      >
        <h2 id="invitation-heading">You're welcome here.</h2>
        <p>
          Maybe you've found healing through making. Maybe you've learned
          something from another maker, or you want to teach someone what you
          know. Maybe you're just looking for people who understand why any of
          this matters.
        </p>
        <p>Whatever brought you here, there's a piece of the quilt for you.</p>
        <ul className="about__links">
          <li>
            <Link to="/made-whole">Read a story in Made Whole</Link>
          </li>
          <li>
            <Link to="/makers">Browse the Maker Directory</Link>
          </li>
          <li>
            <Link to="/submit-story">Share your own story</Link>
          </li>
          <li>
            <Link to="/gather">Learn about Gather</Link>
          </li>
        </ul>
      </section>
    </article>
  );
}

export default About
