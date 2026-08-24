import { useNavigate, useSearchParams } from 'react-router-dom'
import './LocationFilter.css'

/**
 * A free-text filter, unlike FilterPills' fixed options — location is an
 * open string, not a taxonomy. Still URL-driven: submitting writes
 * `?location=` (preserving any other active filters). The input is
 * uncontrolled and keyed on the current URL value so it resets correctly
 * when navigation changes location out from under it (a category pill
 * click, browser back/forward, or Clear) without needing extra state.
 */
function LocationFilter({ basePath }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentLocation = searchParams.get('location') ?? ''

  function navigateWithLocation(nextLocation) {
    const params = new URLSearchParams(searchParams)
    if (nextLocation) {
      params.set('location', nextLocation)
    } else {
      params.delete('location')
    }
    const query = params.toString()
    navigate(query ? `${basePath}?${query}` : basePath)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('location')?.toString().trim() ?? ''
    navigateWithLocation(value)
  }

  return (
    <form className="location-filter" role="search" onSubmit={handleSubmit}>
      <label htmlFor="location-filter-input" className="location-filter__label">
        Location
      </label>
      <div className="location-filter__row">
        <input
          key={currentLocation}
          id="location-filter-input"
          name="location"
          type="text"
          defaultValue={currentLocation}
          placeholder="e.g. Vermont"
        />
        <button type="submit" className="button button--secondary">
          Search
        </button>
        {currentLocation && (
          <button
            type="button"
            className="button button--secondary"
            onClick={() => navigateWithLocation('')}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  )
}

export default LocationFilter
