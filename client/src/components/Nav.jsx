import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import nestImage from '../pages/images/nest.png'
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
        <div className="site-header__brand-group">
          <img src={nestImage} alt="" className="site-header__nest" />
          <NavLink to="/" className="site-header__brand">
            Woolen Bluebird
          </NavLink>
        </div>
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
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Nav
