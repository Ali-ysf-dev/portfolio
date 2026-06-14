export const SMALL_SCREEN_MAX = 768

export const isSmallScreen = () =>
  typeof window !== 'undefined' && window.innerWidth < SMALL_SCREEN_MAX

export const usesScrollStage = () =>
  typeof window !== 'undefined' &&
  !isSmallScreen() &&
  Boolean(document.getElementById('horizontal-track-section'))

export const scrollToSection = (sectionId, panelIndex) => {
  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  if (usesScrollStage() && typeof window.__setHorizontalPanel === 'function') {
    window.__setHorizontalPanel(panelIndex)
    return
  }

  const el = document.getElementById(sectionId)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
