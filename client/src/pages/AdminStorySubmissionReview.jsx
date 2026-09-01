import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getStorySubmission, reviewStorySubmission, publishStorySubmission } from '../lib/adminApi.js'
import { getCategories } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import { STORY_TYPE_LABELS } from '../lib/storyTypes.js'
import { LoadingState, ErrorState } from '../components/StatusMessage.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import FieldError from '../components/FieldError.jsx'
import './Admin.css'

// Journal isn't offered here — Journal is Arianne's own writing, not a
// destination for community submissions (see storyTypes.js).
const STORY_TYPE_OPTIONS = Object.entries(STORY_TYPE_LABELS).filter(([value]) => value !== 'JOURNAL')

const REVIEW_STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED']

function formatDate(isoDate) {
  if (!isoDate) return null
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function AdminStorySubmissionReview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { status, data, error, retry } = useAsync(() => getStorySubmission(id), [id])
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

  // Keep the review fields synced to whatever's on the server (this effect
  // re-runs after `retry()` following a successful save).
  useEffect(() => {
    if (submission) {
      setReviewStatus(submission.status)
      setReviewNotes(submission.reviewNotes ?? '')
    }
  }, [submission])

  // Seed the publish form exactly once, from the submission's raw content —
  // after that, admin edits own it. Waits for categories to finish loading
  // (success or error) so the craftCategory pre-match below isn't racing an
  // empty array.
  useEffect(() => {
    if (submission && categoriesStatus !== 'loading' && publishForm === null) {
      const matchedCategoryIds = (categoriesData?.data ?? [])
        .filter((category) => (submission.craftCategory ?? '').includes(category.name))
        .map((category) => category.id)

      setPublishForm({
        title: submission.title,
        type: '',
        excerpt: '',
        content: submission.story,
        author: submission.name,
        featuredImage: submission.photo ?? '',
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

  const isPublished = Boolean(submission.publishedStory)

  async function handleSaveReview(event) {
    event.preventDefault()
    setSavingReview(true)
    setReviewError(null)
    try {
      await reviewStorySubmission(id, { status: reviewStatus, reviewNotes })
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
      const result = await publishStorySubmission(id, {
        title: publishForm.title.trim(),
        type: publishForm.type,
        excerpt: publishForm.excerpt.trim() || undefined,
        content: publishForm.content.trim(),
        author: publishForm.author.trim() || undefined,
        featuredImage: publishForm.featuredImage.trim() || undefined,
        categoryIds: publishForm.categoryIds,
      })
      navigate(`/made-whole/${result.data.slug}`)
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
        <Link to="/admin/story-submissions">← Back to Story Submissions</Link>
      </p>

      <header className="admin-review__header">
        <h1>{submission.title}</h1>
        <StatusBadge status={isPublished ? 'PUBLISHED' : submission.status} />
      </header>

      {isPublished && (
        <p className="admin-review__published-notice">
          Published as{' '}
          <Link to={`/made-whole/${submission.publishedStory.slug}`}>
            {submission.publishedStory.title}
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
              {submission.name} ({submission.email})
            </dd>
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
            <dt>Title</dt>
            <dd>{submission.title}</dd>
          </div>
          <div className="admin-review__field-static">
            <dt>Story</dt>
            <dd>{submission.story}</dd>
          </div>
          {submission.website && (
            <div className="admin-review__field-static">
              <dt>Website</dt>
              <dd>{submission.website}</dd>
            </div>
          )}
          <div className="admin-review__field-static">
            <dt>Permissions</dt>
            <dd>
              Contact: {submission.permissionToContact ? 'Yes' : 'No'} · Publish:{' '}
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
            Review and clean up the content below before it goes live — this doesn't have to match
            the raw submission above word-for-word.
          </p>

          {publishError && (
            <div className="form-status">
              <ErrorState title="Couldn't publish" message={publishError} />
            </div>
          )}

          <form onSubmit={handlePublish}>
            <div className="field">
              <label htmlFor="publishTitle" className="field__label">
                Title
              </label>
              <input
                id="publishTitle"
                type="text"
                value={publishForm.title}
                onChange={(event) => updatePublishField('title', event.target.value)}
                disabled={publishing}
                aria-invalid={publishFieldErrors.title ? 'true' : undefined}
              />
              <FieldError message={publishFieldErrors.title} />
            </div>

            <div className="field">
              <label htmlFor="publishType" className="field__label">
                Story Type
              </label>
              <select
                id="publishType"
                value={publishForm.type}
                onChange={(event) => updatePublishField('type', event.target.value)}
                disabled={publishing}
                aria-invalid={publishFieldErrors.type ? 'true' : undefined}
              >
                <option value="">Choose a type…</option>
                {STORY_TYPE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <FieldError message={publishFieldErrors.type} />
            </div>

            <div className="field">
              <label htmlFor="publishExcerpt" className="field__label">
                Excerpt
              </label>
              <p className="field__hint">A short teaser shown on story cards.</p>
              <input
                id="publishExcerpt"
                type="text"
                value={publishForm.excerpt}
                onChange={(event) => updatePublishField('excerpt', event.target.value)}
                disabled={publishing}
              />
            </div>

            <div className="field">
              <label htmlFor="publishContent" className="field__label">
                Content
              </label>
              <textarea
                id="publishContent"
                value={publishForm.content}
                onChange={(event) => updatePublishField('content', event.target.value)}
                disabled={publishing}
                aria-invalid={publishFieldErrors.content ? 'true' : undefined}
              />
              <FieldError message={publishFieldErrors.content} />
            </div>

            <div className="field">
              <label htmlFor="publishAuthor" className="field__label">
                Byline
              </label>
              <input
                id="publishAuthor"
                type="text"
                value={publishForm.author}
                onChange={(event) => updatePublishField('author', event.target.value)}
                disabled={publishing}
              />
            </div>

            <div className="field">
              <label htmlFor="publishFeaturedImage" className="field__label">
                Featured Image URL
              </label>
              <input
                id="publishFeaturedImage"
                type="text"
                value={publishForm.featuredImage}
                onChange={(event) => updatePublishField('featuredImage', event.target.value)}
                disabled={publishing}
              />
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
              {publishing ? 'Publishing…' : 'Publish Story'}
            </button>
          </form>
        </div>
      )}
    </section>
  )
}

export default AdminStorySubmissionReview
