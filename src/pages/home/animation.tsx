import gsap, { TimelineLite } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

const travelToRing = (pathLength: number) => {
  const t1 = new TimelineLite()
  t1.fromTo(
    '#motionPath',
    { strokeDashoffset: pathLength },
    { strokeDashoffset: 0, duration: 2 }
  )
  t1.to('#pathMaskReveal', { display: 'block' }, '<0.1')

  t1.fromTo(
    '#ring',
    { scale: 0, translateX: 50, translateY: 20 },
    {
      scale: 0.7,
      duration: 1,
      transformOrigin: 'center center',
      ease: 'back'
    }
  )
  t1.to('#ring', { display: 'block' }, '<0.1')

  t1.to('#ring', { scale: 0, duration: 0.75 }, '-=0.2')

  return t1
}

// https://codepen.io/PointC/pen/c07761a17f94434f1229e11e798f1a3d
export default (pathLength: number): void => {
  const t1 = new TimelineLite({ delay: 1 })

  t1.to('#binoculars circle', { r: 850, duration: 2 })
  t1.add(travelToRing(pathLength))

  t1.fromTo(
    'img',
    { rotationX: 180, transformOrigin: '0% 100%' },
    { rotationX: 0, duration: 2, ease: 'bounce' }
  )
  t1.fromTo(
    'h1',
    { display: 'none' },
    {
      display: 'block',
      duration: 2,
      text: "We're getting married!",
      ease: 'none'
    }
  )
  t1.to('h1', {
    duration: 1,
    text: 'Get ready for 2022!',
    ease: 'none',
    delay: 1.5
  })
}
