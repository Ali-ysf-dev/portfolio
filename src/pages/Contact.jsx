import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from '../config'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

// Framer Motion animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const cardHover = {
  scale: 1.02,
  y: -4,
  transition: { duration: 0.2, ease: "easeOut" }
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const cardRefs = useRef([])
  const fadeInRefs = useRef([])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
    
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

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return null
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return null
      case 'projectType':
        if (!value) return 'Please select a project type'
        return null
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        return null
      default:
        return null
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      if (key === 'company' || key === 'budget') return // Optional fields
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          company: formData.company || 'Not provided',
          project_type: formData.projectType,
          budget: formData.budget || 'Not specified',
          message: formData.message,
          to_email: EMAILJS_CONFIG.CONTACT_EMAIL
        }
      )

      setShowSuccess(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: '',
        budget: '',
        message: ''
      })
      
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Email sending error:', error)
      alert('Failed to send message. Please try again later or contact me directly at contact@aliyoussef.tech')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show toast notification
      const toast = document.getElementById('copy-toast')
      if (toast) {
        toast.classList.remove('translate-y-full', 'opacity-0')
        toast.classList.add('translate-y-0', 'opacity-100')
        setTimeout(() => {
          toast.classList.add('translate-y-full', 'opacity-0')
          toast.classList.remove('translate-y-0', 'opacity-100')
        }, 3000)
      }
    })
  }

  return (
    <div className="contact-page-background">
      {/* Page Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 section-bg-custom">
        <div className="max-w-7xl mx-auto text-center">
          <div className="fade-in" ref={el => fadeInRefs.current[0] = el}>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
              Get In <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Ready to bring your ideas to life? Let's discuss your project and explore how we can work together to create something amazing.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-8">
              <motion.div 
                className="card p-8" 
                ref={el => cardRefs.current[0] = el}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={cardHover}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-text-primary mb-6">Send Me a Message</h2>
                
                {showSuccess ? (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-success mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <div>
                        <h3 className="text-success font-semibold mb-1">Message Sent Successfully!</h3>
                        <p className="text-text-secondary text-sm">
                          Thank you for reaching out! I'll review your message and get back to you within 24-48 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                          Full Name <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          placeholder="Enter your full name"
                          className={`w-full px-4 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${errors.name ? 'border-error' : 'border-border'}`}
                        />
                        {errors.name && <div className="text-error text-sm mt-1">{errors.name}</div>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                          Email Address <span className="text-error">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          placeholder="your.email@example.com"
                          className={`w-full px-4 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${errors.email ? 'border-error' : 'border-border'}`}
                        />
                        {errors.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your company name"
                          className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="project-type" className="block text-sm font-medium text-text-primary mb-2">
                          Project Type <span className="text-error">*</span>
                        </label>
                        <select
                          id="project-type"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={`w-full px-4 py-3 bg-surface border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${errors.projectType ? 'border-error' : 'border-border'}`}
                        >
                          <option value="">Select project type</option>
                          <option value="web-development">Web Development</option>
                          <option value="AI-Workflow-Automation">AI Workflow Automation</option>
                          <option value="Salesfunnel-development">Sales Funnel Development</option>
                          <option value="consultation">Consultation</option>
                          <option value="maintenance">Website Maintenance</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.projectType && <div className="text-error text-sm mt-1">{errors.projectType}</div>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-text-primary mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-5k">Under €200</option>
                        <option value="5k-10k">€200 - €700</option>
                        <option value="10k-25k">€700 - €1,200</option>
                        <option value="25k-50k">€1,200 - €1,700</option>
                        <option value="over-50k">Over €1,700</option>
                        <option value="discuss">Let's discuss</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                        Project Details <span className="text-error">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="Tell me about your project, goals, timeline, and any specific requirements..."
                        className={`w-full px-4 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-vertical ${errors.message ? 'border-error' : 'border-border'}`}
                      />
                      {errors.message && <div className="text-error text-sm mt-1">{errors.message}</div>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-text-secondary">
                        <span className="text-error">*</span> Required fields
                      </div>
                      <motion.button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn-primary inline-flex items-center justify-center min-w-32"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-4">
              <div className="space-y-8">
                <motion.div 
                  className="card p-6" 
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

                {/* Social Links */}
                <motion.div 
                  className="card p-6" 
                  ref={el => cardRefs.current[2] = el}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={cardHover}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-text-primary mb-6">Connect With Me</h3>
                  
                  <div className="space-y-3">
                    {/* LinkedIn */}
                    <a 
                      href="https://linkedin.com/in/ali-youssef-7a4197264" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center p-3 rounded-lg hover:bg-surface-hover transition-colors duration-200 group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium group-hover:text-primary transition-colors duration-200">LinkedIn</p>
                        <p className="text-sm text-text-secondary">Professional network</p>
                      </div>
                      <svg className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>

                    {/* GitHub */}
                    <a 
                      href="https://github.com/Ali-ysf-dev" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center p-3 rounded-lg hover:bg-surface-hover transition-colors duration-200 group"
                    >
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium group-hover:text-primary transition-colors duration-200">GitHub</p>
                        <p className="text-sm text-text-secondary">Code repositories</p>
                      </div>
                      <svg className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>

                    {/* Twitter */}
                    <a 
                      href="https://twitter.com/aliyoussef" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center p-3 rounded-lg hover:bg-surface-hover transition-colors duration-200 group"
                    >
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium group-hover:text-primary transition-colors duration-200">Twitter</p>
                        <p className="text-sm text-text-secondary">Latest updates</p>
                      </div>
                      <svg className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  </div>
                </motion.div>

                {/* Availability Status */}
                <motion.div 
                  className="card p-6" 
                  ref={el => cardRefs.current[3] = el}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={cardHover}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-success rounded-full mr-3 animate-pulse"></div>
                    <h3 className="text-lg font-semibold text-text-primary">Available for Projects</h3>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">
                    I'm currently accepting new projects and collaborations. Let's discuss your ideas!
                  </p>
                  <div className="flex items-center text-sm text-text-secondary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Timezone: PST (UTC-8)</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Success Toast */}
      <div id="copy-toast" className="fixed bottom-4 right-4 bg-success text-white px-4 py-2 rounded-lg shadow-lg transform translate-y-full opacity-0 transition-all duration-300 z-50">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Email copied to clipboard!</span>
        </div>
      </div>
    </div>
  )
}

export default Contact

