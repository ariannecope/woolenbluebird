import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../lib/adminApi.js'
import { useAsync } from '../hooks/useAsync.js'
import { LoadingState, ErrorState } from '../components/StatusMessage.jsx'
import FieldError from '../components/FieldError.jsx'
import './Admin.css'

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  author: 'Arianne',
  featuredImage: '',
  status: 'PUBLISHED',
}

/**
 * Handles both /admin/journal/new (no :id) and /admin/journal/:id (edit) —
 * same form either way, just seeded differently. Unlike story/maker
 * submissions, there's no separate review step: this writes straight to
 * Story (type: JOURNAL) since Arianne is the only author.
 */
function AdminJournalForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const { status, data, error } = useAsync(
    () => (isEditing ? getJournalEntry(id) : Promise.resolve(null)),
    [id],
  )
  const entry = data?.data ?? null

  // null is the "not seeded yet" sentinel for the edit path — new entries
  // start from EMPTY_FORM directly since there's nothing to fetch first.
  const [form, setForm] = useState(isEditing ? null : EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    if (entry && form === null) {
      // Deliberate one-time seed from fetched data (guarded by the
      // form === null sentinel above), same pattern as the publish form
      // in AdminStorySubmissionReview.jsx.
      // eslint-disable-next-line react/set-state-in-effect
      setForm({
        title: entry.title,
        excerpt: entry.excerpt ?? '',
        content: entry.content,
        author: entry.author ?? 'Arianne',
        featuredImage: entry.featuredImage ?? '',
        status: entry.status,
      })
    }
  }, [entry, form])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (isEditing && status === 'loading') {
    return <LoadingState label="Loading journal entry…" />
  }

  if (isEditing && status === 'error') {
    const isNotFound = error.status === 404
    return (
      <ErrorState
        title={isNotFound ? 'Journal entry not found' : "We couldn't load this entry"}
        message={error.message}
      />
    )
  }

  // Covers the one render between the fetch resolving and the effect
  // above seeding `form` from it.
  if (form === null) {
    return <LoadingState label="Loading journal entry…" />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = {}
    if (!form.title.trim()) errors.title = 'Title is required.'
    if (!form.content.trim()) errors.content = 'Content is required.'
    setFieldErrors(errors)
    setSaveError(null)

    if (Object.keys(errors).length > 0) return

    setSaving(true)

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || undefined,
      content: form.content.trim(),
      author: form.author.trim() || undefined,
      featuredImage: form.featuredImage.trim() || undefined,
      status: form.status,
    }

    try {
      if (isEditing) {
        await updateJournalEntry(id, payload)
      } else {
        await createJournalEntry(payload)
      }
      navigate('/admin/journal')
    } catch (err) {
      setSaveError(err.message)
      if (err.fieldErrors) setFieldErrors(err.fieldErrors)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${form.title}"? This can't be undone, and removes it from the public Journal page immediately if it's published.`,
    )
    if (!confirmed) return

    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteJournalEntry(id)
      navigate('/admin/journal')
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  return (
    <section>
      <p className="admin-review__back">
        <Link to="/admin/journal">← Back to Journal</Link>
      </p>

      <header className="admin-page__header">
        <h1>{isEditing ? 'Edit Journal Entry' : 'New Journal Entry'}</h1>
        {isEditing && (
          <button
            type="button"
            className="button button--danger"
            onClick={handleDelete}
            disabled={deleting || saving}
          >
            {deleting ? 'Deleting…' : 'Delete Entry'}
          </button>
        )}
      </header>

      {deleteError && (
        <div className="form-status">
          <ErrorState title="Couldn't delete" message={deleteError} />
        </div>
      )}

      {saveError && (
        <div className="form-status">
          <ErrorState title="Couldn't save" message={saveError} />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title" className="field__label">
            Title <span className="field__required">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            disabled={saving}
            aria-invalid={fieldErrors.title ? 'true' : undefined}
            aria-describedby={fieldErrors.title ? 'title-error' : undefined}
          />
          <FieldError id="title-error" message={fieldErrors.title} />
        </div>

        <div className="field">
          <label htmlFor="excerpt" className="field__label">
            Excerpt
          </label>
          <p className="field__hint">A short teaser shown wherever this entry is listed.</p>
          <input
            id="excerpt"
            type="text"
            value={form.excerpt}
            onChange={(event) => updateField('excerpt', event.target.value)}
            disabled={saving}
          />
        </div>

        <div className="field">
          <label htmlFor="content" className="field__label">
            Content <span className="field__required">*</span>
          </label>
          <textarea
            id="content"
            value={form.content}
            onChange={(event) => updateField('content', event.target.value)}
            disabled={saving}
            aria-invalid={fieldErrors.content ? 'true' : undefined}
            aria-describedby={fieldErrors.content ? 'content-error' : undefined}
          />
          <FieldError id="content-error" message={fieldErrors.content} />
        </div>

        <div className="field">
          <label htmlFor="author" className="field__label">
            Byline
          </label>
          <input
            id="author"
            type="text"
            value={form.author}
            onChange={(event) => updateField('author', event.target.value)}
            disabled={saving}
          />
        </div>

        <div className="field">
          <label htmlFor="featuredImage" className="field__label">
            Featured Image URL
          </label>
          <input
            id="featuredImage"
            type="text"
            value={form.featuredImage}
            onChange={(event) => updateField('featuredImage', event.target.value)}
            disabled={saving}
          />
        </div>

        <div className="field">
          <label htmlFor="entryStatus" className="field__label">
            Status
          </label>
          <p className="field__hint">
            Draft stays off the public Journal page until you switch this to Published.
          </p>
          <select
            id="entryStatus"
            value={form.status}
            onChange={(event) => updateField('status', event.target.value)}
            disabled={saving}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        <button type="submit" className="button button--primary" disabled={saving}>
          {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Entry'}
        </button>
      </form>
    </section>
  )
}

export default AdminJournalForm
