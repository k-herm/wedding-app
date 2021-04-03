import gsap, { TimelineLite } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { mediaBreaks } from '../../theme'

gsap.registerPlugin(TextPlugin)

const travelPath = (pathLength: number) => {
  const t1 = new TimelineLite()
  t1.to('h1', {
    display: 'block',
    duration: 1,
    text: 'On a sunny August day',
    ease: 'none'
  })

  t1.to(
    'h1',
    {
      display: 'block',
      duration: 3,
      text: 'We climbed Mt. Habrich in Squamish, BC',
      ease: 'none'
    },
    '+=1'
  )

  t1.fromTo(
    '#motionPath',
    { strokeDashoffset: pathLength },
    { strokeDashoffset: 0, duration: 2 },
    '-=2'
  )
  t1.fromTo(
    '#pathMaskReveal',
    { display: 'none' },
    { display: 'block' },
    '<0.1'
  )

  t1.to('h1', { display: 'none', text: '' }, '+=0.5')

  return t1
}

const surprise = (vw: number) => {
  const t1 = new TimelineLite()
  t1.fromTo(
    '#emoji',
    { display: 'block', fontSize: 0, translateY: -250 },
    {
      fontSize: vw <= mediaBreaks.phone ? 200 : 300,
      duration: 2,
      transformOrigin: 'center center',
      ease: 'back'
    }
  )

  t1.fromTo(
    '#ring',
    {
      scale: 0,
      translateX: vw <= mediaBreaks.phone ? 40 : 50,
      translateY: 20
    },
    {
      scale: vw <= mediaBreaks.phone ? 0.8 : 0.7,
      duration: 1,
      transformOrigin: 'center center',
      ease: 'back'
    },
    '<0.3'
  )
  t1.to('#ring', { display: 'block' }, '<0.1')

  t1.to('#emoji', { fontSize: 0, duration: 0.75 }, '-=0.1')
  t1.to('#ring', { scale: 0, duration: 0.75 }, '-=0.2')

  return t1
}

export default (pathLength: number, vw: number): TimelineLite => {
  const t1 = new TimelineLite({ delay: 1 })
  t1.addLabel('start')

  t1.to('h1', { display: 'none', text: '' })
  t1.fromTo('#binoculars circle', { r: 75 }, { r: 850, duration: 2 })
  t1.add(travelPath(pathLength))
  t1.add(surprise(vw), '+=0.5')
  t1.fromTo('#pathMaskReveal', { opacity: 1 }, { opacity: 0, duration: 0.5 })

  t1.fromTo(
    '#kcImage',
    { rotationX: 180, transformOrigin: '0% 100%' },
    { rotationX: 0, duration: 2, ease: 'bounce' },
    '<'
  )
  t1.to('h1', {
    display: 'block',
    duration: 2,
    text: "Yup we're getting married!",
    ease: 'none'
  })
  t1.to('h1', {
    duration: 1,
    text: 'Get ready for 2022!',
    ease: 'none',
    delay: 1.5
  })

  t1.addLabel('end')
  return t1
}
