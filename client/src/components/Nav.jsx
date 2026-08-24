import { NavLink } from 'react-router-dom'
import './Nav.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/made-whole', label: 'Made Whole' },
  { to: '/makers', label: 'Maker Directory' },
  { to: '/journal', label: 'Journal' },
  { to: '/gather', label: 'Gather' },
  { to: '/about', label: 'About' },
]

function Nav() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to="/" className="site-header__brand">
          Woolen Bluebird
        </NavLink>
        <nav aria-label="Primary">
          <ul className="site-nav">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? 'site-nav__link is-active' : 'site-nav__link'
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Nav
