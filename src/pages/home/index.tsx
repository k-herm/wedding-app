import React, { useRef, useEffect } from 'react'
import gsap, { TimelineLite } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

import { Main, Container } from './index-sc'

const Home = (): JSX.Element => {
  gsap.registerPlugin(TextPlugin)
  const containerRef = useRef<HTMLElement | null>(null)

  const vw = containerRef.current?.clientWidth || 1200
  const vh = containerRef.current?.clientHeight || 850

  useEffect(() => {
    const t1 = new TimelineLite({ delay: 1 })

    t1.to('circle', { r: 700, duration: 2 })
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
  }, [])

  return (
    <Main>
      <Container
        ref={ref => {
          containerRef.current = ref
        }}
      >
        <svg viewBox={`0 0 ${vw} ${vh}`}>
          <defs>
            <clipPath id="binoculars">
              <circle cx="45%" cy="50%" r="75" />
              <circle cx="55%" cy="50%" r="75" />
            </clipPath>
          </defs>
        </svg>

        <h1></h1>
        <img src="kandc-bw.png" alt="kiesha and colin" />
      </Container>
    </Main>
  )
}

export default Home
