import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <BookOpen size={22} strokeWidth={2} />
            <span>System Design</span>
          </Link>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/topics" onClick={() => setMenuOpen(false)}>
              Topics
            </NavLink>
            <NavLink to="/graph" onClick={() => setMenuOpen(false)}>
              Graph
            </NavLink>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main className={`main ${location.pathname === '/graph' ? 'main-graph' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}
