/** Static background for mobile — no CSS animations or heavy blur layers */
const MobilePageBackground = () => (
  <div
    className="page-bg"
    aria-hidden="true"
    style={{
      background: `
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(252,163,17,0.08) 0%, transparent 55%),
        radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1.2px),
        #060606
      `,
      backgroundSize: 'auto, 26px 26px, auto',
    }}
  />
)

export default MobilePageBackground
