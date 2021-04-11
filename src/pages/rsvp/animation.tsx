import gsap, { TimelineLite } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { mediaBreaks } from '../../theme'

gsap.registerPlugin(MotionPathPlugin)

export const cardIn = (): void => {
  gsap.set('.cardIn', {
    x: 0,
    y: -200,
    scale: 0.2
  })
  gsap.to('.cardIn', {
    duration: 1.3,
    scale: 1,
    motionPath: {
      path: [
        { x: 0, y: -200 },
        { x: -200, y: -200 },
        { x: 0, y: 0 }
      ],
      curviness: 2
    }
  })
}

export const cardOut = (): void => {
  gsap.set('.cardOut', { display: 'grid' })
  gsap.to('.cardOut', {
    duration: 1.3,
    opacity: 0,
    scale: 0.2,
    display: 'none',
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 200, y: -200 },
        { x: 0, y: -200 }
      ],
      curviness: 2
    }
  })
}
