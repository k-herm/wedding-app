import React, { useRef, useState, useEffect } from 'react'
import gsap, { TimelineLite } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

import { Container, ClimbPathContainer } from './index-sc'
import { mediaBreaks } from '../../theme'
import { ReactComponent as ClimbPath } from './climbPath.svg'

gsap.registerPlugin(TextPlugin)

const Home = (): JSX.Element => {
  const containerRef = useRef<HTMLElement | null>(null)
  const [viewBox, setViewBox] = useState<{ vw: number; vh: number }>({
    vw: 1300,
    vh: 850
  })

  const [climbPathLength, setClimbPathLength] = useState(0)
  useEffect(() => {
    if (containerRef.current) {
      const path: SVGPathElement | null = document.querySelector(
        '#climbPathSVG path'
      )
      setClimbPathLength(path?.getTotalLength() || 0)
    }
  }, [containerRef.current])

  // useEffect(() => {
  //   if (containerRef.current) {
  //     setViewBox({
  //       vw: containerRef.current.clientWidth,
  //       vh: containerRef.current.clientHeight
  //     })
  //   }
  // }, [containerRef.current])

  useEffect(() => {
    if (containerRef.current) {
      const t1 = new TimelineLite({ delay: 1 })

      t1.fromTo(
        '#motionPath',
        { strokeDashoffset: climbPathLength },
        { strokeDashoffset: 0, duration: 2 }
      )

      //     t1.to('circle', { r: 850, duration: 2 })
      //     t1.fromTo(
      //       'img',
      //       { rotationX: 180, transformOrigin: '0% 100%' },
      //       { rotationX: 0, duration: 2, ease: 'bounce' }
      //     )
      //     t1.fromTo(
      //       'h1',
      //       { display: 'none' },
      //       {
      //         display: 'block',
      //         duration: 2,
      //         text: "We're getting married!",
      //         ease: 'none'
      //       }
      //     )
      //     t1.to('h1', {
      //       duration: 1,
      //       text: 'Get ready for 2022!',
      //       ease: 'none',
      //       delay: 1.5
      //     })
    }
  }, [containerRef.current])

  const cx = ((): { left: string; right: string } => {
    if (viewBox.vw <= mediaBreaks.phone) {
      return { left: '37%', right: '63%' }
    }
    if (viewBox.vw <= mediaBreaks.tablet) {
      return { left: '42%', right: '58%' }
    } else {
      return { left: '47%', right: '53%' }
    }
  })()

  return (
    <Container
      ref={ref => {
        containerRef.current = ref
      }}
    >
      {/* <svg id="binoSVG" viewBox={`0 0 ${viewBox.vw} ${viewBox.vh}`}>
        <defs>
          <clipPath id="binoculars">
            <circle cx={cx.left} cy="50%" r="75" />
            <circle cx={cx.right} cy="50%" r="75" />
          </clipPath>
        </defs>
      </svg> */}

      {/* <h1></h1> */}

      <ClimbPathContainer pathLength={climbPathLength}>
        <ClimbPath id="climbPathSVG" />
      </ClimbPathContainer>

      {/* <img id="kcImage" src="kandc-bw.png" alt="kiesha and colin" /> */}
    </Container>
  )
}

export default Home
