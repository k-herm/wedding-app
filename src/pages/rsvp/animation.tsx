import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(MotionPathPlugin)

export const cardIn = (): void => {
  gsap.fromTo(
    '.cardIn',
    {
      display: 'grid',
      x: 0,
      y: -200,
      scale: 0,
      position: 'absolute'
    },
    {
      scale: 1,
      delay: 0.5,
      duration: 1.3,
      motionPath: {
        path: 'm 0 0 q -252 142 0 300',
        offsetY: -300
      },
      onComplete: () =>
        gsap.set('.cardIn', {
          position: 'static'
        })
    }
  )
}

export const cardOut = (): void => {
  gsap.set('.cardOut', { display: 'grid' })
  gsap.to('.cardOut', {
    duration: 1.3,
    opacity: 0,
    scale: 0.2,
    display: 'none',
    motionPath: {
      path: 'm 0 0 q 281 -175 0 -301'
    }
  })
}
