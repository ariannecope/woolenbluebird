import { Link, useParams } from 'react-router-dom'
import { getMakerBySlug } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import StoryCard from '../components/StoryCard.jsx'
import { LoadingState, ErrorState } from '../components/StatusMessage.jsx'
import './MakerProfile.css'

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function MakerProfile() {
  const { slug } = useParams()
  const { status, data: maker, error, retry } = useAsync(() => getMakerBySlug(slug), [slug])

  if (status === 'loading') {
    return <LoadingState label="Loading maker…" />
  }

  if (status === 'error') {
    const isNotFound = error.status === 404
    return (
      <ErrorState
        title={isNotFound ? 'Maker not found' : "We couldn't load this profile"}
        message={
          isNotFound
            ? "We couldn't find the maker you were looking for. They may have moved, or their profile hasn't been approved yet."
            : error.message
        }
        onRetry={isNotFound ? undefined : retry}
      />
    )
  }

  const socialLinks =
    maker.socialLinks && typeof maker.socialLinks === 'object'
      ? Object.entries(maker.socialLinks).filter(([, url]) => url)
      : []

  return (
    <article className="maker-profile">
      <div className="maker-profile__reading">
        <p className="maker-profile__back">
          <Link to="/makers">← Back to the Maker Directory</Link>
        </p>

        <header className="maker-profile__header">
          {maker.isDevelopmentContent && (
            <p>
              <span className="placeholder-badge">
                Development placeholder — not a real community member
              </span>
            </p>
          )}

          {maker.photo ? (
            <img src={maker.photo} alt="" className="maker-profile__image" />
          ) : (
            <div className="maker-profile__image maker-profile__image--placeholder" />
          )}

          <h1>{maker.name}</h1>

          {(maker.location || maker.categories?.length > 0) && (
            <p className="maker-profile__meta">
              {maker.location && <span>{maker.location}</span>}
              {maker.categories?.map((category) => (
                <span key={category.id} className="maker-profile__category">
                  {category.name}
                </span>
              ))}
            </p>
          )}
        </header>

        {maker.bio && <p className="maker-profile__bio">{maker.bio}</p>}

        {maker.workshopInfo && (
          <section aria-labelledby="workshops-heading">
            <h2 id="workshops-heading">Workshops &amp; Classes</h2>
            <p>{maker.workshopInfo}</p>
          </section>
        )}

        {(maker.website || socialLinks.length > 0) && (
          <section aria-labelledby="connect-heading" className="maker-profile__links">
            <h2 id="connect-heading">Connect</h2>
            <ul>
              {maker.website && (
                <li>
                  <a href={maker.website} target="_blank" rel="noreferrer">
                    Website
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
              {socialLinks.map(([platform, url]) => (
                <li key={platform}>
                  <a href={url} target="_blank" rel="noreferrer">
                    {capitalize(platform)}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {maker.stories?.length > 0 && (
        <section className="maker-profile__stories" aria-labelledby="maker-stories-heading">
          <h2 id="maker-stories-heading">Stories Featuring {maker.name}</h2>
          <div className="card-grid">
            {maker.stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export default MakerProfile
