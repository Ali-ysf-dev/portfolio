import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AnnouncementBanner from './AnnouncementBanner'
import { scrollToSection, isSmallScreen } from '../utils/scrollNav'

const NAV_LINKS = [
  { href: '#home',     label: 'Home',     num: '01' },
  { href: '#about',    label: 'About',    num: '02' },
  { href: '#skills',   label: 'Skills',   num: '03' },
  { href: '#services', label: 'Services', num: '04' },
  { href: '#contact',  label: 'Contact',  num: '05' },
]

const SECTION_PANEL_INDICES = {
  '#about': 0,
  '#skills': 1,
  '#services': 2,
  '#projects': 3,
  '#contact': 4,
}

const Header = ({ showBanner = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    let cleanup = () => {}

    const setupActiveSection = () => {
      cleanup()

      const trackEl = document.getElementById('horizontal-track-section')
      const useStageNav = trackEl && !isSmallScreen()

      if (useStageNav) {
        let scrollRaf = 0
        let lastScrolled = window.scrollY > 32
        let lastActive = 'home'

        const onScroll = () => {
          if (scrollRaf) return
          scrollRaf = requestAnimationFrame(() => {
            scrollRaf = 0
            const nextScrolled = window.scrollY > 32
            if (nextScrolled !== lastScrolled) {
              lastScrolled = nextScrolled
              setScrolled(nextScrolled)
            }

            const offset = 80
            const trackTop = trackEl.offsetTop
            const trackScrollable = trackEl.offsetHeight - window.innerHeight
            let nextActive = 'home'

            if (window.scrollY >= trackTop - offset && window.scrollY < trackTop + trackScrollable) {
              nextActive = window.__horizontalActiveSection || 'about'
            } else if (window.scrollY >= trackTop + trackScrollable) {
              nextActive = 'contact'
            }

            if (nextActive !== lastActive) {
              lastActive = nextActive
              setActiveSection(nextActive)
            }
          })
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        cleanup = () => {
          if (scrollRaf) cancelAnimationFrame(scrollRaf)
          window.removeEventListener('scroll', onScroll)
        }
        return
      }

      const sectionIds = ['about', 'skills', 'services', 'projects', 'contact']
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          if (visible[0]?.target?.id) {
            setActiveSection(visible[0].target.id)
          }
        },
        { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.5] }
      )

      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })

      let scrollRaf = 0
      let lastScrolled = window.scrollY > 32

      const onScroll = () => {
        if (scrollRaf) return
        scrollRaf = requestAnimationFrame(() => {
          scrollRaf = 0
          const nextScrolled = window.scrollY > 32
          if (nextScrolled !== lastScrolled) {
            lastScrolled = nextScrolled
            setScrolled(nextScrolled)
          }
          if (window.scrollY < 180) setActiveSection('home')
        })
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      cleanup = () => {
        if (scrollRaf) cancelAnimationFrame(scrollRaf)
        observer.disconnect()
        window.removeEventListener('scroll', onScroll)
      }
    }

    setupActiveSection()
    window.addEventListener('resize', setupActiveSection, { passive: true })

    return () => {
      window.removeEventListener('resize', setupActiveSection)
      cleanup()
    }
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const isActive = (href) => `#${activeSection}` === href

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    const id = href.replace('#', '')
    const panelIndex = SECTION_PANEL_INDICES[href]
    if (panelIndex !== undefined) {
      scrollToSection(id, panelIndex)
      return
    }

    scrollToSection('home', 0)
  }

  return (
    <>
      {showBanner && <AnnouncementBanner />}

      <style>{`
        .hdr-desktop-nav .nav-link {
          display: inline-block;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .hdr-desktop-nav .nav-link:hover {
          transform: translateY(-2px);
        }
        .hdr-logo {
          font-family: 'Poppins', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          text-decoration: none;
          line-height: 1;
        }
        .hdr-logo-name { color: #ffffff; }
        .hdr-logo-dot  { color: #FCA311; }

        .hdr-desktop-nav { display: none; }
        .hdr-mobile-btn  { display: flex !important; }
        .hdr-mobile-placeholder { display: none; }

        @media (min-width: 768px) {
          .hdr-desktop-nav {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
          .hdr-mobile-btn { display: none !important; }
          .hdr-nav-inner  { position: relative; }
          .hdr-mobile-placeholder { display: block; }
        }
      `}</style>

      <header
        className={`sticky top-0 w-full liquid-glass-navbar${scrolled ? ' scrolled' : ''} transition-all duration-300`}
        style={{ zIndex: mobileMenuOpen ? 110 : 50 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hdr-nav-inner flex items-center justify-between h-16">

            {/* Logo */}
            <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
              <a href="#home" className="hdr-logo" onClick={(e) => handleNavClick(e, '#home')}>
                <span className="hdr-logo-name">Ali</span><span className="hdr-logo-dot"> .</span>
              </a>
            </div>

            {/* Desktop nav — absolutely centred */}
            <div className="hdr-desktop-nav">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`nav-link text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium relative ${isActive(link.href) ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right spacer on desktop so logo stays left / links stay centred */}
            <div style={{ flexShrink: 0, width: 36 }} aria-hidden="true" className="hdr-mobile-placeholder" />

            {/* Mobile menu button */}
            <button
              className="hdr-mobile-btn relative focus:outline-none"
              style={{ width: 36, height: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'block', width: 22, height: 2, borderRadius: 2, background: mobileMenuOpen ? '#FCA311' : 'rgba(255,255,255,0.75)', transformOrigin: 'center' }}
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'block', width: 22, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.75)' }}
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'block', width: 22, height: 2, borderRadius: 2, background: mobileMenuOpen ? '#FCA311' : 'rgba(255,255,255,0.75)', transformOrigin: 'center' }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(6,6,6,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              padding: '6rem 2rem 3rem',
              overflow: 'hidden',
            }}
          >
            {/* Ambient orb */}
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-15%',
              width: 380,
              height: 380,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(252,163,17,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '5%',
              left: '-10%',
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(252,163,17,0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Nav links */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.25rem' }}>
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.1rem',
                      padding: '1rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      textDecoration: 'none',
                      position: 'relative',
                    }}
                  >
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: isActive(link.href) ? '#FCA311' : 'rgba(255,255,255,0.2)',
                      width: '1.8rem',
                      flexShrink: 0,
                    }}>
                      {link.num}
                    </span>
                    <span style={{
                      fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      color: isActive(link.href) ? '#FCA311' : 'rgba(255,255,255,0.85)',
                      transition: 'color 0.2s',
                    }}>
                      {link.label}
                    </span>
                    {isActive(link.href) && (
                      <motion.span
                        layoutId="mobile-active-dot"
                        style={{
                          marginLeft: 'auto',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#FCA311',
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </a>
                </motion.div>
              ))}
            </nav>

            {/* Footer inside drawer */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem' }}
            >
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
                ALI YOUSSEF · PORTFOLIO
              </span>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                style={{
                  fontSize: '0.72rem',
                  color: '#FCA311',
                  textDecoration: 'none',
                  padding: '0.35rem 0.8rem',
                  border: '1px solid rgba(252,163,17,0.3)',
                  borderRadius: '999px',
                  letterSpacing: '0.04em',
                  fontWeight: 600,
                }}
              >
                Get in touch →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
