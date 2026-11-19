import { useState } from 'react'
import { subscribeToNewsletter } from '../lib/api.js'
import FieldError from './FieldError.jsx'
import './NewsletterSignup.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [message, setMessage] = useState(null)

  const isSubmitting = status === 'submitting'

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmed = email.trim()
    if (!trimmed) {
      setFieldError('Please enter your email address.')
      return
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setFieldError('Please enter a valid email address.')
      return
    }

    setFieldError(null)
    setStatus('submitting')

    try {
      const result = await subscribeToNewsletter(trimmed)
      setMessage(result?.data?.message ?? 'Thanks for signing up.')
      setStatus('success')
      setEmail('')
    } catch (error) {
      setMessage(error.fieldErrors?.email ?? error.message ?? 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="newsletter-signup newsletter-signup--done">
        <p className="newsletter-signup__success" role="status">
          {message}
        </p>
      </div>
    )
  }

  return (
    <form className="newsletter-signup" onSubmit={handleSubmit} noValidate>
      <p className="newsletter-signup__heading">Stay connected</p>
      <p className="newsletter-signup__blurb">
        Sign up to receive occasional Woolen Bluebird emails. You can
        unsubscribe at any time.
      </p>
      <div className="newsletter-signup__row">
        <label htmlFor="newsletter-email" className="newsletter-signup__label">
          Email address
        </label>
        <div className="newsletter-signup__field-group">
          <input
            id="newsletter-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-invalid={fieldError ? 'true' : undefined}
            aria-describedby={fieldError ? 'newsletter-email-error' : undefined}
            className="newsletter-signup__input"
          />
          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing up…' : 'Sign up'}
          </button>
        </div>
        <FieldError id="newsletter-email-error" message={fieldError} />
        {status === 'error' && (
          <p className="newsletter-signup__error" role="alert">
            {message}
          </p>
        )}
      </div>
    </form>
  )
}

export default NewsletterSignup
