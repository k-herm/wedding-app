import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { TimelineLite } from 'gsap'

const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 100vh; */
`

const ImageContainer = styled.div`
  background: url('habrich-bg-2.png') center no-repeat;
  background-size: cover;
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 100vh;
  /* min-height: 850px; */

  display: flex;
  justify-content: center;
  align-items: flex-end;

  clip-path: url(#binoculars);

  img {
    width: 100%;
    max-width: 750px;
    height: auto;
  }

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`

const App = (): JSX.Element => {
  const containerRef = useRef<HTMLElement | null>(null)

  const vw = containerRef.current?.clientWidth || 1200
  const vh = containerRef.current?.clientHeight || 850

  useEffect(() => {
    const t1 = new TimelineLite()

    t1.to('circle', { r: 540, duration: 2 })
    t1.fromTo(
      'img',
      { rotationX: 180, transformOrigin: '0% 100%' },
      { rotationX: 0, duration: 2, ease: 'elastic' }
    )
  }, [])

  return (
    <Main>
      <ImageContainer
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
        <img src="kandc-bw.png" alt="kiesha and colin" />
      </ImageContainer>
    </Main>
  )
}

export default App
