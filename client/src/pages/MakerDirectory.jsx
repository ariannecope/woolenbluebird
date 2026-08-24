import { Link, useSearchParams } from 'react-router-dom'
import { getMakers, getCategories } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import FilterPills from '../components/FilterPills.jsx'
import LocationFilter from '../components/LocationFilter.jsx'
import MakerCard from '../components/MakerCard.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/StatusMessage.jsx'
import './MakerDirectory.css'

function MakerDirectory() {
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category') ?? ''
  const locationFilter = searchParams.get('location') ?? ''

  const { status: categoriesStatus, data: categoriesData } = useAsync(() => getCategories(), [])
  const categories = categoriesData?.data ?? []
  const categoryFilters = [
    { value: '', label: 'All Makers' },
    ...categories.map((category) => ({ value: category.slug, label: category.name })),
  ]

  const { status, data, error, retry } = useAsync(
    () => getMakers({ category: categoryFilter, location: locationFilter }),
    [categoryFilter, locationFilter],
  )

  const makers = data?.data ?? []
  const activeCategoryLabel = categoryFilters.find((filter) => filter.value === categoryFilter)?.label

  return (
    <section className="maker-directory">
      <header className="maker-directory__intro">
        <h1>The Maker Directory</h1>
        <p className="maker-directory__tagline">
          Find the people who make, teach, gather, repair, grow, and share.
        </p>
        <p className="maker-directory__cta">
          Are you a maker, teacher, or creative community?{' '}
          <Link to="/submit-maker">Tell us about yourself</Link>.
        </p>
      </header>

      <div className="maker-directory__filters">
        {categoriesStatus === 'success' && categories.length > 0 && (
          <FilterPills
            ariaLabel="Filter makers by category"
            filters={categoryFilters}
            activeValue={categoryFilter}
            basePath="/makers"
            paramName="category"
            otherParams={{ location: locationFilter }}
          />
        )}

        <LocationFilter basePath="/makers" />
      </div>

      {status === 'loading' && <LoadingState label="Loading makers…" />}

      {status === 'error' && (
        <ErrorState
          title="We couldn't load the directory"
          message={error.message}
          onRetry={retry}
        />
      )}

      {status === 'success' && makers.length === 0 && (
        <EmptyState
          title={
            locationFilter || activeCategoryLabel
              ? 'No makers match yet'
              : 'The directory is just getting started'
          }
          message="New makers join the directory one introduction at a time. Check back soon, or help us grow it."
        />
      )}

      {status === 'success' && makers.length > 0 && (
        <div className="card-grid">
          {makers.map((maker) => (
            <MakerCard key={maker.id} maker={maker} />
          ))}
        </div>
      )}
    </section>
  )
}

export default MakerDirectory
