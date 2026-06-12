import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SERVICES = [
  {
    num: '01',
    title: 'Web Development',
    sub: 'Modern & Responsive',
    color: '#818cf8',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>
    ),
    desc: 'Stunning, responsive web apps using the latest technologies — from landing pages to complex full-stack applications that perform beautifully on every device.',
    features: ['React.js & Next.js', 'Responsive / Mobile-First', 'Performance Optimization', 'SEO & Accessibility'],
    tags: ['React', 'Next.js', 'Tailwind', 'TypeScript'],
  },
  {
    num: '02',
    title: 'AI Workflow Automations',
    sub: 'Smart & Efficient',
    color: '#34d399',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
    desc: 'Leverage AI to automate business processes — from intelligent chatbots to data pipelines that save time, cut costs, and boost efficiency across your entire workflow.',
    features: ['Custom AI Chatbots', 'Process Automation', 'Data Analysis & Insights', 'System Integration'],
    tags: ['OpenAI', 'Python', 'FastAPI', 'n8n'],
  },
  {
    num: '03',
    title: 'Desktop Applications',
    sub: 'Cross-Platform',
    color: '#FCA311',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    desc: 'Powerful desktop apps running smoothly on Windows, macOS and Linux using modern web technologies with native system integration and offline capabilities.',
    features: ['Electron Applications', 'Cross-Platform', 'Native System Integration', 'Offline Functionality'],
    tags: ['Electron', 'Node.js', 'React', 'SQLite'],
  },
  {
    num: '04',
    title: 'Sales Funnels',
    sub: 'High Converting',
    color: '#f472b6',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>
    ),
    desc: 'High-converting sales funnels that turn visitors into customers — seamless landing pages, checkout flows, and analytics to maximise every conversion opportunity.',
    features: ['Landing Page Optimization', 'Payment Integration', 'A/B Testing Setup', 'Analytics & Tracking'],
    tags: ['Stripe', 'Analytics', 'A/B Testing', 'CRO'],
  },
]


const Services = () => {
  const [active, setActive] = useState(0)
  const svc = SERVICES[active]

  return (
    <section id="services" className="page-content">
      <style>{`
        .sv-page { max-width: 68rem; margin: 0 auto; padding: 4.5rem 1.5rem 6rem; }
        @media (min-width: 640px) { .sv-page { padding: 5.5rem 2rem 7rem; } }

        /* Hero */
        .sv-hero { text-align: center; margin-bottom: 4rem; }
        .sv-eyebrow {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: #FCA311; padding: 0.3rem 0.85rem;
          border: 1px solid rgba(252,163,17,0.25); border-radius: 999px;
          background: rgba(252,163,17,0.06); margin-bottom: 1.1rem;
        }
        .sv-title {
          font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800; color: #fff;
          letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 0.85rem;
        }
        .sv-title span {
          background: linear-gradient(90deg, #FCA311 0%, #ffd270 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sv-subtitle { font-size: 0.95rem; color: rgba(255,255,255,0.45); max-width: 500px; margin: 0 auto; line-height: 1.7; }

        /* ── Split panel ── */
        .sv-panel {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 3.5rem;
        }
        @media (min-width: 768px) { .sv-panel { grid-template-columns: 240px 1fr; } }
        @media (min-width: 1024px) { .sv-panel { grid-template-columns: 280px 1fr; } }

        /* List column */
        .sv-list {
          border-right: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          display: flex; flex-direction: column;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        @media (min-width: 768px) { .sv-list { border-bottom: none; } }

        .sv-list-item {
          position: relative;
          display: flex; align-items: center; gap: 0.85rem;
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: background 0.18s;
          background: transparent;
          border-left: none;
          text-align: left;
          width: 100%;
        }
        .sv-list-item:last-child { border-bottom: none; }
        .sv-list-item:hover:not(.active-item) { background: rgba(255,255,255,0.025); }
        .sv-list-item.active-item { background: rgba(255,255,255,0.04); }

        .sv-list-indicator {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          border-radius: 0 2px 2px 0;
          transition: background 0.2s;
        }
        .sv-list-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .sv-list-text { min-width: 0; }
        .sv-list-num { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.22); margin-bottom: 0.1rem; }
        .sv-list-label { font-size: 0.82rem; font-weight: 700; color: rgba(255,255,255,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sv-list-item.active-item .sv-list-label { color: #fff; }

        /* Detail column */
        .sv-detail {
          position: relative;
          padding: 2.25rem 2rem;
          background: rgba(6,6,8,0.98);
          min-height: 360px;
          overflow: hidden;
        }
        .sv-detail-bg {
          position: absolute;
          top: -40%;
          right: -15%;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          pointer-events: none;
          transition: background 0.4s;
        }

        .sv-detail-top { display: flex; align-items: flex-start; gap: 1.1rem; margin-bottom: 1.5rem; position: relative; z-index: 1; }
        .sv-detail-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sv-detail-sub { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.25rem; }
        .sv-detail-title { font-size: clamp(1.2rem, 2.5vw, 1.55rem); font-weight: 800; color: #fff; letter-spacing: -0.01em; line-height: 1.2; }

        .sv-detail-desc { font-size: 0.88rem; color: rgba(255,255,255,0.45); line-height: 1.75; margin-bottom: 1.75rem; position: relative; z-index: 1; max-width: 520px; }

        .sv-detail-bottom { display: flex; flex-direction: column; gap: 1.25rem; position: relative; z-index: 1; }
        @media (min-width: 640px) { .sv-detail-bottom { flex-direction: row; align-items: flex-start; gap: 2.5rem; } }

        .sv-features { display: flex; flex-direction: column; gap: 0.5rem; }
        .sv-feat { display: flex; align-items: center; gap: 0.6rem; font-size: 0.82rem; color: rgba(255,255,255,0.6); }
        .sv-feat-check { width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .sv-tags-wrap { display: flex; flex-wrap: wrap; gap: 0.4rem; align-content: flex-start; }
        .sv-tag {
          font-size: 0.65rem; font-weight: 600; padding: 0.2rem 0.55rem;
          border-radius: 999px; border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.04);
          letter-spacing: 0.04em;
        }

        /* CTA */
        .sv-cta {
          text-align: center; padding: 2.5rem 2rem;
          border: 1px solid rgba(252,163,17,0.12); border-radius: 20px;
          background: rgba(252,163,17,0.03); position: relative; overflow: hidden;
        }
        .sv-cta::before {
          content: ''; position: absolute; top: -60%; left: 50%; transform: translateX(-50%);
          width: 400px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(252,163,17,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .sv-cta-title { font-size: clamp(1.3rem, 3vw, 1.8rem); font-weight: 800; color: #fff; margin-bottom: 0.55rem; letter-spacing: -0.01em; }
        .sv-cta-sub { font-size: 0.88rem; color: rgba(255,255,255,0.38); max-width: 400px; margin: 0 auto 1.6rem; line-height: 1.65; }
        .sv-cta-btns { display: flex; align-items: center; justify-content: center; gap: 0.8rem; flex-wrap: wrap; }
        .sv-btn-primary {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.68rem 1.4rem; border-radius: 10px;
          background: #FCA311; color: #000;
          font-size: 0.84rem; font-weight: 700; letter-spacing: 0.02em;
          text-decoration: none; transition: background 0.2s, transform 0.15s;
        }
        .sv-btn-primary:hover { background: #ffb733; transform: translateY(-1px); }
        .sv-btn-secondary {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.68rem 1.4rem; border-radius: 10px;
          background: transparent; color: rgba(255,255,255,0.55);
          font-size: 0.84rem; font-weight: 600;
          text-decoration: none; border: 1px solid rgba(255,255,255,0.12);
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .sv-btn-secondary:hover { border-color: rgba(255,255,255,0.28); color: #fff; transform: translateY(-1px); }
      `}</style>

      <div className="sv-page">
        {/* Hero */}
        <div className="sv-hero">
          <motion.span className="sv-eyebrow" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            What I Offer
          </motion.span>
          <motion.h1 className="sv-title" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.08 }}>
            My <span>Services</span>
          </motion.h1>
          <motion.p className="sv-subtitle" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.16 }}>
            From web apps to AI automations — comprehensive development solutions to bring your ideas to life.
          </motion.p>
        </div>

        {/* ── Split panel ── */}
        <motion.div className="sv-panel" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.22 }}>
          {/* Left: list */}
          <div className="sv-list">
            {SERVICES.map((s, i) => (
              <button
                key={s.num}
                className={`sv-list-item${active === i ? ' active-item' : ''}`}
                onClick={() => setActive(i)}
              >
                {/* Active indicator bar */}
                <span className="sv-list-indicator" style={{ background: active === i ? s.color : 'transparent' }} />
                <div
                  className="sv-list-icon"
                  style={{
                    background: active === i ? `${s.color}18` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active === i ? `${s.color}30` : 'rgba(255,255,255,0.07)'}`,
                    color: active === i ? s.color : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {s.icon}
                </div>
                <div className="sv-list-text">
                  <p className="sv-list-num">{s.num}</p>
                  <p className="sv-list-label">{s.title}</p>
                </div>
                {active === i && (
                  <motion.svg layoutId="sv-arrow" width="14" height="14" fill="none" stroke={s.color} strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </motion.svg>
                )}
              </button>
            ))}
          </div>

          {/* Right: detail */}
          <div className="sv-detail">
            {/* Ambient background orb */}
            <div className="sv-detail-bg" style={{ background: `radial-gradient(circle, ${svc.color}0d 0%, transparent 70%)` }} />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.28 }}
              >
                <div className="sv-detail-top">
                  <div className="sv-detail-icon" style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}30`, color: svc.color }}>
                    {svc.icon}
                  </div>
                  <div>
                    <p className="sv-detail-sub" style={{ color: svc.color }}>{svc.sub}</p>
                    <h2 className="sv-detail-title">{svc.title}</h2>
                  </div>
                </div>

                <p className="sv-detail-desc">{svc.desc}</p>

                <div className="sv-detail-bottom">
                  <div className="sv-features">
                    {svc.features.map(f => (
                      <div key={f} className="sv-feat">
                        <div className="sv-feat-check" style={{ background: `${svc.color}18` }}>
                          <svg width="9" height="9" fill="none" stroke={svc.color} strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="sv-tags-wrap">
                    {svc.tags.map(t => (
                      <span key={t} className="sv-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div className="sv-cta" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <h2 className="sv-cta-title">Ready to Start Your Project?</h2>
          <p className="sv-cta-sub">Let's discuss your requirements and build something great together.</p>
          <div className="sv-cta-btns">
            <a
              href="#contact"
              className="sv-btn-primary"
              onClick={(e) => { e.preventDefault(); window.__setHorizontalPanel?.(4) }}
            >
              Get Started
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
            <a
              href="#projects"
              className="sv-btn-secondary"
              onClick={(e) => { e.preventDefault(); window.__setHorizontalPanel?.(3) }}
            >View My Work</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
