import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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

const Services = () => {
  const fadeInRefs = useRef([])
  const cardRefs = useRef([])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    
    // Wait for scroll to complete before setting up animations
    const setupAnimations = () => {
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
    }, 300)

    if (typeof gsap !== 'undefined') {
      // Fade-in animations with IntersectionObserver
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
            
            const icon = card.querySelector('.w-16, .w-8')
            if (icon) {
              gsap.to(icon, {
                scale: 1.1,
                rotation: 5,
                duration: 0.2,
                ease: "power2.out"
              })
            }
          }
          const handleMouseLeave = () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            })
            
            const icon = card.querySelector('.w-16, .w-8')
            if (icon) {
              gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.2,
                ease: "power2.out"
              })
            }
          }
          card.addEventListener('mouseenter', handleMouseEnter)
          card.addEventListener('mouseleave', handleMouseLeave)
          cardObserver.observe(card)
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
              if (fadeObserver) {
                fadeObserver.unobserve(el)
              }
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
      })
      } // Close if (typeof gsap !== 'undefined')
    }
    
    // Setup animations after scroll completes
    requestAnimationFrame(() => {
      requestAnimationFrame(setupAnimations)
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="services-page-background">
      {/* Page Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 section-bg-custom">
        <div className="max-w-7xl mx-auto text-center">
          <div className="fade-in" ref={el => fadeInRefs.current[0] = el}>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
              My <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              I offer comprehensive development solutions to help bring your ideas to life. From web applications to AI-powered automations, I'm here to turn your vision into reality.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Web Development Service */}
            <motion.div 
              className="card p-8 transition-transform duration-300 group" 
              ref={el => cardRefs.current[0] = el}
              variants={fadeInUp}
              whileHover={cardHover}
            >
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mr-16 group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0" style={{marginRight: '4rem'}}>
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Web Development</h3>
                  <p className="text-primary font-medium">Modern & Responsive</p>
                </div>
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Create stunning, responsive websites and web applications using the latest technologies. From simple landing pages to complex web applications, I deliver high-quality solutions that work seamlessly across all devices.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  React.js & Next.js Applications
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Responsive Design & Mobile-First
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Performance Optimization
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  SEO & Accessibility
                </li>
              </ul>
            </motion.div>

            {/* AI Automations Service */}
            <motion.div 
              className="card p-8 transition-transform duration-300 group" 
              ref={el => cardRefs.current[1] = el}
              variants={fadeInUp}
              whileHover={cardHover}
            >
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mr-16 group-hover:bg-secondary/20 transition-colors duration-300 flex-shrink-0" style={{marginRight: '4rem'}}>
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">AI Workflow Automations</h3>
                  <p className="text-secondary font-medium">Smart & Efficient</p>
                </div>
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Leverage the power of artificial intelligence to automate your business processes. From chatbots to data analysis, I create intelligent solutions that save time and increase efficiency.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-secondary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Custom AI Chatbots
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-secondary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Process Automation
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-secondary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Data Analysis & Insights
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-secondary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Integration with Existing Systems
                </li>
              </ul>
            </motion.div>

            {/* Desktop Applications Service */}
            <motion.div 
              className="card p-8 transition-transform duration-300 group" 
              ref={el => cardRefs.current[2] = el}
              variants={fadeInUp}
              whileHover={cardHover}
            >
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mr-16 group-hover:bg-accent/20 transition-colors duration-300 flex-shrink-0" style={{marginRight: '4rem'}}>
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Desktop Applications</h3>
                  <p className="text-accent font-medium">Cross-Platform</p>
                </div>
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Build powerful desktop applications that run smoothly on Windows, macOS, and Linux. Using modern frameworks to create native-feeling applications with web technologies.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Electron Applications
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Cross-Platform Compatibility
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Native System Integration
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Offline Functionality
                </li>
              </ul>
            </motion.div>

            {/* Sales Funnels Development Service */}
            <motion.div 
              className="card p-8 transition-transform duration-300 group" 
              ref={el => cardRefs.current[3] = el}
              variants={fadeInUp}
              whileHover={cardHover}
            >
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mr-16 group-hover:bg-warning/20 transition-colors duration-300 flex-shrink-0" style={{marginRight: '4rem'}}>
                  <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Sales Funnels Development</h3>
                  <p className="text-warning font-medium">High Converting</p>
                </div>
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Design and develop high-converting sales funnels that turn visitors into customers. From landing pages to checkout processes, I create seamless user journeys that maximize conversions.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-warning mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Landing Page Optimization
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-warning mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Payment Integration
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-warning mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  A/B Testing Setup
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 text-warning mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Analytics & Tracking
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Development Process Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 section-bg-custom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="card p-8 mb-16" 
            ref={el => cardRefs.current[4] = el}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={cardHover}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">My Development Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Discovery</h3>
                <p className="text-text-secondary text-sm">Understanding your requirements and project goals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Planning</h3>
                <p className="text-text-secondary text-sm">Creating detailed project roadmap and timeline</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Development</h3>
                <p className="text-text-secondary text-sm">Building your solution with regular updates</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-warning">4</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Delivery</h3>
                <p className="text-text-secondary text-sm">Testing, deployment, and ongoing support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-6">Ready to Start Your Project?</h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Let's discuss your project requirements and create something amazing together. I'm here to help bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary">Get Started Today</Link>
              <Link to="/#projects" className="btn-secondary">View My Work</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services

