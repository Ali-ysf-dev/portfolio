import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

import './FlowingMenu.css'

function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = '#060010',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#060010',
  borderColor = '#fff'
}) {
  const wrapRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const node = wrapRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isVisible={isVisible}
          />
        ))}
      </nav>
    </div>
  )
}

// Map FlowingMenu item text to arrays of skill icon URLs
const getSkillIconsForText = (text) => {
  switch (text) {
    case 'Frontend Skills':
      return [
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        'https://api.iconify.design/devicon:tailwindcss.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg'
      ]
    case 'Backend Skills':
      return [
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg'
      ]
    case 'Tools':
      return [
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
        'https://api.iconify.design/simple-icons:xampp.svg'
      ]
    default:
      return []
  }
}

function MenuItem({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isVisible = true,
}) {
  const itemRef = useRef(null)
  const marqueeRef = useRef(null)
  const marqueeInnerRef = useRef(null)
  const animationRef = useRef(null)
  const [repetitions, setRepetitions] = useState(4)

  const skillIcons = getSkillIconsForText(text)

  const animationDefaults = { duration: 0.6, ease: 'expo' }

  const distMetric = (x, y, x2, y2) => {
    const xDiff = x - x2
    const yDiff = y - y2
    return xDiff * xDiff + yDiff * yDiff
  }

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0)
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height)
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
  }

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return

      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part')
      if (!marqueeContent) return

      const contentWidth = marqueeContent.offsetWidth
      const viewportWidth = window.innerWidth

      const needed = Math.ceil(viewportWidth / contentWidth) + 2
      setRepetitions(Math.max(4, needed))
    }

    calculateRepetitions()
    window.addEventListener('resize', calculateRepetitions)
    return () => window.removeEventListener('resize', calculateRepetitions)
  }, [text, image])

  useEffect(() => {
    if (!isVisible) {
      animationRef.current?.pause()
      return undefined
    }

    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return

      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part')
      if (!marqueeContent) return

      const contentWidth = marqueeContent.offsetWidth
      if (contentWidth === 0) return

      if (animationRef.current) {
        animationRef.current.kill()
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      })
    }

    const timer = setTimeout(setupMarquee, 50)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        animationRef.current.kill()
        animationRef.current = null
      }
    }
  }, [text, image, repetitions, speed, isVisible])

  const handleMouseEnter = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0)
  }

  const handleMouseLeave = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
  }

  return (
    <div className="menu__item" ref={itemRef} style={{ borderColor }}>
      <a
        className="menu__item-link"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        {text}
      </a>
      <div className="marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span></span>
                {skillIcons.length > 0 ? (
                  <div className="marquee__img-group">
                    {skillIcons.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${text} skill icon ${i + 1}`}
                        className="marquee__icon"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="marquee__img" style={{ backgroundImage: `url(${image})` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlowingMenu

