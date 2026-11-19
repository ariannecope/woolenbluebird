import NewsletterSignup from './NewsletterSignup.jsx'
import './NewsletterBand.css'

function NewsletterBand() {
  return (
    <section className="newsletter-band">
      <div className="container newsletter-band__inner">
        <NewsletterSignup />
      </div>
    </section>
  )
}

export default NewsletterBand
