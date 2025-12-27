import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Clothing Tracker</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/items" className={location.pathname === '/items' ? 'active' : ''}>
              My Closet
            </Link>
            <Link to="/add" className={location.pathname === '/add' ? 'active' : ''}>
              Add Item
            </Link>
          </nav>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

