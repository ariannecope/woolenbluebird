import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__tagline">
          Connecting people through stories, making, and the healing power of
          creativity.
        </p>
        <p className="site-footer__meta">
          &copy; {new Date().getFullYear()} Woolen Bluebird
        </p>
      </div>
    </footer>
  )
}

export default Footer
