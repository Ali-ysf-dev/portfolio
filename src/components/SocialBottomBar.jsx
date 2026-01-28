import { useEffect, useState } from 'react'
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import './SocialBottomBar.css'

const SocialBottomBar = () => {
  const [visible, setVisible] = useState(false)
  const [bottomOffset, setBottomOffset] = useState(16)

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.hero-section')

      if (!hero) {
        // If there's no hero section on this page, keep the bar visible
        setVisible(true)
        return
      }

      const rect = hero.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2

      // Bar is hidden when the viewport center is inside the hero section
      const isViewportCenterInsideHero =
        viewportCenter >= rect.top && viewportCenter <= rect.bottom

      // So we show it only when we're outside the hero section
      setVisible(!isViewportCenterInsideHero)

      // Adjust vertical position so the bar stays 5px above the footer
      const footer = document.querySelector('footer')
      if (footer) {
        const footerRect = footer.getBoundingClientRect()
        const overlap = window.innerHeight - footerRect.top

        // When footer starts entering from the bottom, move bar up
        if (overlap > 0) {
          const desiredBottom = overlap + 40
          setBottomOffset(Math.max(16, desiredBottom))
        } else {
          setBottomOffset(16)
        }
      } else {
        setBottomOffset(16)
      }
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div
      className={`social-bottom-bar ${visible ? 'social-bottom-bar--visible' : ''}`}
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className="social-bottom-bar-content">
        <span className="social-bottom-bar-label">
          Connect with me
        </span>
        <div className="social-bottom-bar-links">
          <a
            href="https://www.linkedin.com/in/ali-youssef-a49535346/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="social-bottom-bar-link"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/Ali-ysf-dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="social-bottom-bar-link"
          >
            <FaGithub />
          </a>
          <a
            href="https://wa.me/?text=Hi%20Ali%2C%20I%27d%20like%20to%20connect%20about%20a%20project"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="social-bottom-bar-link"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </div>
  )
}

export default SocialBottomBar

