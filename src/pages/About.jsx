import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

// Framer Motion animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardHover = {
  scale: 1.02,
  y: -4,
  transition: { duration: 0.2, ease: "easeOut" }
}

const About = () => {
  const [expandedItems, setExpandedItems] = useState({})
  const signaturePathRef = useRef(null)
  const signatureSvgRef = useRef(null)
  const cardRefs = useRef([])
  const skillBarRefs = useRef([])
  const fadeInRefs = useRef([])
  const timelineRefs = useRef([])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    
    // Wait for scroll to complete before setting up animations
    const setupAnimations = () => {
      if (typeof gsap !== 'undefined') {
      // Signature Background Animation
      if (signaturePathRef.current && signatureSvgRef.current) {
        const pathLength = signaturePathRef.current.getTotalLength()
        signaturePathRef.current.style.strokeDasharray = pathLength
        signaturePathRef.current.style.strokeDashoffset = pathLength

        const tl = gsap.timeline({ delay: 0.3 })
        tl.to(signatureSvgRef.current, {
          opacity: 0.5,
          duration: 0.5,
          ease: "power2.out"
        })
        tl.to(signaturePathRef.current, {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: "power1.inOut",
          onUpdate: function() {
            if (!signaturePathRef.current) return
            const progress = this.progress()
            if (progress > 0.2 && progress < 0.6) {
              signaturePathRef.current.style.strokeWidth = "3.5"
            } else if (progress > 0.6 && progress < 0.9) {
              signaturePathRef.current.style.strokeWidth = "3.2"
            } else {
              signaturePathRef.current.style.strokeWidth = "3"
            }
          },
          onComplete: function() {
            gsap.to(signaturePathRef.current, {
              strokeWidth: "3",
              filter: "drop-shadow(0 4px 16px rgba(252, 163, 17, 0.3))",
              duration: 0.5,
              ease: "power2.out"
            })
          }
        })
      }

      // Card animations
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('gsap-animated')) {
            gsap.fromTo(entry.target,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: function() {
                  entry.target.classList.add('gsap-animated')
                }
              }
            )
            cardObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1 })

      cardRefs.current.forEach(card => {
        if (card) {
          // Set initial state for scroll animation
          gsap.set(card, { opacity: 0, y: 30 })
          
          const handleMouseEnter = () => {
            gsap.to(card, {
              y: -4,
              scale: 1.02,
              duration: 0.2,
              ease: "power2.out"
            })
          }
          const handleMouseLeave = () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            })
          }
          card.addEventListener('mouseenter', handleMouseEnter)
          card.addEventListener('mouseleave', handleMouseLeave)
          cardObserver.observe(card)
        }
      })

      // Skills animation
      const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            skillBarRefs.current.forEach(bar => {
              if (bar && bar.dataset.width) {
                setTimeout(() => {
                  bar.style.width = bar.dataset.width + '%'
                  bar.style.transition = 'width 1s ease-out'
                }, 300)
              }
            })
            skillsObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.5 })

      const skillsSection = document.querySelector('.card:has(.skill-item)')
      if (skillsSection) {
        skillsObserver.observe(skillsSection)
      }

      // Initialize skill bars
      skillBarRefs.current.forEach(bar => {
        if (bar) bar.style.width = '0%'
      })

      // Fade-in animations for header
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            const index = fadeInRefs.current.indexOf(entry.target)
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.3 + (index * 0.05),
              ease: "power2.out",
              onComplete: function() {
                entry.target.classList.add('visible')
              }
            })
            fadeObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1 })

      fadeInRefs.current.forEach((el) => {
        if (el) {
          gsap.set(el, { opacity: 0, y: 30 })
          fadeObserver.observe(el)
        }
      })

      // Timeline animations
      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting && !entry.target.classList.contains('timeline-animated')) {
            gsap.fromTo(entry.target,
              { opacity: 0, x: -30 },
              {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: index * 0.15,
                ease: "power2.out",
                onComplete: function() {
                  entry.target.classList.add('timeline-animated')
                }
              }
            )
            timelineObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1 })

      timelineRefs.current.forEach((item) => {
        if (item) {
          gsap.set(item, { opacity: 0, x: -30 })
          timelineObserver.observe(item)
        }
      })
      
      // Force check for elements already in viewport
      requestAnimationFrame(() => {
        fadeInRefs.current.forEach((el) => {
          if (el) {
            const rect = el.getBoundingClientRect()
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0
            if (isVisible && !el.classList.contains('visible')) {
              const index = fadeInRefs.current.indexOf(el)
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.3 + (index * 0.05),
                ease: "power2.out",
                onComplete: function() {
                  el.classList.add('visible')
                }
              })
              fadeObserver.unobserve(el)
            }
          }
        })

        cardRefs.current.forEach((card) => {
          if (card) {
            const rect = card.getBoundingClientRect()
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0
            if (isVisible && !card.classList.contains('gsap-animated')) {
              gsap.fromTo(card,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "power2.out",
                  onComplete: function() {
                    card.classList.add('gsap-animated')
                  }
                }
              )
              cardObserver.unobserve(card)
            }
          }
        })

        timelineRefs.current.forEach((item, index) => {
          if (item) {
            const rect = item.getBoundingClientRect()
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0
            if (isVisible && !item.classList.contains('timeline-animated')) {
              gsap.fromTo(item,
                { opacity: 0, x: -30 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "power2.out",
                  onComplete: function() {
                    item.classList.add('timeline-animated')
                  }
                }
              )
              timelineObserver.unobserve(item)
            }
          }
        })
      })
      } // Close if (typeof gsap !== 'undefined')
    }

    // Fallback to ensure content is visible if animations don't trigger
    setTimeout(() => {
      fadeInRefs.current.forEach((el) => {
        if (el && !el.classList.contains('visible')) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }
      })
      cardRefs.current.forEach((card) => {
        if (card && !card.classList.contains('gsap-animated')) {
          card.style.opacity = '1'
          card.style.transform = 'translateY(0)'
        }
      })
      timelineRefs.current.forEach((item) => {
        if (item && !item.classList.contains('timeline-animated')) {
          item.style.opacity = '1'
          item.style.transform = 'translateX(0)'
        }
      })
    }, 300)
    
    // Setup animations after scroll completes
    requestAnimationFrame(() => {
      requestAnimationFrame(setupAnimations)
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Email copied to clipboard!')
    })
  }

  return (
    <div className="about-page-background">
      {/* Page Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 section-bg-custom relative overflow-hidden">
        <div className="signature-background-wrapper absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg ref={signatureSvgRef} id="about-signature-svg" className="signature-svg signature-background" viewBox="0 0 1066 481" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              ref={signaturePathRef}
              id="about-signature-path"
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
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="fade-in" ref={el => fadeInRefs.current[0] = el}>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
              About <span className="text-gradient">Me</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Passionate frontend developer with a love for creating beautiful, functional web experiences
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-7">
              {/* Professional Biography */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-text-primary mb-6">My Journey</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-text-secondary leading-relaxed mb-6">
                    Hello! I'm Ali Youssef, a passionate frontend developer based in Berlin, Germany. 
                    My journey into web development began during my Management Information Systems studies at Lebanese University, where I discovered 
                    my love for creating beautiful, functional user interfaces that make a real difference in 
                    people's lives.
                  </p>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    I graduated in February 2023 with a bachelor's degree in Management Information Systems and have been 
                    freelancing as a web developer since then. My experience spans from full-stack development 
                    to product ownership, where I've learned to balance technical excellence with business needs.
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    I've had the privilege of working on diverse projects including clinic management systems, 
                    hotel reservation platforms, and modern web applications. Each project has taught me something new 
                    and reinforced my belief that great web development is about understanding users, solving problems, 
                    and creating experiences that deliver real value.
                  </p>
                </div>
              </div>

              {/* Career Timeline */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-text-primary mb-8">Career Timeline</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30 hidden sm:block"></div>
                  
                  <div className="space-y-8">
                    {/* Current Position */}
                    <div className="timeline-item relative pl-0 sm:pl-12" ref={el => timelineRefs.current[0] = el}>
                      <div className="absolute left-0 top-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center hidden sm:flex">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div 
                        className="card p-6 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                        onClick={() => toggleExpand(0)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-text-primary">Web Developer (Freelancing)</h3>
                            <p className="text-primary font-medium">Self-Employed</p>
                            <p className="text-text-secondary text-sm">February 2023 - Present</p>
                          </div>
                          <svg className={`w-5 h-5 text-text-secondary expand-icon transition-transform duration-200 flex-shrink-0 ${expandedItems[0] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                        {expandedItems[0] && (
                          <div className="expandable-content">
                            <p className="text-text-secondary mb-4">
                              Leading end-to-end development of web applications, focusing on React.js and modern web technologies.
                              Successfully delivered multiple projects while managing client relationships and project timelines.
                            </p>
                            <ul className="text-text-secondary space-y-2">
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                Led end-to-end development of major projects, delivering on time and meeting all milestones
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                Designed and implemented new APIs, reducing load times by 25% and boosting user engagement by 15%
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                Created new user interfaces, increasing user satisfaction by 20% and conversion rates by 10%
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* White Stork Position */}
                    <div className="timeline-item relative pl-0 sm:pl-12" ref={el => timelineRefs.current[1] = el}>
                      <div className="absolute left-0 top-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center hidden sm:flex">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div 
                        className="card p-6 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                        onClick={() => toggleExpand(1)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-text-primary">Product Owner</h3>
                            <p className="text-secondary font-medium">White Stork</p>
                            <p className="text-text-secondary text-sm">August 2023 - July 2024</p>
                          </div>
                          <svg className={`w-5 h-5 text-text-secondary expand-icon transition-transform duration-200 flex-shrink-0 ${expandedItems[1] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                        {expandedItems[1] && (
                          <div className="expandable-content">
                            <p className="text-text-secondary mb-4">
                              Started as Product Owner Intern and progressed to full Product Owner role, managing product roadmaps 
                              and collaborating with cross-functional teams in agile environments.
                            </p>
                            <ul className="text-text-secondary space-y-2">
                              <li className="flex items-start">
                                <span className="text-secondary mr-2">•</span>
                                Led product roadmap creation and backlog prioritization aligned with Agile methodologies
                              </li>
                              <li className="flex items-start">
                                <span className="text-secondary mr-2">•</span>
                                Conducted QA testing, analyzed user feedback, and wrote user stories for product improvements
                              </li>
                              <li className="flex items-start">
                                <span className="text-secondary mr-2">•</span>
                                Coordinated with cross-functional teams and facilitated sprint ceremonies
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>

              {/* Personal Philosophy */}
              <motion.div 
                className="card p-8" 
                ref={el => cardRefs.current[0] = el}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={cardHover}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-text-primary mb-6">My Development Philosophy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">User-Centered Design</h3>
                      <p className="text-text-secondary">Every line of code should serve the user's needs and create meaningful experiences.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">Performance First</h3>
                      <p className="text-text-secondary">Fast, efficient code that delivers exceptional user experiences across all devices.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">Continuous Learning</h3>
                      <p className="text-text-secondary">Staying current with evolving technologies and best practices in web development.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">Collaborative Spirit</h3>
                      <p className="text-text-secondary">Great products are built by great teams working together towards common goals.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5">
              {/* Contact Details */}
              <motion.div 
                className="card p-6 mb-8" 
                ref={el => cardRefs.current[1] = el}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={cardHover}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-text-primary mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text-secondary">Email</p>
                      <button 
                        onClick={() => copyToClipboard('contact@aliyoussef.tech')}
                        className="text-text-primary hover:text-primary transition-colors duration-200 font-medium group-hover:underline"
                      >
                        contact@aliyoussef.tech
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Phone</p>
                      <p className="text-text-primary font-medium">+49 15510628053</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Location</p>
                      <p className="text-text-primary font-medium">Berlin, Germany</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Key Statistics */}
              <motion.div 
                className="card p-6 mb-8" 
                ref={el => cardRefs.current[2] = el}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={cardHover}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-text-primary mb-6">Key Statistics</h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">2+</div>
                    <div className="text-text-secondary text-sm">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-1">5+</div>
                    <div className="text-text-secondary text-sm">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-1">8+</div>
                    <div className="text-text-secondary text-sm">Technologies Mastered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-1">100%</div>
                    <div className="text-text-secondary text-sm">Client Satisfaction</div>
                  </div>
                </div>
              </motion.div>

              {/* Skills Proficiency */}
              <motion.div 
                className="card p-6 mb-8" 
                ref={el => cardRefs.current[3] = el}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={cardHover}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-text-primary mb-6">Skills Proficiency</h3>
                <div className="space-y-4">
                  <div className="skill-item">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-primary font-medium">React</span>
                      <span className="text-text-secondary text-sm">90%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div className="skill-bar bg-primary h-2 rounded-full" ref={el => skillBarRefs.current[0] = el} data-width="90" style={{width: '0%'}}></div>
                    </div>
                  </div>

                  <div className="skill-item">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-primary font-medium">JavaScript</span>
                      <span className="text-text-secondary text-sm">88%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div className="skill-bar bg-secondary h-2 rounded-full" ref={el => skillBarRefs.current[1] = el} data-width="85" style={{width: '0%'}}></div>
                    </div>
                  </div>

                  <div className="skill-item">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-primary font-medium">CSS/SCSS</span>
                      <span className="text-text-secondary text-sm">95%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div className="skill-bar bg-accent h-2 rounded-full" ref={el => skillBarRefs.current[2] = el} data-width="88" style={{width: '0%'}}></div>
                    </div>
                  </div>

                  <div className="skill-item">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-primary font-medium">TypeScript</span>
                      <span className="text-text-secondary text-sm">80%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div className="skill-bar bg-warning h-2 rounded-full" ref={el => skillBarRefs.current[3] = el} data-width="80" style={{width: '0%'}}></div>
                    </div>
                  </div>

                  <div className="skill-item">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-primary font-medium">Tailwind</span>
                      <span className="text-text-secondary text-sm">95%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div className="skill-bar bg-error h-2 rounded-full" ref={el => skillBarRefs.current[4] = el} data-width="75" style={{width: '0%'}}></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Resume Download */}
              <motion.div 
                className="card p-6" 
                ref={el => cardRefs.current[4] = el}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={cardHover}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-text-primary mb-4">Get My Resume</h3>
                <p className="text-text-secondary mb-6 text-sm">
                  Download my complete resume with detailed experience, education, and project information.
                </p>
                <motion.button 
                  className="btn-primary w-full flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Download Resume
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

