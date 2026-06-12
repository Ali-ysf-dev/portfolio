import { motion } from 'framer-motion'
import FlowingMenu from '../components/FlowingMenu'

const flowingMenuItems = [
  { link: '#skills', text: 'Frontend Skills', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#skills', text: 'Backend Skills',  image: 'https://picsum.photos/600/400?random=2' },
  { link: '#skills', text: 'Tools',           image: 'https://picsum.photos/600/400?random=3' },
]

const Skills = () => {
  return (
    <section id="skills" className="page-content">
      <style>{`
        .sk-hero {
          padding: 4.5rem 1.5rem 2.5rem;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        .sk-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FCA311;
          padding: 0.3rem 0.85rem;
          border: 1px solid rgba(252,163,17,0.25);
          border-radius: 999px;
          background: rgba(252,163,17,0.06);
          margin-bottom: 1.1rem;
        }
        .sk-title {
          font-size: clamp(1.9rem, 4.5vw, 3rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 0.8rem;
          line-height: 1.15;
        }
        .sk-title span {
          background: linear-gradient(90deg, #FCA311 0%, #ffd27a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sk-subtitle {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
        }
        .sk-menu-wrap {
          height: 250px;
          position: relative;
          margin-bottom: 4rem;
        }
      `}</style>

      {/* Section Header */}
      <div className="sk-hero">
        <motion.span
          className="sk-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
          Capabilities
        </motion.span>
        <motion.h1
          className="sk-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          Skills &amp; <span>Expertise</span>
        </motion.h1>
        <motion.p
          className="sk-subtitle"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          Technical competencies and tools developed through hands-on development experience.
        </motion.p>
      </div>

      {/* Flowing Skills Menu */}
      <div className="sk-menu-wrap">
        <FlowingMenu
          items={flowingMenuItems}
          speed={15}
          textColor="#ffffff"
          bgColor="transparent"
          marqueeBgColor="black"
          marqueeTextColor="#060010"
          borderColor="#ffffff"
        />
      </div>
    </section>
  )
}

export default Skills
