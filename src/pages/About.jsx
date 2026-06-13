import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'
import { isMobile, motionFade } from '../utils/device'

const SIGNATURE_PATH =
  'M202.166 438.282L257.166 379.782L313.166 313.782C329.5 293.115 366.066 249.282 381.666 239.282C401.166 226.782 404.666 213.782 476.666 160.782C534.266 118.382 546 118.449 544.666 123.782C546.833 124.782 538.466 143.081 487.666 208.281C436.866 273.481 412.166 307.115 406.166 315.781L354.666 379.782M988.166 152.781C906.166 166.448 719.066 200.081 626.666 225.281C534.266 250.481 199.833 348.115 44.1662 393.781C31.3329 397.448 4.66619 403.881 0.666193 400.281C-4.33381 395.781 104.166 338.281 190.166 315.281C258.966 296.881 282.833 291.281 286.166 290.781C288.999 288.948 317.366 287.781 408.166 297.781C498.966 307.781 466.999 352.948 439.666 374.281L626.666 118.281M471.666 480.281C554.666 343.781 729.166 63.0812 763.166 32.2812M622.666 290.781C629.833 280.615 648.766 259.081 667.166 254.281C690.166 248.281 637.666 272.281 647.666 285.281C657.666 298.281 694.166 245.781 703.166 248.281C712.166 250.781 685.666 256.281 682.666 282.281C682.666 285.281 687.066 285.281 688.666 285.281C690.666 285.281 734.666 244.781 741.166 245.781C747.666 246.781 712.666 269.281 725.666 270.281C736.066 271.081 747.666 261.281 752.166 256.281M783.166 232.781C776.666 238.615 763.766 254.281 764.166 270.281C764.666 290.281 733.166 293.281 737.166 287.781C741.166 282.281 793.166 257.281 796.666 252.781C800.166 248.281 814.666 243.781 815.166 230.781C815.666 217.781 780.166 265.781 796.666 257.781C813.166 249.781 828.166 247.281 835.666 234.281C843.166 221.281 825.666 241.429 826.666 242.281C827.666 243.133 820.666 255.281 831.666 249.781C842.666 244.281 872.666 229.281 879.166 220.281C885.666 211.281 872.7 216.281 866.666 225.281C860.632 234.281 860.166 240.281 864.166 242.281C867.366 243.881 886.833 230.281 896.166 223.281M1065.17 0.28125C998.166 98.2812 865.666 295.981 871.666 302.781M554.166 274.281L515.166 330.281M598.166 385.281C627.499 371.448 711.966 339.681 815.166 323.281'

const TIMELINE = [
  {
    date: 'Feb 2023 — Present',
    role: 'Web Developer',
    company: 'Freelance',
    color: '#FCA311',
    bullets: [
      'Led end-to-end development of web apps, delivering on time across all milestones',
      'Designed and implemented APIs, reducing load times by 25% and boosting engagement 15%',
      'Built interfaces increasing user satisfaction 20% and conversion rates 10%',
    ],
  },
  {
    date: 'Aug 2023 — Jul 2024',
    role: 'Product Owner',
    company: 'White Stork',
    color: '#818cf8',
    bullets: [
      'Led product roadmap and backlog prioritisation using Agile methodologies',
      'Conducted QA, analysed user feedback, and wrote detailed user stories',
      'Coordinated cross-functional teams and facilitated all sprint ceremonies',
    ],
  },
]

const STATS = [
  { value: '2+',  label: 'Years Experience' },
  { value: '15+', label: 'Projects Completed' },
  { value: '8+',  label: 'Technologies' },
  { value: '95%', label: 'Client Satisfaction' },
]


const About = () => {
  const signaturePathRef = useRef(null)
  const signatureSvgRef = useRef(null)

  useEffect(() => {
    const path = signaturePathRef.current
    const svg = signatureSvgRef.current
    if (!path || !svg) return

    if (isMobile()) {
      svg.style.opacity = '0.35'
      path.style.strokeDashoffset = '0'
      return
    }

    const pathLength = path.getTotalLength()
    path.style.strokeDasharray = `${pathLength}`
    path.style.strokeDashoffset = `${pathLength}`
    gsap.set(svg, { opacity: 0 })

    let tl
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          tl = gsap.timeline({ delay: 0.2 })
          tl.to(svg, { opacity: 0.5, duration: 0.5, ease: 'power2.out' })
          tl.to(path, {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: 'power1.inOut',
            onUpdate() {
              const progress = this.progress()
              if (progress > 0.2 && progress < 0.6) {
                path.style.strokeWidth = '3.5'
              } else if (progress > 0.6 && progress < 0.9) {
                path.style.strokeWidth = '3.2'
              } else {
                path.style.strokeWidth = '3'
              }
            },
            onComplete() {
              gsap.to(path, {
                strokeWidth: '3',
                filter: 'drop-shadow(0 4px 16px rgba(252, 163, 17, 0.3))',
                duration: 0.5,
                ease: 'power2.out',
              })
            },
          })
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(svg)

    return () => { observer.disconnect(); tl?.kill() }
  }, [])

  return (
    <section id="about" className="page-content ab-section">
      <style>{`
        .ab-section { overflow-x: hidden; width: 100%; }
        .ab-page { max-width: 70rem; margin: 0 auto; padding: 4.5rem 1.5rem 6rem; box-sizing: border-box; }
        @media (min-width: 640px) { .ab-page { padding: 5.5rem 2rem 7rem; } }
        @media (max-width: 639px) {
          .ab-page { padding: 2.75rem 1rem 4rem; }
          .ab-hero { margin-bottom: 2rem; }
          .ab-hero-stage .signature-background-wrapper { width: 100%; max-width: 100%; }
          .ab-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .ab-stat {
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.07);
          }
          .ab-stat:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.07); }
          .ab-stat:nth-last-child(-n+2) { border-bottom: none; }
          .ab-tl-card-top { flex-direction: column; align-items: flex-start; }
          .ab-tl-card-date { white-space: normal; }
        }

        /* Hero — match Contact / Services header size & placement */
        .ab-hero { text-align: center; margin-bottom: 4rem; position: relative; }
        .ab-hero-stage { position: relative; display: inline-block; width: 100%; }
        .ab-hero-stage .signature-background-wrapper {
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          transform: translate(-50%, -50%);
          width: min(920px, 130%);
          height: clamp(120px, 22vw, 200px);
        }
        .ab-hero-stage .signature-background {
          width: 100%;
          height: 100%;
          max-width: none;
        }
        .ab-hero-content { position: relative; z-index: 1; }
        .ab-eyebrow {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: #FCA311; padding: 0.3rem 0.85rem;
          border: 1px solid rgba(252,163,17,0.25); border-radius: 999px;
          background: rgba(252,163,17,0.06); margin-bottom: 1.1rem;
        }
        .ab-title {
          font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 800; color: #fff;
          letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 0;
        }
        .ab-title span {
          background: linear-gradient(90deg, #FCA311 0%, #ffd270 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* Layout */
        .ab-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) { .ab-grid { grid-template-columns: 1fr 320px; gap: 2.5rem; } }

        /* ── Intro card ── */
        .ab-intro-card {
          border: 1px solid rgba(255,255,255,0.07); border-radius: 18px;
          padding: 2rem; margin-bottom: 1.5rem;
          background: rgba(255,255,255,0.02);
          position: relative; overflow: hidden;
        }
        .ab-intro-card::before {
          content: '';
          position: absolute; top: -40%; right: -15%;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(252,163,17,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .ab-intro-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 0.85rem; }
        .ab-intro-text { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.8; }
        .ab-intro-text + .ab-intro-text { margin-top: 0.85rem; }

        /* ── Stats strip ── */
        .ab-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 14px;
          overflow: hidden; margin-bottom: 1.5rem; background: rgba(255,255,255,0.07);
        }
        .ab-stat {
          padding: 1rem 0.75rem; text-align: center;
          background: rgba(6,6,8,0.98); border-right: 1px solid rgba(255,255,255,0.07);
          transition: background 0.2s;
        }
        .ab-stat:last-child { border-right: none; }
        .ab-stat:hover { background: rgba(252,163,17,0.04); }
        .ab-stat-val { font-size: 1.45rem; font-weight: 800; color: #FCA311; line-height: 1.1; margin-bottom: 0.25rem; }
        .ab-stat-label { font-size: 0.62rem; font-weight: 600; color: rgba(255,255,255,0.28); letter-spacing: 0.06em; text-transform: uppercase; }

        /* ── Timeline ── */
        .ab-tl-section { margin-bottom: 1.5rem; }
        .ab-tl-section-label {
          display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.5rem;
        }
        .ab-tl-section-dot { width: 7px; height: 7px; border-radius: 50%; background: #FCA311; flex-shrink: 0; }
        .ab-tl-section-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.28); }

        .ab-tl-track { position: relative; padding-left: 2rem; }
        .ab-tl-line {
          position: absolute; left: 7px; top: 8px; bottom: 8px;
          width: 1px;
          background: linear-gradient(to bottom, rgba(252,163,17,0.4) 0%, rgba(255,255,255,0.06) 100%);
        }

        .ab-tl-entry { position: relative; padding-bottom: 2rem; }
        .ab-tl-entry:last-child { padding-bottom: 0; }

        /* Node on the line */
        .ab-tl-node {
          position: absolute;
          left: -2rem;
          top: 2px;
          width: 15px; height: 15px;
          border-radius: 50%;
          border: 2px solid;
          display: flex; align-items: center; justify-content: center;
          background: rgba(6,6,8,1);
          z-index: 1;
        }
        .ab-tl-node-inner {
          width: 5px; height: 5px; border-radius: 50%;
        }

        /* Card */
        .ab-tl-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .ab-tl-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 0% 50%, var(--tl-color-glow) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s; pointer-events: none;
        }
        .ab-tl-card:hover { border-color: rgba(255,255,255,0.12); }
        .ab-tl-card:hover::before { opacity: 1; }

        .ab-tl-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
        .ab-tl-card-date {
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 0.2rem 0.6rem;
          border-radius: 999px; border: 1px solid; white-space: nowrap;
        }
        .ab-tl-card-role { font-size: 1rem; font-weight: 800; color: rgba(255,255,255,0.9); margin-bottom: 0.15rem; }
        .ab-tl-card-company { font-size: 0.78rem; color: rgba(255,255,255,0.38); }
        .ab-tl-card-bullets { display: flex; flex-direction: column; gap: 0.45rem; margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .ab-tl-bullet {
          display: flex; align-items: flex-start; gap: 0.6rem;
          font-size: 0.78rem; color: rgba(255,255,255,0.42); line-height: 1.6;
        }
        .ab-tl-bullet-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 0.45rem; }

        /* ── Sidebar ── */
        .ab-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
        .ab-side-card {
          border: 1px solid rgba(255,255,255,0.07); border-radius: 18px;
          padding: 1.5rem; background: rgba(255,255,255,0.02);
        }
        .ab-side-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 1.1rem; }

        /* Contact rows */
        .ab-contact-row { display: flex; align-items: center; gap: 0.85rem; padding: 0.55rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ab-contact-row:last-child { border-bottom: none; }
        .ab-contact-ico { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(252,163,17,0.08); border: 1px solid rgba(252,163,17,0.15); color: #FCA311; }
        .ab-contact-lbl { font-size: 0.6rem; color: rgba(255,255,255,0.28); text-transform: uppercase; letter-spacing: 0.06em; }
        .ab-contact-val { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.75); }

        /* Education */
        .ab-edu-item { display: flex; align-items: flex-start; gap: 0.85rem; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ab-edu-item:last-child { border-bottom: none; }
        .ab-edu-ico { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.2); color: #818cf8; }
        .ab-edu-degree { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.8); margin-bottom: 0.15rem; }
        .ab-edu-school { font-size: 0.72rem; color: rgba(255,255,255,0.35); }
        .ab-edu-date { font-size: 0.6rem; color: #FCA311; font-weight: 600; margin-top: 0.15rem; letter-spacing: 0.04em; }

        /* CV button */
        .ab-cv-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          width: 100%; padding: 0.75rem 1.25rem; border-radius: 11px;
          background: #FCA311; color: #000;
          font-size: 0.85rem; font-weight: 700; letter-spacing: 0.02em;
          text-decoration: none; transition: background 0.2s, transform 0.15s;
          border: none; cursor: pointer;
        }
        .ab-cv-btn:hover { background: #ffb733; transform: translateY(-1px); }

        /* Availability */
        .ab-avail { display: flex; align-items: center; gap: 0.75rem; }
        .ab-avail-dot { width: 9px; height: 9px; border-radius: 50%; background: #4ade80; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(74,222,128,0.15); animation: pulse-g 2s infinite; }
        @keyframes pulse-g { 0%,100%{ box-shadow:0 0 0 3px rgba(74,222,128,0.15);} 50%{ box-shadow:0 0 0 6px rgba(74,222,128,0.06);} }
        .ab-avail-text { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.7); }
        .ab-avail-sub { font-size: 0.7rem; color: rgba(255,255,255,0.3); margin-top: 0.1rem; }
      `}</style>

      <div className="ab-page">
        {/* Hero */}
        <div className="ab-hero">
          <div className="ab-hero-stage">
            <div className="signature-background-wrapper" aria-hidden="true">
              <svg
                ref={signatureSvgRef}
                id="about-signature-svg"
                className="signature-svg signature-background"
                viewBox="0 0 1066 481"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
            <path 
              ref={signaturePathRef}
              id="about-signature-path"
                  d={SIGNATURE_PATH}
              stroke="#FCA311"
              strokeWidth="30"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              shapeRendering="crispEdges"
            />
          </svg>
        </div>

            <div className="ab-hero-content">
              <motion.span className="ab-eyebrow" {...motionFade()}>
                <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                The Developer
              </motion.span>
              <motion.h1 className="ab-title" {...motionFade(0.08, 18)}>
                About <span>Me</span>
              </motion.h1>
            </div>
          </div>
        </div>

        <div className="ab-grid">
          {/* ── Main column ── */}
          <motion.div {...motionFade(0.18, 20)}>

            {/* Intro */}
            <div className="ab-intro-card">
              <p className="ab-intro-label">Biography</p>
              <p className="ab-intro-text">
                I'm <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Ali Youssef</strong>, a frontend developer based in Berlin, Germany. My journey began during my Management Information Systems studies at Lebanese University, where I discovered my passion for building beautiful, functional user interfaces.
              </p>
              <p className="ab-intro-text">
                I graduated in February 2023 and have been freelancing since, working across full-stack development and product ownership. Each project has sharpened my belief that great development is about understanding users, solving real problems, and delivering lasting value.
                  </p>
                </div>

            {/* Stats */}
            <div className="ab-stats">
              {STATS.map((s, i) => (
                <motion.div key={s.label} className="ab-stat" {...motionFade(0.25 + i * 0.06, 10)}>
                  <div className="ab-stat-val">{s.value}</div>
                  <div className="ab-stat-label">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Timeline */}
            <div className="ab-tl-section">
              <div className="ab-tl-section-label">
                <span className="ab-tl-section-dot" />
                <span className="ab-tl-section-title">Career Timeline</span>
              </div>

              <div className="ab-tl-track">
                <div className="ab-tl-line" />

                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={i}
                    className="ab-tl-entry"
                    {...(isMobile()
                      ? { initial: false, animate: { opacity: 1, x: 0 } }
                      : {
                          initial: { opacity: 0, x: -16 },
                          animate: { opacity: 1, x: 0 },
                          transition: { duration: 0.4, delay: i * 0.12 },
                        })}
                  >
                    {/* Node */}
                    <div
                      className="ab-tl-node"
                      style={{ borderColor: item.color, boxShadow: `0 0 0 3px ${item.color}18` }}
                    >
                      <div className="ab-tl-node-inner" style={{ background: item.color }} />
                    </div>

                    {/* Card */}
                    <div
                      className="ab-tl-card"
                      style={{ '--tl-color-glow': `${item.color}0c` }}
                    >
                      <div className="ab-tl-card-top">
                        <div>
                          <p className="ab-tl-card-role">{item.role}</p>
                          <p className="ab-tl-card-company">{item.company}</p>
                        </div>
                        <span
                          className="ab-tl-card-date"
                          style={{ color: item.color, borderColor: `${item.color}35`, background: `${item.color}0f` }}
                        >
                          {item.date}
                        </span>
                      </div>

                      <div className="ab-tl-card-bullets">
                        {item.bullets.map((b, j) => (
                          <div key={j} className="ab-tl-bullet">
                            <span className="ab-tl-bullet-dot" style={{ background: item.color }} />
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>

          {/* ── Sidebar ── */}
          <motion.div className="ab-sidebar" {...motionFade(0.28, 20)}>

            {/* Contact */}
            <div className="ab-side-card">
              <p className="ab-side-title">Contact Info</p>
              <div className="ab-contact-row">
                <div className="ab-contact-ico"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                <div><p className="ab-contact-lbl">Email</p><p className="ab-contact-val">contact@aliyoussef.tech</p></div>
                    </div>
              <div className="ab-contact-row">
                <div className="ab-contact-ico"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                <div><p className="ab-contact-lbl">Phone</p><p className="ab-contact-val">+49 155 1062 8053</p></div>
                    </div>
              <div className="ab-contact-row">
                <div className="ab-contact-ico"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                <div><p className="ab-contact-lbl">Location</p><p className="ab-contact-val">Berlin, Germany</p></div>
                    </div>
                  </div>

            {/* Education */}
            <div className="ab-side-card">
              <p className="ab-side-title">Education</p>
              <div className="ab-edu-item">
                <div className="ab-edu-ico"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 9l10 6 10-6-10-6zM2 17l10 6 10-6M2 13l10 6 10-6"/></svg></div>
                    <div>
                  <p className="ab-edu-degree">B.Sc. Management Information Systems</p>
                  <p className="ab-edu-school">Lebanese University — FSEG</p>
                  <p className="ab-edu-date">Graduated Feb 2023</p>
                </div>
                  </div>
              <div className="ab-edu-item">
                <div className="ab-edu-ico"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></div>
                <div>
                  <p className="ab-edu-degree">AWS Cloud Practitioner</p>
                  <p className="ab-edu-school">Amazon Web Services</p>
                  <p className="ab-edu-date">Certified 2023</p>
                </div>
                    </div>
                  </div>

            {/* Availability */}
            <div className="ab-side-card">
              <div className="ab-avail">
                <span className="ab-avail-dot" />
                <div>
                  <p className="ab-avail-text">Available for Projects</p>
                  <p className="ab-avail-sub">Open to new opportunities</p>
                    </div>
                    </div>
                  </div>

            {/* CV Download */}
            <div className="ab-side-card" style={{ padding: '1.25rem' }}>
              <p className="ab-side-title">Resume</p>
                <motion.a 
                  href="https://res.cloudinary.com/ddlkcigaz/image/upload/fl_attachment/v1768830408/Ali_Youssef_Lebenslauf_1_escjjl.pdf"
                  download
                className="ab-cv-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Download CV
                </motion.a>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
