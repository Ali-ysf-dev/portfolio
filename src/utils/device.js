export const MOBILE_MAX_WIDTH = 768

export const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth < MOBILE_MAX_WIDTH

export const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches

/** Framer Motion props — skip entrance animations on mobile */
export const motionFade = (delay = 0, y = 10) =>
  isMobile()
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay },
      }
