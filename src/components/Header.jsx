import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import AnnouncementBanner from './AnnouncementBanner'

const Header = ({ showBanner = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navLinksRef = useRef([])

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  useEffect(() => {
    // GSAP animations for nav links
    if (typeof gsap !== 'undefined') {
      navLinksRef.current.forEach(link => {
        if (link) {
          const handleMouseEnter = () => {
            gsap.to(link, {
              y: -2,
              duration: 0.2,
              ease: "power2.out"
            })
          }
          const handleMouseLeave = () => {
            gsap.to(link, {
              y: 0,
              duration: 0.2,
              ease: "power2.out"
            })
          }
          link.addEventListener('mouseenter', handleMouseEnter)
          link.addEventListener('mouseleave', handleMouseLeave)
          return () => {
            link.removeEventListener('mouseenter', handleMouseEnter)
            link.removeEventListener('mouseleave', handleMouseLeave)
          }
        }
      })
    }
  }, [])

  // Add glass background once user scrolls past the banner
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      {showBanner && <AnnouncementBanner />}

      <header className={`sticky top-0 z-50 w-full liquid-glass-navbar${scrolled ? ' scrolled' : ''} transition-all duration-300`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Name */}
            <div className="logoimg flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-gradient">
                ALI YOUSSEF.
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  to="/"
                  ref={el => navLinksRef.current[0] = el}
                  className={`nav-link text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium relative ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  ref={el => navLinksRef.current[1] = el}
                  className={`nav-link text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium relative ${isActive('/about') ? 'active' : ''}`}
                >
                  About
                </Link>
                <Link
                  to="/skills"
                  ref={el => navLinksRef.current[2] = el}
                  className={`nav-link text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium relative ${isActive('/skills') ? 'active' : ''}`}
                >
                  Skills
                </Link>
                <Link
                  to="/services"
                  ref={el => navLinksRef.current[3] = el}
                  className={`nav-link text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium relative ${isActive('/services') ? 'active' : ''}`}
                >
                  Services
                </Link>
                <Link
                  to="/contact"
                  ref={el => navLinksRef.current[4] = el}
                  className={`nav-link text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium relative ${isActive('/contact') ? 'active' : ''}`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Theme Toggle & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-200"
                aria-label="Toggle theme"
                style={{ display: 'none' }}
              >
                <svg id="sun-icon" className={`w-5 h-5 text-text-secondary ${theme === 'dark' ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg id="moon-icon" className={`w-5 h-5 text-text-secondary ${theme === 'dark' ? '' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button
                id="mobile-menu-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div id="mobile-menu" className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-surface rounded-lg mt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`nav-link text-text-secondary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 relative ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`nav-link text-text-secondary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 relative ${isActive('/about') ? 'active' : ''}`}
              >
                About
              </Link>
              <Link
                to="/skills"
                onClick={() => setMobileMenuOpen(false)}
                className={`nav-link text-text-secondary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 relative ${isActive('/skills') ? 'active' : ''}`}
              >
                Skills
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className={`nav-link text-text-secondary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 relative ${isActive('/services') ? 'active' : ''}`}
              >
                Services
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`nav-link text-text-secondary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 relative ${isActive('/contact') ? 'active' : ''}`}
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header

