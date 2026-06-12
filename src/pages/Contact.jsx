import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from '../config'
import { motion, AnimatePresence } from 'framer-motion'

const SOCIAL_LINKS = [
  {
    href: 'https://linkedin.com/in/ali-youssef-7a4197264',
    label: 'LinkedIn',
    sub: 'linkedin.com/in/ali-youssef',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    href: 'https://github.com/Ali-ysf-dev',
    label: 'GitHub',
    sub: 'github.com/Ali-ysf-dev',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
]

const INPUT_BASE = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.45rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: '#FCA311', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.3rem' }}>{error}</p>
      )}
    </div>
  )
}

function StyledInput({ error, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
      style={{
        ...INPUT_BASE,
        borderColor: error ? '#f87171' : focused ? '#FCA311' : 'rgba(255,255,255,0.1)',
        background: focused ? 'rgba(252,163,17,0.04)' : 'rgba(255,255,255,0.04)',
      }}
    />
  )
}

function StyledSelect({ error, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
      style={{
        ...INPUT_BASE,
        borderColor: error ? '#f87171' : focused ? '#FCA311' : 'rgba(255,255,255,0.1)',
        background: focused ? 'rgba(252,163,17,0.04)' : 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
      }}
    />
  )
}

function StyledTextarea({ error, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
      style={{
        ...INPUT_BASE,
        borderColor: error ? '#f87171' : focused ? '#FCA311' : 'rgba(255,255,255,0.1)',
        background: focused ? 'rgba(252,163,17,0.04)' : 'rgba(255,255,255,0.04)',
        resize: 'vertical',
        minHeight: 130,
      }}
    />
  )
}

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', projectType: '', budget: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
  }, [])

  const validate = (name, value) => {
    if (name === 'name') {
      if (!value.trim()) return 'Name is required'
      if (value.trim().length < 2) return 'At least 2 characters'
    }
    if (name === 'email') {
      if (!value.trim()) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email'
    }
    if (name === 'projectType' && !value) return 'Please select a type'
    if (name === 'message') {
      if (!value.trim()) return 'Message is required'
      if (value.trim().length < 10) return 'At least 10 characters'
    }
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }))
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const err = validate(name, value)
    setErrors(p => ({ ...p, [name]: err }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    Object.keys(formData).forEach(k => {
      if (k === 'company' || k === 'budget') return
      const err = validate(k, formData[k])
      if (err) newErrors[k] = err
    })
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    setIsSubmitting(true)
    try {
      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'Not provided',
        project_type: formData.projectType,
        budget: formData.budget || 'Not specified',
        message: formData.message,
        to_email: EMAILJS_CONFIG.CONTACT_EMAIL,
      })
      setShowSuccess(true)
      setFormData({ name: '', email: '', company: '', projectType: '', budget: '', message: '' })
      setTimeout(() => setShowSuccess(false), 6000)
    } catch (err) {
      console.error(err)
      alert('Failed to send. Please email me directly at contact@aliyoussef.tech')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText('contact@aliyoussef.tech').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <section id="contact" className="page-content">
      <style>{`
        .ct-page { max-width: 72rem; margin: 0 auto; padding: 4rem 1.5rem 6rem; }
        @media (min-width: 640px) { .ct-page { padding: 5rem 2rem 7rem; } }

        /* Hero */
        .ct-hero { text-align: center; margin-bottom: 4rem; }
        .ct-eyebrow {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: #FCA311; padding: 0.3rem 0.85rem;
          border: 1px solid rgba(252,163,17,0.25); border-radius: 999px;
          background: rgba(252,163,17,0.06); margin-bottom: 1.1rem;
        }
        .ct-title {
          font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 800; color: #fff;
          letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 0.9rem;
        }
        .ct-title span {
          background: linear-gradient(90deg, #FCA311 0%, #ffd270 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ct-subtitle { font-size: 1rem; color: rgba(255,255,255,0.45); max-width: 480px; margin: 0 auto; line-height: 1.7; }

        /* Layout */
        .ct-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) { .ct-grid { grid-template-columns: 1fr 380px; gap: 2.5rem; } }

        /* Form card */
        .ct-form-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 2.25rem 2rem;
        }
        .ct-form-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 1.75rem; }
        .ct-form-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 640px) { .ct-form-grid-2 { grid-template-columns: 1fr 1fr; } }

        /* Success */
        .ct-success {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1.25rem 1.5rem; border-radius: 14px;
          background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.2);
        }
        .ct-success-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(74,222,128,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* Submit btn */
        .ct-submit {
          width: 100%; padding: 0.85rem 1.5rem; border-radius: 12px;
          background: #FCA311; color: #000; font-size: 0.88rem; font-weight: 700;
          letter-spacing: 0.03em; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: background 0.2s, transform 0.15s;
        }
        .ct-submit:hover:not(:disabled) { background: #ffb733; }
        .ct-submit:active:not(:disabled) { transform: scale(0.98); }
        .ct-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Sidebar */
        .ct-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
        .ct-info-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 1.75rem 1.5rem;
        }
        .ct-info-title { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 1.25rem; }

        /* Contact rows */
        .ct-contact-row { display: flex; align-items: center; gap: 1rem; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ct-contact-row:last-child { border-bottom: none; }
        .ct-contact-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(252,163,17,0.08); border: 1px solid rgba(252,163,17,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #FCA311; }
        .ct-contact-label { font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.15rem; }
        .ct-contact-value { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.85); }

        /* Social */
        .ct-social-row {
          display: flex; align-items: center; gap: 0.85rem; padding: 0.65rem 0.75rem; border-radius: 10px;
          text-decoration: none; transition: background 0.2s; cursor: pointer;
        }
        .ct-social-row:hover { background: rgba(255,255,255,0.04); }
        .ct-social-icon { width: 36px; height: 36px; border-radius: 9px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.6); flex-shrink: 0; transition: color 0.2s; }
        .ct-social-row:hover .ct-social-icon { color: #FCA311; border-color: rgba(252,163,17,0.25); }
        .ct-social-label { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.75); }
        .ct-social-sub { font-size: 0.65rem; color: rgba(255,255,255,0.28); }
        .ct-social-arrow { margin-left: auto; color: rgba(255,255,255,0.2); transition: color 0.2s; }
        .ct-social-row:hover .ct-social-arrow { color: #FCA311; }

        /* Availability */
        .ct-avail { display: flex; align-items: flex-start; gap: 0.85rem; }
        .ct-avail-dot { width: 10px; height: 10px; border-radius: 50%; background: #4ade80; flex-shrink: 0; margin-top: 3px; box-shadow: 0 0 0 3px rgba(74,222,128,0.15); animation: pulse-green 2s ease infinite; }
        @keyframes pulse-green { 0%,100%{ box-shadow: 0 0 0 3px rgba(74,222,128,0.15); } 50%{ box-shadow: 0 0 0 6px rgba(74,222,128,0.06); } }
        .ct-avail-title { font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.85); margin-bottom: 0.3rem; }
        .ct-avail-sub { font-size: 0.75rem; color: rgba(255,255,255,0.35); line-height: 1.5; }
        .ct-avail-tz { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.65rem; color: rgba(255,255,255,0.25); margin-top: 0.6rem; }

        /* Copy toast */
        .ct-toast {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 200;
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1rem; border-radius: 10px;
          background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.3);
          font-size: 0.78rem; font-weight: 600; color: #4ade80;
          pointer-events: none;
        }
      `}</style>

      <div className="ct-page">
        {/* Hero */}
        <div className="ct-hero">
          <motion.span className="ct-eyebrow" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Let's Talk
          </motion.span>
          <motion.h1 className="ct-title" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.08 }}>
            Get In <span>Touch</span>
          </motion.h1>
          <motion.p className="ct-subtitle" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.16 }}>
            Ready to bring your ideas to life? Let's discuss your project and create something great together.
          </motion.p>
        </div>

        <div className="ct-grid">
          {/* ── Form ── */}
          <motion.div className="ct-form-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.22 }}>
            <p className="ct-form-title">Send a Message</p>

            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div key="success" className="ct-success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="ct-success-icon">
                    <svg width="20" height="20" fill="none" stroke="#4ade80" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#4ade80', marginBottom: '0.3rem' }}>Message sent!</p>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                      Thanks for reaching out. I'll get back to you within 24–48 hours.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div className="ct-form-grid ct-form-grid-2" style={{ marginBottom: '1.25rem' }}>
                    <Field label="Full Name" required error={errors.name}>
                      <StyledInput type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} placeholder="Your full name" error={errors.name} />
                    </Field>
                    <Field label="Email" required error={errors.email}>
                      <StyledInput type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" error={errors.email} />
                    </Field>
                  </div>

                  <div className="ct-form-grid ct-form-grid-2" style={{ marginBottom: '1.25rem' }}>
                    <Field label="Company" error={null}>
                      <StyledInput type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company name (optional)" />
                    </Field>
                    <Field label="Project Type" required error={errors.projectType}>
                      <StyledSelect name="projectType" value={formData.projectType} onChange={handleChange} onBlur={handleBlur} error={errors.projectType}>
                        <option value="">Select a type</option>
                        <option value="web-development">Web Development</option>
                        <option value="AI-Workflow-Automation">AI Workflow Automation</option>
                        <option value="Salesfunnel-development">Sales Funnel Development</option>
                        <option value="consultation">Consultation</option>
                        <option value="maintenance">Website Maintenance</option>
                        <option value="other">Other</option>
                      </StyledSelect>
                    </Field>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <Field label="Budget Range" error={null}>
                      <StyledSelect name="budget" value={formData.budget} onChange={handleChange}>
                        <option value="">Select budget (optional)</option>
                        <option value="under-200">Under €200</option>
                        <option value="200-700">€200 – €700</option>
                        <option value="700-1200">€700 – €1,200</option>
                        <option value="1200-1700">€1,200 – €1,700</option>
                        <option value="over-1700">Over €1,700</option>
                        <option value="discuss">Let's discuss</option>
                      </StyledSelect>
                    </Field>
                  </div>

                  <div style={{ marginBottom: '1.75rem' }}>
                    <Field label="Message" required error={errors.message}>
                      <StyledTextarea name="message" value={formData.message} onChange={handleChange} onBlur={handleBlur} rows={5} placeholder="Tell me about your project, goals, and timeline..." error={errors.message} />
                    </Field>
                  </div>

                  <button type="submit" className="ct-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.div className="ct-sidebar" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>

            {/* Contact info */}
            <div className="ct-info-card">
              <p className="ct-info-title">Contact Info</p>
              <div>
                {/* Email */}
                <div className="ct-contact-row">
                  <div className="ct-contact-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="ct-contact-label">Email</p>
                    <button onClick={copyEmail} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                      <span className="ct-contact-value" style={{ color: copied ? '#4ade80' : 'rgba(255,255,255,0.85)', transition: 'color 0.2s' }}>
                        {copied ? 'Copied!' : 'contact@aliyoussef.tech'}
                      </span>
                    </button>
                  </div>
                  <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </div>
                {/* Phone */}
                <div className="ct-contact-row">
                  <div className="ct-contact-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <p className="ct-contact-label">Phone</p>
                    <p className="ct-contact-value">+49 155 1062 8053</p>
                  </div>
                </div>
                {/* Location */}
                <div className="ct-contact-row">
                  <div className="ct-contact-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <p className="ct-contact-label">Location</p>
                    <p className="ct-contact-value">Berlin, Germany</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="ct-info-card">
              <p className="ct-info-title">Connect</p>
              {SOCIAL_LINKS.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="ct-social-row">
                  <div className="ct-social-icon">{s.icon}</div>
                  <div>
                    <p className="ct-social-label">{s.label}</p>
                    <p className="ct-social-sub">{s.sub}</p>
                  </div>
                  <svg className="ct-social-arrow" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10"/>
                  </svg>
                </a>
              ))}
            </div>

            {/* Availability */}
            <div className="ct-info-card">
              <div className="ct-avail">
                <div className="ct-avail-dot" />
                <div>
                  <p className="ct-avail-title">Available for Projects</p>
                  <p className="ct-avail-sub">Currently accepting new projects and collaborations. Let's discuss your ideas!</p>
                  <p className="ct-avail-tz">
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    CET · UTC+1 · Berlin
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Copy toast */}
      <AnimatePresence>
        {copied && (
          <motion.div className="ct-toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/></svg>
            Copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Contact
