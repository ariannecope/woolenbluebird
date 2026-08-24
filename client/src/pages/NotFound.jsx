import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>We couldn't find the page you were looking for.</p>
      <p>
        <Link to="/">Return home</Link>
      </p>
    </section>
  )
}

export default NotFound
