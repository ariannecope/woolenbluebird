import { Link } from 'react-router-dom'
import './MakerCard.css'

function MakerCard({ maker }) {
  const href = `/makers/${maker.slug}`
  const categoryNames = maker.categories?.map((category) => category.name) ?? []

  return (
    <article className="maker-card">
      <Link to={href} className="maker-card__image-link" tabIndex={-1} aria-hidden="true">
        {maker.photo ? (
          <img src={maker.photo} alt="" className="maker-card__image" />
        ) : (
          <div className="maker-card__image maker-card__image--placeholder" />
        )}
      </Link>

      <div className="maker-card__body">
        {maker.isDevelopmentContent && (
          <span className="placeholder-badge">Development placeholder</span>
        )}

        <h3 className="maker-card__name">
          <Link to={href}>{maker.name}</Link>
        </h3>

        {(maker.location || categoryNames.length > 0) && (
          <p className="maker-card__meta">
            {maker.location && <span>{maker.location}</span>}
            {categoryNames.length > 0 && <span>{categoryNames.join(', ')}</span>}
          </p>
        )}

        {maker.bio && <p className="maker-card__bio">{maker.bio}</p>}
      </div>
    </article>
  )
}

export default MakerCard
