import { Link } from 'react-router-dom'
import './FilterPills.css'

function buildHref(basePath, paramName, value, otherParams) {
  const params = new URLSearchParams()
  for (const [key, val] of Object.entries(otherParams ?? {})) {
    if (val) params.set(key, val)
  }
  if (value) params.set(paramName, value)
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

/**
 * A row of pill links that filter a list page by one query param, while
 * preserving any other active filters (e.g. category pills that keep a
 * location search intact). Filter state always lives in the URL so it's
 * shareable and works with back/forward navigation.
 */
function FilterPills({ ariaLabel, filters, activeValue, basePath, paramName, otherParams }) {
  return (
    <nav className="filter-pills" aria-label={ariaLabel}>
      <ul className="filter-pills__list">
        {filters.map((filter) => {
          const isActive = filter.value === activeValue
          const href = buildHref(basePath, paramName, filter.value, otherParams)

          return (
            <li key={filter.value || 'all'}>
              <Link
                to={href}
                className={isActive ? 'filter-pills__pill is-active' : 'filter-pills__pill'}
                aria-current={isActive ? 'page' : undefined}
              >
                {filter.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default FilterPills
