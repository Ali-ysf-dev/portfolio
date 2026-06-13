import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  const year = new Date().getFullYear()

  const navColOne = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Skills', to: '/skills' },
  ]

  const navColTwo = [
    { label: 'Services', to: '/services' },
    { label: 'Contact', to: '/contact' },
  ]

  const socials = [
    { label: 'GitHub', href: 'https://github.com/Ali-ysf-dev', icon: SiGithub },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ali-youssef-a49535346/', icon: FaLinkedin },
  ]

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="site-footer">
      <style>{`
        .site-footer {
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem 1rem;
          background:
            radial-gradient(ellipse 70% 100% at 50% 0%, rgba(252,163,17,0.08), transparent 60%),
            linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
        }
        .site-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(90%, 1000px);
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(252,163,17,0.4), transparent);
        }
        .footer-blob {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(252,163,17,0.10), transparent 70%);
          filter: blur(90px);
          bottom: -50%;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .footer-grid {
          position: relative;
          z-index: 1;
          max-width: 72rem;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr;
            gap: 1.5rem;
            align-items: start;
          }
        }
        .footer-nav-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem 2rem;
        }
        .footer-brand-name {
          font-size: 1.2rem;
          font-weight: 700;
          line-height: 1.1;
          background: linear-gradient(135deg, #FCA311 0%, #fdf882 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .footer-tagline {
          color: #94A3B8;
          font-size: 0.8rem;
          line-height: 1.45;
          max-width: 26rem;
          margin-top: 0.35rem;
        }
        .footer-heading {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #FCA311;
          margin-bottom: 0.5rem;
        }
        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #94A3B8;
          font-size: 0.82rem;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .footer-link::before {
          content: '';
          width: 0;
          height: 1px;
          background: #FCA311;
          transition: width 0.25s ease;
        }
        .footer-link:hover {
          color: #fff;
          transform: translateX(2px);
        }
        .footer-link:hover::before {
          width: 12px;
        }
        .footer-social {
          width: 2rem;
          height: 2rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .footer-social:hover {
          color: #FCA311;
          border-color: rgba(252,163,17,0.4);
          background: rgba(252,163,17,0.08);
          transform: translateY(-3px);
        }
        .footer-bottom {
          position: relative;
          z-index: 1;
          max-width: 72rem;
          margin: 1.25rem auto 0;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
        .footer-copy {
          color: #64748B;
          font-size: 0.72rem;
        }
        .footer-built {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #64748B;
          font-size: 0.72rem;
        }
        .footer-built svg { color: #FCA311; }
        .footer-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #94A3B8;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.25s ease;
        }
        .footer-top-btn:hover {
          color: #FCA311;
          border-color: rgba(252,163,17,0.4);
          background: rgba(252,163,17,0.06);
        }
      `}</style>

      <div className="footer-blob" />

      <div className="footer-grid">
        {/* Brand */}
        <div>
          <Link to="/" className="footer-brand-name">Ali Youssef</Link>
          <p className="footer-tagline">
            Frontend Developer crafting fast, accessible, and modern web experiences with a focus on clean design and great UX.
          </p>
          <div className="flex gap-2 mt-3">
            {socials.map(({ label, href, icon: SocialIcon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="footer-social"
                whileTap={{ scale: 0.92 }}
              >
                <SocialIcon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
          <a href="mailto:contact@aliyoussef.tech" className="footer-link mt-2 inline-block">
            contact@aliyoussef.tech
          </a>
        </div>

        {/* Navigation — two columns */}
        <div>
          <h4 className="footer-heading">Navigation</h4>
          <div className="footer-nav-columns">
            <ul className="flex flex-col gap-1.5">
              {navColOne.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-1.5">
              {navColTwo.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">© {year} Ali Youssef. All rights reserved.</p>
        <span className="footer-built">
          
        </span>
        <button type="button" onClick={scrollToTop} className="footer-top-btn">
          Back to top
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  )
}

export default Footer
