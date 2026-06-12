import { useRef, useState, useEffect } from 'react'

// Section IDs for each panel, in order
const SECTION_IDS = ['about', 'skills', 'services', 'projects', 'contact']

// Direction of the transition AFTER each section (to the next one):
// about → skills: horizontal, skills → services: vertical,
// services → projects: vertical, projects → contact: horizontal
const TRANSITIONS = ['horizontal', 'vertical', 'vertical', 'horizontal']

// Fixed header height the panels must stay clear of
const HEADER_OFFSET = 64

/*
  Scroll stage — pins to the viewport and converts page (vertical) scroll into
  strictly sequential phases:

    [read section 0] → [transition 0→1] → [read section 1] → [transition 1→2] → ...

  A "read" phase scrolls a section's own overflowing content (driven
  programmatically, so it can never be scrolled out of order). A section that
  fits the viewport has a read distance of 0. Only after a section is fully
  read does the next transition (horizontal or vertical slide) begin.
*/
const HorizontalScrollTrack = ({ panels }) => {
  const outerRef = useRef(null)
  const panelRefs = useRef([])
  const metricsRef = useRef({ readDist: [], transDist: [], total: 0 })
  const indicatorRef = useRef(0)
  const [indicatorIndex, setIndicatorIndex] = useState(0)
  const [stageExtra, setStageExtra] = useState(panels.length * 800)

  const n = panels.length

  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const readDist = panelRefs.current.map((p) =>
        p ? Math.max(0, p.scrollHeight - p.clientHeight) : 0
      )
      const transDist = TRANSITIONS.slice(0, n - 1).map((d) =>
        d === 'horizontal' ? vw : vh
      )
      const total =
        readDist.reduce((a, b) => a + b, 0) + transDist.reduce((a, b) => a + b, 0)
      metricsRef.current = { readDist, transDist, total }
      setStageExtra(total)
    }

    const apply = () => {
      const outer = outerRef.current
      if (!outer) return
      const { readDist, transDist, total } = metricsRef.current
      if (!total) return
      const vh = window.innerHeight
      const vw = window.innerWidth
      const scrolled = Math.max(0, Math.min(total, window.scrollY - outer.offsetTop))

      // Walk the phases to find the active section, its inner scroll position,
      // and the progress (t) of the outgoing transition if one is in flight.
      let rem = scrolled
      let active = n - 1
      let activeScroll = readDist[n - 1]
      let t = 0
      for (let i = 0; i < n; i++) {
        if (rem <= readDist[i]) {
          active = i
          activeScroll = rem
          t = 0
          break
        }
        rem -= readDist[i]
        if (i === n - 1) {
          active = i
          activeScroll = readDist[i]
          t = 0
          break
        }
        if (rem < transDist[i]) {
          active = i
          activeScroll = readDist[i]
          t = rem / transDist[i]
          break
        }
        rem -= transDist[i]
      }

      panels.forEach((_, j) => {
        const el = panelRefs.current[j]
        if (!el) return

        // Inner content position: fully read for passed sections, untouched for
        // upcoming ones, partial for the active one.
        el.scrollTop = j < active ? readDist[j] : j === active ? activeScroll : 0

        let x = 0
        let y = 0
        let visible = true
        if (j < active) {
          // Already exited along its own outgoing direction
          if (TRANSITIONS[j] === 'horizontal') x = -vw
          else y = -vh
          visible = false
        } else if (j === active) {
          if (t > 0) {
            if (TRANSITIONS[j] === 'horizontal') x = -vw * t
            else y = -vh * t
          }
        } else if (j === active + 1) {
          // Entering panel slides in along the active transition's direction
          const k = 1 - t
          if (TRANSITIONS[j - 1] === 'horizontal') x = vw * k
          else y = vh * k
          visible = t > 0
        } else {
          // Waiting offscreen at its own entrance position
          if (TRANSITIONS[j - 1] === 'horizontal') x = vw
          else y = vh
          visible = false
        }
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        el.style.visibility = visible ? 'visible' : 'hidden'
      })

      const idx = t > 0.5 ? active + 1 : active
      if (idx !== indicatorRef.current) {
        indicatorRef.current = idx
        setIndicatorIndex(idx)
      }
      window.__horizontalActiveSection = SECTION_IDS[idx] ?? ''
    }

    // Programmatic jumps used by nav links
    window.__setHorizontalPanel = (index) => {
      const outer = outerRef.current
      if (!outer) return
      const { readDist, transDist } = metricsRef.current
      const clamped = Math.max(0, Math.min(n - 1, index))
      let dist = 0
      for (let j = 0; j < clamped; j++) dist += readDist[j] + transDist[j]
      window.scrollTo({ top: outer.offsetTop + dist, behavior: 'smooth' })
    }
    window.__horizontalActiveSection = SECTION_IDS[0]

    measure()
    apply()

    const onScroll = () => apply()
    const onResize = () => {
      measure()
      apply()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    // Re-measure when panel content changes size (e.g. GitHub projects load)
    const ro = new ResizeObserver(onResize)
    panelRefs.current.forEach((p) => {
      if (p?.firstElementChild) ro.observe(p.firstElementChild)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      delete window.__setHorizontalPanel
      delete window.__horizontalActiveSection
    }
  }, [n, panels])

  // Direction of the upcoming transition, for the scroll hint arrow
  const nextDir =
    indicatorIndex < TRANSITIONS.length ? TRANSITIONS[indicatorIndex] : 'vertical'

  return (
    <div
      id="horizontal-track-section"
      ref={outerRef}
      style={{ height: `calc(100vh + ${stageExtra}px)` }}
    >
      {/* Sticky viewport — stays pinned while the user scrolls through the stage */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {panels.map((panel, i) => (
          <div
            key={i}
            ref={(el) => { panelRefs.current[i] = el }}
            style={{
              position: 'absolute',
              inset: 0,
              // Content scroll is driven programmatically — never by the wheel —
              // so a section can't be scrolled before the previous one finishes.
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: `${HEADER_OFFSET}px`,
              boxSizing: 'border-box',
              willChange: 'transform',
              visibility: i === 0 ? 'visible' : 'hidden',
              transform: i === 0 ? 'none' : 'translate3d(100vw, 0, 0)',
            }}
          >
            {/* margin auto centres short panels vertically; tall panels start at the top */}
            <div style={{ margin: 'auto 0', width: '100%' }}>
              {panel}
            </div>
          </div>
        ))}

        {/* Scroll hint — arrow points where the next transition goes */}
        <div
          style={{
            position: 'absolute',
            right: '2rem',
            bottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)',
            zIndex: 30,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          scroll
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            style={{
              transform: nextDir === 'vertical' ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.35s ease',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>

      </div>
    </div>
  )
}

export default HorizontalScrollTrack
