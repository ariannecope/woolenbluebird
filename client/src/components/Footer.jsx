import { Link } from 'react-router-dom'
import NewsletterSignup from './NewsletterSignup.jsx'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__about">
          <p className="site-footer__tagline">
            Connecting people through stories, making, and the healing power
            of creativity.
          </p>
          <p className="site-footer__meta">
            &copy; {new Date().getFullYear()} Woolen Bluebird
          </p>
          <Link to="/admin/login" className="site-footer__admin-link">
            Admin
          </Link>
        </div>
        <NewsletterSignup />
      </div>
    </footer>
  )
}

export default Footer
