import { Outlet } from 'react-router-dom'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

function Layout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Nav />
      <main id="main-content" className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
