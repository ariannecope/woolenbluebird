import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getMakerSubmission, reviewMakerSubmission, publishMakerSubmission } from '../lib/adminApi.js'
import { getCategories } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import { LoadingState, ErrorState } from '../components/StatusMessage.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import FieldError from '../components/FieldError.jsx'
import './Admin.css'

const REVIEW_STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED']
const MAKER_STATUS_OPTIONS = [
  { value: 'APPROVED', label: 'Approved' },
  { value: 'FEATURED', label: 'Featured' },
]

function formatDate(isoDate) {
  if (!isoDate) return null
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function AdminMakerSubmissionReview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { status, data, error, retry } = useAsync(() => getMakerSubmission(id), [id])
  const submission = data?.data ?? null

  const { status: categoriesStatus, data: categoriesData } = useAsync(() => getCategories(), [])
  const categories = categoriesData?.data ?? []

  const [reviewStatus, setReviewStatus] = useState('PENDING')
  const [reviewNotes, setReviewNotes] = useState('')
  const [savingReview, setSavingReview] = useState(false)
  const [reviewError, setReviewError] = useState(null)

  const [publishForm, setPublishForm] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState(null)
  const [publishFieldErrors, setPublishFieldErrors] = useState({})

  useEffect(() => {
    if (submission) {
      setReviewStatus(submission.status)
      setReviewNotes(submission.reviewNotes ?? '')
    }
  }, [submission])

  useEffect(() => {
    if (submission && categoriesStatus !== 'loading' && publishForm === null) {
      const matchedCategoryIds = (categoriesData?.data ?? [])
        .filter((category) => (submission.craftCategory ?? '').includes(category.name))
        .map((category) => category.id)

      setPublishForm({
        name: submission.makerName,
        bio: submission.description,
        location: submission.location ?? '',
        photo: submission.photo ?? '',
        website: submission.website ?? '',
        workshopInfo: submission.workshopInformation ?? '',
        status: 'APPROVED',
        categoryIds: matchedCategoryIds,
      })
    }
    // `categoriesData` (not the derived `categories` array) is the stable
    // dependency here — `categories` is a fresh [] on every render until
    // data arrives, which would re-run this effect on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submission, categoriesStatus, categoriesData, publishForm])

  if (status === 'loading') {
    return <LoadingState label="Loading submission…" />
  }

  if (status === 'error') {
    const isNotFound = error.status === 404
    return (
      <ErrorState
        title={isNotFound ? 'Submission not found' : "We couldn't load this submission"}
        message={error.message}
        onRetry={isNotFound ? undefined : retry}
      />
    )
  }

  const isPublished = Boolean(submission.convertedToMaker)

  async function handleSaveReview(event) {
    event.preventDefault()
    setSavingReview(true)
    setReviewError(null)
    try {
      await reviewMakerSubmission(id, { status: reviewStatus, reviewNotes })
      retry()
    } catch (err) {
      setReviewError(err.message)
    } finally {
      setSavingReview(false)
    }
  }

  function updatePublishField(field, value) {
    setPublishForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleCategory(categoryId) {
    setPublishForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((existing) => existing !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }

  async function handlePublish(event) {
    event.preventDefault()
    setPublishing(true)
    setPublishError(null)
    setPublishFieldErrors({})

    try {
      const result = await publishMakerSubmission(id, {
        name: publishForm.name.trim(),
        bio: publishForm.bio.trim(),
        location: publishForm.location.trim() || undefined,
        photo: publishForm.photo.trim() || undefined,
        website: publishForm.website.trim() || undefined,
        workshopInfo: publishForm.workshopInfo.trim() || undefined,
        status: publishForm.status,
        categoryIds: publishForm.categoryIds,
      })
      navigate(`/makers/${result.data.slug}`)
    } catch (err) {
      setPublishError(err.message)
      if (err.fieldErrors) setPublishFieldErrors(err.fieldErrors)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <section>
      <p className="admin-review__back">
        <Link to="/admin/maker-submissions">← Back to Maker Submissions</Link>
      </p>

      <header className="admin-review__header">
        <h1>{submission.makerName}</h1>
        <StatusBadge status={isPublished ? 'PUBLISHED' : submission.status} />
      </header>

      {isPublished && (
        <p className="admin-review__published-notice">
          Published as{' '}
          <Link to={`/makers/${submission.convertedToMaker.slug}`}>
            {submission.convertedToMaker.name}
          </Link>
          . This submission can no longer be modified.
        </p>
      )}

      <div className="admin-review__section">
        <h2>Original Submission</h2>
        <dl className="admin-review__original">
          <div className="admin-review__field-static">
            <dt>Submitted by</dt>
            <dd>
              {submission.submitterName} ({submission.submitterEmail})
            </dd>
          </div>
          <div className="admin-review__field-static">
            <dt>Maker Name</dt>
            <dd>{submission.makerName}</dd>
          </div>
          {submission.location && (
            <div className="admin-review__field-static">
              <dt>Location</dt>
              <dd>{submission.location}</dd>
            </div>
          )}
          {submission.craftCategory && (
            <div className="admin-review__field-static">
              <dt>Craft / Category</dt>
              <dd>{submission.craftCategory}</dd>
            </div>
          )}
          <div className="admin-review__field-static">
            <dt>Description</dt>
            <dd>{submission.description}</dd>
          </div>
          {submission.website && (
            <div className="admin-review__field-static">
              <dt>Website</dt>
              <dd>{submission.website}</dd>
            </div>
          )}
          {submission.workshopInformation && (
            <div className="admin-review__field-static">
              <dt>Workshop Information</dt>
              <dd>{submission.workshopInformation}</dd>
            </div>
          )}
          {submission.recommendationReason && (
            <div className="admin-review__field-static">
              <dt>Why they're recommended</dt>
              <dd>{submission.recommendationReason}</dd>
            </div>
          )}
          <div className="admin-review__field-static">
            <dt>Permissions</dt>
            <dd>
              Contact: {submission.permissionToContact ? 'Yes' : 'No'} · List:{' '}
              {submission.publicationPermission ? 'Yes' : 'No'}
            </dd>
          </div>
          <div className="admin-review__field-static">
            <dt>Submitted</dt>
            <dd>{formatDate(submission.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <div className="admin-review__section">
        <h2>Review</h2>

        {reviewError && (
          <div className="form-status">
            <ErrorState title="Couldn't save review" message={reviewError} />
          </div>
        )}

        <form onSubmit={handleSaveReview}>
          <div className="field">
            <label htmlFor="reviewStatus" className="field__label">
              Status
            </label>
            <select
              id="reviewStatus"
              value={reviewStatus}
              onChange={(event) => setReviewStatus(event.target.value)}
              disabled={isPublished || savingReview}
            >
              {REVIEW_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="reviewNotes" className="field__label">
              Review Notes
            </label>
            <p className="field__hint">Private notes — never shown publicly.</p>
            <textarea
              id="reviewNotes"
              value={reviewNotes}
              onChange={(event) => setReviewNotes(event.target.value)}
              disabled={isPublished || savingReview}
            />
          </div>

          <button
            type="submit"
            className="button button--secondary"
            disabled={isPublished || savingReview}
          >
            {savingReview ? 'Saving…' : 'Save Review'}
          </button>
        </form>
      </div>

      {!isPublished && submission.status === 'APPROVED' && publishForm && (
        <div className="admin-review__section">
          <h2>Publish</h2>
          <p className="field__hint">
            Review and clean up the profile below before it goes live — this doesn't have to match
            the raw submission above word-for-word.
          </p>

          {publishError && (
            <div className="form-status">
              <ErrorState title="Couldn't publish" message={publishError} />
            </div>
          )}

          <form onSubmit={handlePublish}>
            <div className="field">
              <label htmlFor="publishName" className="field__label">
                Name
              </label>
              <input
                id="publishName"
                type="text"
                value={publishForm.name}
                onChange={(event) => updatePublishField('name', event.target.value)}
                disabled={publishing}
                aria-invalid={publishFieldErrors.name ? 'true' : undefined}
              />
              <FieldError message={publishFieldErrors.name} />
            </div>

            <div className="field">
              <label htmlFor="publishBio" className="field__label">
                Bio
              </label>
              <textarea
                id="publishBio"
                value={publishForm.bio}
                onChange={(event) => updatePublishField('bio', event.target.value)}
                disabled={publishing}
                aria-invalid={publishFieldErrors.bio ? 'true' : undefined}
              />
              <FieldError message={publishFieldErrors.bio} />
            </div>

            <div className="field">
              <label htmlFor="publishLocation" className="field__label">
                Location
              </label>
              <input
                id="publishLocation"
                type="text"
                value={publishForm.location}
                onChange={(event) => updatePublishField('location', event.target.value)}
                disabled={publishing}
              />
            </div>

            <div className="field">
              <label htmlFor="publishPhoto" className="field__label">
                Photo URL
              </label>
              <input
                id="publishPhoto"
                type="text"
                value={publishForm.photo}
                onChange={(event) => updatePublishField('photo', event.target.value)}
                disabled={publishing}
              />
            </div>

            <div className="field">
              <label htmlFor="publishWebsite" className="field__label">
                Website
              </label>
              <input
                id="publishWebsite"
                type="text"
                placeholder="https://example.com"
                value={publishForm.website}
                onChange={(event) => updatePublishField('website', event.target.value)}
                disabled={publishing}
                aria-invalid={publishFieldErrors.website ? 'true' : undefined}
              />
              <FieldError message={publishFieldErrors.website} />
            </div>

            <div className="field">
              <label htmlFor="publishWorkshopInfo" className="field__label">
                Workshop Information
              </label>
              <textarea
                id="publishWorkshopInfo"
                value={publishForm.workshopInfo}
                onChange={(event) => updatePublishField('workshopInfo', event.target.value)}
                disabled={publishing}
              />
            </div>

            <div className="field">
              <label htmlFor="publishStatus" className="field__label">
                Listing Status
              </label>
              <select
                id="publishStatus"
                value={publishForm.status}
                onChange={(event) => updatePublishField('status', event.target.value)}
                disabled={publishing}
              >
                {MAKER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {categories.length > 0 && (
              <fieldset className="field-group">
                <legend className="field-group__legend">Categories</legend>
                <div className="checkbox-grid">
                  {categories.map((category) => (
                    <label key={category.id} className="checkbox-grid__item">
                      <input
                        type="checkbox"
                        checked={publishForm.categoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        disabled={publishing}
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <button type="submit" className="button button--primary" disabled={publishing}>
              {publishing ? 'Publishing…' : 'Publish Maker'}
            </button>
          </form>
        </div>
      )}
    </section>
  )
}

export default AdminMakerSubmissionReview
