import { useRef, useState, useEffect } from 'react'

// Section IDs for each panel, in order
const SECTION_IDS = ['about', 'skills', 'services', 'projects', 'contact']

// Direction of the transition AFTER each section (to the next one):
// about → skills: horizontal, skills → services: vertical,
// services → projects: vertical, projects → contact: horizontal
const TRANSITIONS = ['horizontal', 'vertical', 'vertical', 'horizontal']

// Fixed header height the panels must stay clear of (nav bar; banner scrolls away)
const HEADER_OFFSET = 64

const getStageViewport = () => {
  const vv = window.visualViewport
  return {
    h: Math.round(vv?.height ?? window.innerHeight),
    w: Math.round(vv?.width ?? window.innerWidth),
  }
}

const setPanelVisible = (el, visible) => {
  // opacity (not visibility) avoids blank compositor layers on mobile Safari
  el.style.opacity = visible ? '1' : '0'
  el.style.pointerEvents = visible ? 'auto' : 'none'
  el.setAttribute('aria-hidden', visible ? 'false' : 'true')
}

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
  const stickyRef = useRef(null)
  const panelRefs = useRef([])
  const metricsRef = useRef({ readDist: [], transDist: [], total: 0 })
  const indicatorRef = useRef(0)
  const [indicatorIndex, setIndicatorIndex] = useState(0)
  const [stageExtra, setStageExtra] = useState(panels.length * 800)

  const n = panels.length

  useEffect(() => {
    const measure = () => {
      const { h: vh, w: vw } = getStageViewport()
      document.documentElement.style.setProperty('--stage-vh', `${vh}px`)
      if (stickyRef.current) stickyRef.current.style.height = `${vh}px`
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
      const { h: vh, w: vw } = getStageViewport()

      if (!total) {
        // Layout not measured yet — keep the first panel visible at rest
        panelRefs.current.forEach((el, j) => {
          if (!el) return
          el.scrollTop = 0
          if (j === 0) {
            setPanelVisible(el, true)
            el.style.transform = 'none'
            el.style.zIndex = '2'
          } else {
            setPanelVisible(el, false)
            el.style.transform = 'translate3d(100vw, 0, 0)'
            el.style.zIndex = '0'
          }
        })
        window.__horizontalActiveSection = SECTION_IDS[0]
        return
      }

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
        setPanelVisible(el, visible)
        el.style.zIndex = visible ? (j === active || j === active + 1 ? '2' : '1') : '0'
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

    const scheduleMeasure = () => {
      measure()
      apply()
    }

    scheduleMeasure()
    requestAnimationFrame(scheduleMeasure)
    document.fonts?.ready?.then(scheduleMeasure)

    let scrollRaf = 0
    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        apply()
      })
    }
    const onResize = () => scheduleMeasure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.visualViewport?.addEventListener('resize', onResize, { passive: true })
    window.visualViewport?.addEventListener('scroll', onResize, { passive: true })

    // Re-measure when panel or its content changes size (e.g. GitHub projects load)
    const ro = new ResizeObserver(onResize)
    panelRefs.current.forEach((p) => {
      if (p) ro.observe(p)
      if (p?.firstElementChild) ro.observe(p.firstElementChild)
    })

    return () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('scroll', onResize)
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
      style={{ height: `calc(var(--stage-vh, 100svh) + ${stageExtra}px)` }}
    >
      {/* Sticky viewport — stays pinned while the user scrolls through the stage */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: 'var(--stage-vh, 100svh)',
          overflow: 'hidden',
          zIndex: 2,
          isolation: 'isolate',
        }}
      >

        {panels.map((panel, i) => (
          <div
            key={i}
            ref={(el) => { panelRefs.current[i] = el }}
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: `${HEADER_OFFSET}px`,
                boxSizing: 'border-box',
                opacity: i === 0 ? 1 : 0,
                pointerEvents: i === 0 ? 'auto' : 'none',
                transform: i === 0 ? 'none' : 'translate3d(100vw, 0, 0)',
                zIndex: i === 0 ? 2 : 0,
              }}
            >
              <div style={{ width: '100%', flex: '0 0 auto' }}>
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
