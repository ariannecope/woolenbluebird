import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, submitMaker } from '../lib/api.js'
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
  location: '',
  description: '',
  website: '',
  instagram: '',
  facebook: '',
  other: '',
  workshopInformation: '',
  recommendationReason: '',
  permissionToContact: false,
  publicationPermission: false,
}

const URL_PATTERN = /^https?:\/\/.+/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form, selectedCategories) {
  const errors = {}

  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.location.trim()) errors.location = 'Please enter your location.'
  if (!form.description.trim()) errors.description = 'Please share a short bio or description.'
  if (selectedCategories.length === 0) {
    errors.craftCategory = 'Please choose at least one craft or making category.'
  }

  for (const field of ['website', 'instagram', 'facebook', 'other']) {
    const value = form[field].trim()
    if (value && !URL_PATTERN.test(value)) {
      errors[field] = 'Please include http:// or https:// at the start of the link.'
    }
  }

  // permissionToContact is optional; publicationPermission (listing
  // permission) is required — a submission cannot be accepted without it.
  if (!form.publicationPermission) {
    errors.publicationPermission =
      'Please check this box to give us permission to list you in the directory.'
  }

  return errors
}

function SubmitMaker() {
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

    const errors = validate(form, selectedCategories)
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
      await submitMaker({
        name: form.name.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        craftCategory: selectedCategories.join(', '),
        website: form.website.trim() || undefined,
        socialLinks: Object.keys(socialLinks).length ? socialLinks : undefined,
        workshopInformation: form.workshopInformation.trim() || undefined,
        recommendationReason: form.recommendationReason.trim() || undefined,
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
        <h1>Thank you for reaching out.</h1>
        <p>
          Your information has been received and will be reviewed by Woolen Bluebird. We don't
          add anyone to the directory automatically — every submission is read personally, and
          we'll be in touch if we have questions or if you're accepted, so long as you gave us
          permission to contact you.
        </p>
        <p>
          <Link to="/makers">Explore the Maker Directory</Link> while you wait, or{' '}
          <Link to="/">return home</Link>.
        </p>
      </section>
    )
  }

  return (
    <section className="submission-page">
      <h1>Join the Maker Directory</h1>

      <div className="submission-page__intro">
        <p>
          Woolen Bluebird is building a directory to help people find makers, teachers, local
          creative communities, workshops, and people who share our values around making. It's
          meant to feel like an invitation into a community, not a business listing.
        </p>
        <p>
          Are you a maker, teacher, or creative community? Tell us about yourself. Submitting
          doesn't guarantee inclusion — every submission is reviewed personally before anything
          appears in the public directory.
        </p>
        <p>
          If you're accepted, only the information you agree to share below will be published,
          and you can always ask us to update or remove your listing later.
        </p>
      </div>

      {status === 'error' && (
        <div className="form-status">
          <ErrorState title="We couldn't submit your information" message={generalError} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <p className="submission-page__required-note">
          Fields marked <span className="field__required">*</span> are required.
        </p>

        <fieldset className="field-group">
          <legend className="field-group__legend">About You</legend>

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
              Only used to follow up about your submission — never published without your
              permission.
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
            <label htmlFor="location" className="field__label">
              Location <span className="field__required">*</span>
            </label>
            <p className="field__hint">A city and state is plenty, e.g. "Portland, OR".</p>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="City, State"
              value={form.location}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              aria-invalid={fieldErrors.location ? 'true' : undefined}
              aria-describedby={fieldErrors.location ? 'location-error' : undefined}
            />
            <FieldError id="location-error" message={fieldErrors.location} />
          </div>

          <div className="field">
            <label htmlFor="description" className="field__label">
              Short Bio / Description <span className="field__required">*</span>
            </label>
            <p className="field__hint">
              What do you make, teach, or offer? What should someone know before they reach out?
            </p>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              aria-invalid={fieldErrors.description ? 'true' : undefined}
              aria-describedby={fieldErrors.description ? 'description-error' : undefined}
            />
            <FieldError id="description-error" message={fieldErrors.description} />
          </div>
        </fieldset>

        <fieldset className="field-group">
          <legend className="field-group__legend">
            Craft &amp; Making <span className="field__required">*</span>
          </legend>
          <p className="field__hint">What kind of making does your work involve?</p>
          {categories.length > 0 && (
            <div className="checkbox-grid">
              {categories.map((category) => (
                <label key={category.id} className="checkbox-grid__item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                    disabled={isSubmitting}
                    aria-invalid={fieldErrors.craftCategory ? 'true' : undefined}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          )}
          <FieldError id="craftCategory-error" message={fieldErrors.craftCategory} />
        </fieldset>

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
          <legend className="field-group__legend">Workshops &amp; More (optional)</legend>

          <div className="field">
            <label htmlFor="workshopInformation" className="field__label">
              Workshops or Classes
            </label>
            <p className="field__hint">Do you teach or host workshops? Tell us a bit about them.</p>
            <textarea
              id="workshopInformation"
              name="workshopInformation"
              value={form.workshopInformation}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="field">
            <label htmlFor="recommendationReason" className="field__label">
              Anything Else You'd Like Us to Know?
            </label>
            <textarea
              id="recommendationReason"
              name="recommendationReason"
              value={form.recommendationReason}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </fieldset>

        <fieldset className="field-group">
          <legend className="field-group__legend">Contact &amp; Listing</legend>

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
              {' — '}You may contact me about this submission, for example with questions before
              making a decision.
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
              <strong>Listing Permission</strong> <span className="field__required">*</span>
              {' — '}I agree that Woolen Bluebird may publish the information I've provided here
              as part of a public Maker Directory listing if my submission is accepted.
            </label>
          </div>
          <FieldError id="publicationPermission-error" message={fieldErrors.publicationPermission} />
        </fieldset>

        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit My Information'}
        </button>
      </form>
    </section>
  )
}

export default SubmitMaker
