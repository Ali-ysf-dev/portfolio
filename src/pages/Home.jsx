import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import LogoLoop from '../components/LogoLoop'
import SocialBottomBar from '../components/SocialBottomBar'
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiJavascript, SiNodedotjs, SiGit, SiGithub } from 'react-icons/si'
import { fetchGitHubRepos } from '../utils/github'
import { scrollToSection } from '../utils/scrollNav'

const About = lazy(() => import('./About'))
const Skills = lazy(() => import('./Skills'))
const Services = lazy(() => import('./Services'))
const Contact = lazy(() => import('./Contact'))
const HorizontalScrollTrack = lazy(() => import('../components/HorizontalScrollTrack'))

const HERO_IMAGE = '/herosection.avif'

const PROJECTS_PER_PAGE = 3
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768

const Home = () => {
  const signaturePathRef = useRef(null)
  const signatureSvgRef = useRef(null)
  const signatureTimelineRef = useRef(null)

  const [isDesktop, setIsDesktop] = useState(() => !isMobile())
  const [githubProjects, setGithubProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [visibleProjectCount, setVisibleProjectCount] = useState(PROJECTS_PER_PAGE)

  // Track desktop/mobile layout mode
  useEffect(() => {
    const onResize = () => setIsDesktop(!isMobile())
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Defer GitHub fetch until the browser is idle so first paint stays fast
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const repos = await fetchGitHubRepos(15, 'updated')
        if (!cancelled) setGithubProjects(repos)
      } catch (err) {
        console.error('Failed to load GitHub projects:', err)
      } finally {
        if (!cancelled) setLoadingProjects(false)
      }
    }

    let idleId
    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(load, { timeout: 3500 })
    } else {
      idleId = window.setTimeout(load, 2000)
    }

    return () => {
      cancelled = true
      if (typeof cancelIdleCallback !== 'undefined' && typeof idleId === 'number') {
        cancelIdleCallback(idleId)
      } else {
        clearTimeout(idleId)
      }
    }
  }, [])

  useEffect(() => {
    const path = signaturePathRef.current
    const svg = signatureSvgRef.current
    if (!path || !svg) return undefined

    let cancelled = false
    let timeline

    const run = async () => {
      const { gsap } = await import('gsap')
      if (cancelled || !signaturePathRef.current || !signatureSvgRef.current) return

      const pathEl = signaturePathRef.current
      const svgEl = signatureSvgRef.current
      const pathLength = pathEl.getTotalLength()
      pathEl.style.strokeDasharray = `${pathLength}`
      pathEl.style.strokeDashoffset = `${pathLength}`

      timeline = gsap.timeline({ delay: 0.3 })
      signatureTimelineRef.current = timeline

      timeline.to(svgEl, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      timeline.to(pathEl, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: 'power1.inOut',
        onUpdate() {
          const progress = this.progress()
          if (progress > 0.2 && progress < 0.6) {
            pathEl.style.strokeWidth = '3.5'
          } else if (progress > 0.6 && progress < 0.9) {
            pathEl.style.strokeWidth = '3.2'
          } else {
            pathEl.style.strokeWidth = '3'
          }
        },
        onComplete() {
          gsap.to(pathEl, {
            strokeWidth: '3',
            filter: 'drop-shadow(0 4px 16px rgba(252, 163, 17, 0.8))',
            duration: 0.5,
            ease: 'power2.out',
          })
          gsap.to(svgEl, {
            scale: 1.02,
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          })
        },
      })
    }

    let idleId
    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(run, { timeout: 2500 })
    } else {
      idleId = window.setTimeout(run, 800)
    }

    return () => {
      cancelled = true
      if (typeof cancelIdleCallback !== 'undefined' && typeof idleId === 'number') {
        cancelIdleCallback(idleId)
      } else {
        clearTimeout(idleId)
      }
      timeline?.kill()
      signatureTimelineRef.current = null
    }
  }, [])

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        #home, #about, #skills, #services, #projects, #contact {
          scroll-margin-top: 68px;
        }

        /* Banner (2rem) + nav (4rem) overlap; hero bg extends behind navbar */
        .hero-section {
          position: relative;
          z-index: 1;
          margin-top: -4rem;
          padding-top: 4rem;
          min-height: calc(100svh - 2rem);
          height: calc(100svh - 2rem);
          overflow: hidden;
          box-sizing: border-box;
        }
        .hero-inner {
          min-height: 0;
        }
        .hero-logo-loop {
          flex-shrink: 0;
          margin-top: clamp(0.5rem, 1.5vh, 1.5rem);
        }

        @media (max-width: 1023px) {
          .hero-section-mobile {
            padding-top: 4rem !important;
            margin-top: -4rem !important;
            min-height: calc(100svh - 2rem) !important;
            height: calc(100svh - 2rem) !important;
          }
          .hero-content-grid {
            text-align: center;
            align-items: center;
            padding-top: clamp(1.25rem, 3vh, 3rem);
          }
          .hero-content-left,
          .hero-content-right {
            width: 100%;
            max-width: 100%;
          }
          .hero-eyebrow { justify-content: center; }
          .hero-desc-card { margin: 0 auto; }
          .hero-bottom {
            padding-bottom: clamp(0.75rem, 2vh, 2.5rem);
          }
          .hero-title {
            font-size: clamp(2rem, 9vw, 2.6rem);
          }
          .hero-desc {
            font-size: clamp(0.82rem, 2.8vw, 0.95rem);
            line-height: 1.6;
          }
        }

        .hero-inner {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
          max-width: 88rem;
          margin: 0 auto;
          padding: 0 clamp(1rem, 3vw, 2.5rem);
        }
        .hero-content-grid {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.25rem;
          width: 100%;
          min-height: 0;
        }
        @media (min-width: 1024px) {
          .hero-content-grid {
            display: block;
            position: relative;
            flex: 1;
            width: 100%;
            min-height: 0;
            padding-top: clamp(1.5rem, 5vh, 3.5rem);
          }
          .hero-content-left {
            max-width: min(36vw, 24rem);
            padding-bottom: clamp(2.5rem, 10vh, 7rem);
            padding-left: 1.15rem;
            border-left: 2px solid rgba(252, 163, 17, 0.35);
          }
          .hero-content-center {
            display: none;
          }
          .hero-content-right {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: min(19.5rem, 20vw);
            max-width: 20rem;
            z-index: 2;
          }
          .hero-desc-card {
            margin-left: 0;
          }
          .hero-title {
            font-size: clamp(2.15rem, 3.6vw, 3.35rem);
          }
          .hero-subtitle {
            font-size: clamp(1.05rem, 1.55vw, 1.45rem);
          }
        }
        .hero-content-center {
          display: none;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FCA311;
          margin-bottom: 1.25rem;
          padding: 0.35rem 0.85rem;
          border: 1px solid rgba(252, 163, 17, 0.25);
          border-radius: 999px;
          background: rgba(252, 163, 17, 0.06);
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #FCA311;
          animation: pulse-amber 2s ease-in-out infinite;
        }
        @keyframes pulse-amber {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.75); }
        }
        .hero-title {
          font-size: clamp(2.6rem, 5.5vw, 5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 1.8vw, 1.35rem);
          font-weight: 600;
          letter-spacing: 0.06em;
          margin-bottom: 0;
          background: linear-gradient(90deg, #FCA311 0%, #ffd270 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-desc-card {
          padding: 1.2rem 1.35rem;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(6, 6, 6, 0.42);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        @media (max-width: 1023px) {
          .hero-desc-card {
            background: transparent;
            border: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            padding: 0;
          }
        }
        .hero-desc {
          font-size: clamp(0.9rem, 1.4vw, 1.02rem);
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.62);
          max-width: none;
          margin: 0;
        }
        .hero-bottom {
          margin-top: auto;
          padding-bottom: clamp(1rem, 2.5vh, 3.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .hero-bottom-sig .signature-svg { opacity: 0; }
        .hero-hire-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 2.25rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #000;
          background: #FCA311;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 0 0 rgba(252,163,17,0);
        }
        .hero-hire-btn:hover {
          background: #ffb733;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(252,163,17,0.35);
        }

        .hero-section-bg {
          z-index: 1;
          overflow: hidden;
        }
        .hero-bg-portrait {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-color: #000000;
          overflow: hidden;
        }
        .hero-bg-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
          display: block;
        }
        .hero-bg-portrait-fade {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(to right, #000000 0%, #000000 5%, rgba(0,0,0,0.92) 14%, rgba(0,0,0,0.65) 24%, rgba(0,0,0,0.3) 38%, transparent 52%),
            linear-gradient(to left,  #000000 0%, #000000 5%, rgba(0,0,0,0.92) 14%, rgba(0,0,0,0.65) 24%, rgba(0,0,0,0.3) 38%, transparent 52%);
        }
        @media (min-width: 1024px) {
          .hero-bg-portrait-fade {
            background:
              linear-gradient(to right, #000000 0%, #000000 3%, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.72) 20%, rgba(0,0,0,0.38) 34%, transparent 50%),
              linear-gradient(to left,  #000000 0%, #000000 3%, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.72) 20%, rgba(0,0,0,0.38) 34%, transparent 50%);
          }
        }
        .section-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          margin-bottom: 4rem;
        }
        @media (min-width: 640px) { .section-header { margin-bottom: 5rem; } }
        .section-header-eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #FCA311;
        }
        .section-header-title {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0;
        }
        .section-header-line {
          width: 3rem;
          height: 2px;
          background: #FCA311;
          border-radius: 999px;
        }
        .section-header-desc {
          font-size: 1rem;
          line-height: 1.625;
          max-width: 36rem;
          margin: 0;
        }
        @media (min-width: 640px) { .section-header-desc { font-size: 1.125rem; } }

        /* Projects section */
        .project-card-modern {
          position: relative;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.45s cubic-bezier(0.16,1,0.3,1);
          display: flex;
          flex-direction: column;
          height: 100%;
          box-sizing: border-box;
        }
        .project-card-modern:hover {
          border-color: rgba(252,163,17,0.3);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(252,163,17,0.12);
        }
        .project-img-outer { padding: 0.5rem 0.5rem 0; }
        .project-img-wrap {
          position: relative;
          overflow: hidden;
          height: 120px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(252,163,17,0.12) 0%, rgba(20,20,30,1) 100%);
        }
        @media (min-width: 640px) { .project-img-wrap { height: 130px; } }
        .project-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 0.35rem;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .project-card-modern:hover .project-img-wrap img { transform: scale(1.03); }
        .project-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 0.5rem;
          gap: 0.45rem;
        }
        .project-card-modern:hover .project-img-overlay { opacity: 1; }
        .project-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.28rem 0.65rem;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .project-action-btn-primary { background: #FCA311; color: #000; }
        .project-action-btn-primary:hover { background: #ffb733; }
        .project-action-btn-ghost { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
        .project-action-btn-ghost:hover { background: rgba(255,255,255,0.2); }
        .project-card-body {
          padding: 0.65rem 0.75rem 0.75rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .project-tag {
          display: inline-flex;
          align-items: center;
          font-size: 0.58rem;
          font-weight: 500;
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
          background: rgba(252,163,17,0.1);
          color: #FCA311;
          border: 1px solid rgba(252,163,17,0.2);
          letter-spacing: 0.03em;
        }
        .project-featured-ribbon {
          position: absolute; top: 6px; left: 6px;
          display: inline-flex; align-items: center; gap: 0.2rem;
          font-size: 0.55rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 0.15rem 0.45rem;
          border-radius: 999px; background: rgba(252,163,17,0.9); color: #000;
          z-index: 10; backdrop-filter: blur(8px);
        }
        .project-stars-badge {
          position: absolute; top: 6px; right: 6px;
          display: inline-flex; align-items: center; gap: 0.2rem;
          font-size: 0.58rem; font-weight: 600; padding: 0.15rem 0.4rem;
          border-radius: 999px; background: rgba(0,0,0,0.6); color: #FCA311;
          border: 1px solid rgba(252,163,17,0.3); z-index: 10; backdrop-filter: blur(8px);
        }
        .projects-grid-wrap { width: 100%; max-width: 56rem; margin-left: auto; margin-right: auto; }
        .projects-grid {
          display: grid; width: 100%;
          grid-template-columns: minmax(0, 1fr);
          gap: 1rem; justify-items: stretch;
        }
        @media (min-width: 640px) { .projects-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; } }
        @media (min-width: 1024px) { .projects-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        .projects-load-more { display: flex; justify-content: center; margin-top: 4rem; padding-top: 1rem; }
        @media (min-width: 640px) { .projects-load-more { margin-top: 5rem; padding-top: 1.5rem; } }
      `}</style>

      {/* ── Hero Section ── */}
      <section
        id="home"
        className="hero-section hero-section-magic-rings hero-section-mobile flex flex-col px-4 sm:px-6 lg:px-8 pt-0 pb-0 relative"
        style={{ backgroundImage: 'none', backgroundColor: 'transparent' }}
      >
        <div className="hero-section-bg pointer-events-none absolute inset-0 z-[1]">
          <div className="hero-bg-portrait">
            <img
              className="hero-bg-image"
              src={HERO_IMAGE}
              alt=""
              aria-hidden="true"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
            <div className="hero-bg-portrait-fade" />
          </div>
        </div>

        <div className="hero-inner flex-1 flex flex-col">
          <div className="hero-content-grid">
            <div className="hero-content-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="hero-eyebrow">
                  <span className="hero-eyebrow-dot" />
                  Available for work
                </p>
              </motion.div>

              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.42 }}
              >
                Hi, I'm{' '}
                <span className="text-gradient">Ali Youssef</span>
              </motion.h1>

              <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.54 }}
              >
                Frontend Developer
              </motion.p>
            </div>

            <div className="hero-content-center" aria-hidden="true" />

            <div className="hero-content-right">
              <motion.div
                className="hero-desc-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.66 }}
              >
                <p className="hero-desc">
                  Highly motivated and experienced Front-end Developer seeking to build scalable and fast web applications, combined with AI tools like Vibe Coding to enhance user experience.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Bottom-center: signature + CTA */}
          <motion.div
            className="hero-bottom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            <div className="signature-wrapper hero-bottom-sig" id="signature-wrapper">
              <svg ref={signatureSvgRef} id="signature-svg" className="signature-svg signature-hero" viewBox="0 0 1066 481" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  ref={signaturePathRef}
                  id="signature-path"
                  d="M202.166 438.282L257.166 379.782L313.166 313.782C329.5 293.115 366.066 249.282 381.666 239.282C401.166 226.782 404.666 213.782 476.666 160.782C534.266 118.382 546 118.449 544.666 123.782C546.833 124.782 538.466 143.081 487.666 208.281C436.866 273.481 412.166 307.115 406.166 315.781L354.666 379.782M988.166 152.781C906.166 166.448 719.066 200.081 626.666 225.281C534.266 250.481 199.833 348.115 44.1662 393.781C31.3329 397.448 4.66619 403.881 0.666193 400.281C-4.33381 395.781 104.166 338.281 190.166 315.281C258.966 296.881 282.833 291.281 286.166 290.781C288.999 288.948 317.366 287.781 408.166 297.781C498.966 307.781 466.999 352.948 439.666 374.281L626.666 118.281M471.666 480.281C554.666 343.781 729.166 63.0812 763.166 32.2812M622.666 290.781C629.833 280.615 648.766 259.081 667.166 254.281C690.166 248.281 637.666 272.281 647.666 285.281C657.666 298.281 694.166 245.781 703.166 248.281C712.166 250.781 685.666 256.281 682.666 282.281C682.666 285.281 687.066 285.281 688.666 285.281C690.666 285.281 734.666 244.781 741.166 245.781C747.666 246.781 712.666 269.281 725.666 270.281C736.066 271.081 747.666 261.281 752.166 256.281M783.166 232.781C776.666 238.615 763.766 254.281 764.166 270.281C764.666 290.281 733.166 293.281 737.166 287.781C741.166 282.281 793.166 257.281 796.666 252.781C800.166 248.281 814.666 243.781 815.166 230.781C815.666 217.781 780.166 265.781 796.666 257.781C813.166 249.781 828.166 247.281 835.666 234.281C843.166 221.281 825.666 241.429 826.666 242.281C827.666 243.133 820.666 255.281 831.666 249.781C842.666 244.281 872.666 229.281 879.166 220.281C885.666 211.281 872.7 216.281 866.666 225.281C860.632 234.281 860.166 240.281 864.166 242.281C867.366 243.881 886.833 230.281 896.166 223.281M1065.17 0.28125C998.166 98.2812 865.666 295.981 871.666 302.781M554.166 274.281L515.166 330.281M598.166 385.281C627.499 371.448 711.966 339.681 815.166 323.281"
                  stroke="#FCA311"
                  strokeWidth="30"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  shapeRendering="crispEdges"
                />
              </svg>
            </div>

            <a
              href="#contact"
              className="hero-hire-btn"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('contact', 4)
              }}
            >
              HIRE ME NOW
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Tech Stack Logo Loop */}
        <div className="hero-logo-loop relative z-10 w-full">
          <LogoLoop
            logos={[
              { node: <SiReact />, title: 'React', href: 'https://react.dev' },
              { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
              { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
              { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
              { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org' },
              { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org' },
              { node: <SiGit />, title: 'Git', href: 'https://git-scm.com' },
              { node: <SiGithub />, title: 'GitHub', href: 'https://github.com/Ali-ysf-dev' },
            ]}
            speed={80}
            direction="left"
            logoHeight={40}
            gap={40}
            hoverSpeed={20}
            scaleOnHover
            fadeOut
            fadeOutColor="#000000"
            pauseWhenOffscreen
            ariaLabel="Technology stack"
            className="text-text-primary"
          />
        </div>
      </section>

      {isDesktop ? (
        <Suspense fallback={null}>
          <HorizontalScrollTrack panels={[
            <Suspense key="about" fallback={null}><About /></Suspense>,
            <Suspense key="skills" fallback={null}><Skills /></Suspense>,
            <Suspense key="services" fallback={null}><Services /></Suspense>,
            <ProjectsPanel
              key="projects"
              githubProjects={githubProjects}
              loadingProjects={loadingProjects}
              visibleProjectCount={visibleProjectCount}
              setVisibleProjectCount={setVisibleProjectCount}
            />,
            <Suspense key="contact" fallback={null}><Contact /></Suspense>,
          ]} />
        </Suspense>
      ) : (
        <>
          <Suspense fallback={null}><About /></Suspense>
          <Suspense fallback={null}><Skills /></Suspense>
          <Suspense fallback={null}><Services /></Suspense>
          <ProjectsPanel
            githubProjects={githubProjects}
            loadingProjects={loadingProjects}
            visibleProjectCount={visibleProjectCount}
            setVisibleProjectCount={setVisibleProjectCount}
          />
          <Suspense fallback={null}><Contact /></Suspense>
        </>
      )}

      <SocialBottomBar />
    </>
  )
}

// Projects as a standalone panel component (used inside HorizontalScrollTrack)
function ProjectsPanel({ githubProjects, loadingProjects, visibleProjectCount, setVisibleProjectCount }) {
  return (
      <section id="projects" className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background orbs */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(252,163,17,0.03)', filter: 'blur(100px)', top: '20%', left: '-10%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(252,163,17,0.03)', filter: 'blur(100px)', bottom: '10%', right: '-8%', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="section-header">
            <motion.span
              className="section-header-eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Portfolio
            </motion.span>
            <motion.h3
              className="section-header-title text-text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Featured Projects
            </motion.h3>
            <div className="section-header-line" />
            <motion.p
              className="section-header-desc text-text-secondary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              A selection of work I'm proud of — from UI-driven apps to full-stack solutions.
            </motion.p>
          </div>

          {loadingProjects ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#FCA311' }}></div>
              <p className="text-text-secondary mt-4 text-sm">Fetching projects from GitHub...</p>
            </div>
          ) : githubProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary">No projects found. Please check your GitHub username in config.js</p>
            </div>
          ) : (
            <>
              <div className="projects-grid-wrap">
                <div className="projects-grid">
                  {githubProjects.slice(0, visibleProjectCount).map((project, idx) => (
                    <motion.div
                      key={project.id}
                      className="project-card-modern"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <div className="project-img-outer">
                        <div className="project-img-wrap">
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const img = e.target
                              if (project.imageFallback && img.src !== project.imageFallback) {
                                img.src = project.imageFallback
                                return
                              }
                              img.src = 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                              img.onerror = null
                            }}
                          />
                          <div className="project-img-overlay">
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-action-btn project-action-btn-primary" onClick={(e) => e.stopPropagation()}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Live Demo
                              </a>
                            )}
                            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="project-action-btn project-action-btn-ghost" onClick={(e) => e.stopPropagation()}>
                              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                              Source
                            </a>
                          </div>
                          {project.featured && (
                            <div className="project-featured-ribbon">
                              <svg width="9" height="9" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Featured
                            </div>
                          )}
                          {project.stars > 0 && (
                            <div className="project-stars-badge">
                              <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {project.stars}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="project-card-body">
                        <div className="flex items-start justify-between gap-1.5 mb-1">
                          <h4 className="text-sm font-bold text-white leading-tight line-clamp-1">{project.title}</h4>
                          <span className="project-tag flex-shrink-0">{project.language || 'React'}</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-snug line-clamp-1 flex-1">
                          {project.shortDescription || 'A modern web application built with cutting-edge technologies.'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {visibleProjectCount < githubProjects.length && (
                <div className="projects-load-more">
                  <motion.button
                    type="button"
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                    onClick={() => setVisibleProjectCount((count) => count + PROJECTS_PER_PAGE)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Load More Projects
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
  )
}

export default Home
