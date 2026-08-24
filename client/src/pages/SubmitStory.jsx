import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, submitStory } from '../lib/api.js'
import { useAsync } from '../hooks/useAsync.js'
import { ErrorState } from '../components/StatusMessage.jsx'
import FieldError from '../components/FieldError.jsx'

const SOCIAL_FIELDS = [
  { name: 'instagram', label: 'Instagram' },
  { name: 'facebook', label: 'Facebook' },
  { name: 'other', label: 'Another link' },
]

const INITIAL_FORM = {
  name: '',
  email: '',
  title: '',
  story: '',
  website: '',
  instagram: '',
  facebook: '',
  other: '',
  permissionToContact: false,
  publicationPermission: false,
}

const URL_PATTERN = /^https?:\/\/.+/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errors = {}

  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.title.trim()) errors.title = 'Please enter a title for your story.'
  if (!form.story.trim()) errors.story = 'Please share your story.'

  for (const field of ['website', 'instagram', 'facebook', 'other']) {
    const value = form[field].trim()
    if (value && !URL_PATTERN.test(value)) {
      errors[field] = 'Please include http:// or https:// at the start of the link.'
    }
  }

  // permissionToContact is optional; publicationPermission is required — a
  // submission cannot be accepted without explicit publish consent.
  if (!form.publicationPermission) {
    errors.publicationPermission = 'Please check this box to give us permission to publish your story.'
  }

  return errors
}

function SubmitStory() {
  const { data: categoriesData } = useAsync(() => getCategories(), [])
  const categories = categoriesData?.data ?? []

  const [form, setForm] = useState(INITIAL_FORM)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [generalError, setGeneralError] = useState(null)

  const isSubmitting = status === 'submitting'

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function toggleCategory(name) {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validate(form)
    setFieldErrors(errors)
    setGeneralError(null)

    if (Object.keys(errors).length > 0) {
      return
    }

    setStatus('submitting')

    const socialLinks = {}
    for (const field of SOCIAL_FIELDS) {
      const value = form[field.name].trim()
      if (value) socialLinks[field.name] = value
    }

    try {
      await submitStory({
        name: form.name.trim(),
        email: form.email.trim(),
        title: form.title.trim(),
        story: form.story.trim(),
        craftCategory: selectedCategories.length ? selectedCategories.join(', ') : undefined,
        website: form.website.trim() || undefined,
        socialLinks: Object.keys(socialLinks).length ? socialLinks : undefined,
        permissionToContact: form.permissionToContact,
        publicationPermission: form.publicationPermission,
      })
      setStatus('success')
    } catch (error) {
      setStatus('error')
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors)
      }
      setGeneralError(error.message)
    }
  }

  if (status === 'success') {
    return (
      <section className="submission-page submission-page--success">
        <h1>Thank you for sharing your story.</h1>
        <p>
          Your story has been received. Every submission is read personally — we don't publish
          automatically, and submitting doesn't guarantee publication, but we're grateful you
          trusted us with it. If we'd like to publish it, or have questions, we'll be in touch
          using the contact permission you gave us.
        </p>
        <p>
          <Link to="/made-whole">Read more stories</Link> from the Woolen Bluebird community
          while you wait, or <Link to="/">return home</Link>.
        </p>
      </section>
    )
  }

  return (
    <section className="submission-page">
      <h1>Share Your Story</h1>

      <div className="submission-page__intro">
        <p>
          Woolen Bluebird collects stories about making, creativity, healing, and connection —
          the ways that working with our hands has helped people find meaning, get through hard
          seasons, or feel a little less alone.
        </p>
        <p>
          Submitting your story does <strong>not</strong> guarantee publication. Every submission
          is reviewed personally, and only some are chosen to be shared. If we'd like to publish
          yours, have questions, or want to talk through edits together, we'll reach out — if you
          give us permission to contact you below.
        </p>
        <p>
          You retain ownership of your story. Submitting it here doesn't transfer any rights, and
          nothing is published without your explicit permission.
        </p>
      </div>

      {status === 'error' && (
        <div className="form-status">
          <ErrorState title="We couldn't submit your story" message={generalError} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <p className="submission-page__required-note">
          Fields marked <span className="field__required">*</span> are required.
        </p>

        <fieldset className="field-group">
          <legend className="field-group__legend">Your Story</legend>

          <div className="field">
            <label htmlFor="name" className="field__label">
              Your Name <span className="field__required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              aria-invalid={fieldErrors.name ? 'true' : undefined}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            />
            <FieldError id="name-error" message={fieldErrors.name} />
          </div>

          <div className="field">
            <label htmlFor="email" className="field__label">
              Your Email <span className="field__required">*</span>
            </label>
            <p className="field__hint">
              Only used to follow up about your submission — never published.
            </p>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              aria-invalid={fieldErrors.email ? 'true' : undefined}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            <FieldError id="email-error" message={fieldErrors.email} />
          </div>

          <div className="field">
            <label htmlFor="title" className="field__label">
              Story Title <span className="field__required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              aria-invalid={fieldErrors.title ? 'true' : undefined}
              aria-describedby={fieldErrors.title ? 'title-error' : undefined}
            />
            <FieldError id="title-error" message={fieldErrors.title} />
          </div>

          <div className="field">
            <label htmlFor="story" className="field__label">
              Your Story <span className="field__required">*</span>
            </label>
            <p className="field__hint">
              Tell us as much or as little as you'd like — what you make, why it matters to you,
              what it's helped you through.
            </p>
            <textarea
              id="story"
              name="story"
              value={form.story}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              aria-invalid={fieldErrors.story ? 'true' : undefined}
              aria-describedby={fieldErrors.story ? 'story-error' : undefined}
            />
            <FieldError id="story-error" message={fieldErrors.story} />
          </div>
        </fieldset>

        {categories.length > 0 && (
          <fieldset className="field-group">
            <legend className="field-group__legend">Craft &amp; Making (optional)</legend>
            <p className="field__hint">What kind of making does your story involve?</p>
            <div className="checkbox-grid">
              {categories.map((category) => (
                <label key={category.id} className="checkbox-grid__item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                    disabled={isSubmitting}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className="field-group">
          <legend className="field-group__legend">Website &amp; Social Links (optional)</legend>

          <div className="field">
            <label htmlFor="website" className="field__label">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              value={form.website}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={fieldErrors.website ? 'true' : undefined}
              aria-describedby={fieldErrors.website ? 'website-error' : undefined}
            />
            <FieldError id="website-error" message={fieldErrors.website} />
          </div>

          {SOCIAL_FIELDS.map((field) => (
            <div className="field" key={field.name}>
              <label htmlFor={field.name} className="field__label">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type="url"
                placeholder="https://"
                value={form[field.name]}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={fieldErrors[field.name] ? 'true' : undefined}
                aria-describedby={fieldErrors[field.name] ? `${field.name}-error` : undefined}
              />
              <FieldError id={`${field.name}-error`} message={fieldErrors[field.name]} />
            </div>
          ))}
        </fieldset>

        <fieldset className="field-group">
          <legend className="field-group__legend">Contact &amp; Publication</legend>

          <div className="field field--checkbox">
            <input
              id="permissionToContact"
              name="permissionToContact"
              type="checkbox"
              checked={form.permissionToContact}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <label htmlFor="permissionToContact" className="field__label">
              <strong>Contact Permission</strong> <span className="field__hint">(optional)</span>
              {' — '}You may contact me about this submission, for example with questions or to
              discuss editing.
            </label>
          </div>

          <div className="field field--checkbox">
            <input
              id="publicationPermission"
              name="publicationPermission"
              type="checkbox"
              checked={form.publicationPermission}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              aria-invalid={fieldErrors.publicationPermission ? 'true' : undefined}
              aria-describedby={
                fieldErrors.publicationPermission ? 'publicationPermission-error' : undefined
              }
            />
            <label htmlFor="publicationPermission" className="field__label">
              <strong>Publication Permission</strong> <span className="field__required">*</span>
              {' — '}I give Woolen Bluebird permission to publish my story if it's selected. I
              understand I retain ownership of my story unless we make a separate agreement.
            </label>
          </div>
          <FieldError id="publicationPermission-error" message={fieldErrors.publicationPermission} />
        </fieldset>

        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Share My Story'}
        </button>
      </form>
    </section>
  )
}

export default SubmitStory
