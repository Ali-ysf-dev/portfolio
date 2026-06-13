const SKILL_GROUPS = [
  {
    title: 'Frontend',
    items: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'MongoDB'],
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Jira'],
  },
]

const MobileSkills = () => (
  <div className="msk-wrap">
    <style>{`
      .msk-wrap { padding: 0 1rem 3rem; max-width: 36rem; margin: 0 auto; }
      .msk-card {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        background: rgba(255,255,255,0.02);
        padding: 1rem 1.1rem;
        margin-bottom: 0.75rem;
      }
      .msk-title {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #FCA311;
        margin-bottom: 0.65rem;
      }
      .msk-tags { display: flex; flex-wrap: wrap; gap: 0.45rem; }
      .msk-tag {
        font-size: 0.72rem;
        font-weight: 600;
        color: rgba(255,255,255,0.75);
        padding: 0.3rem 0.65rem;
        border-radius: 999px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
      }
    `}</style>
    {SKILL_GROUPS.map((group) => (
      <div key={group.title} className="msk-card">
        <p className="msk-title">{group.title}</p>
        <div className="msk-tags">
          {group.items.map((item) => (
            <span key={item} className="msk-tag">{item}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export default MobileSkills
