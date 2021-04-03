import React, { useRef, useState, useEffect } from 'react'
import { Container, ClimbPathContainer } from './index-sc'
import { mediaBreaks } from '../../theme'
import { ReactComponent as ClimbPath } from './climbPath.svg'
import animateTimeline from './animation'

const Home = (): JSX.Element => {
  const [shouldAnimate, setShouldAnimate] = useState<boolean | null>(null)
  useEffect(() => {
    if (document.cookie.match(/kc_hasplayed=true/)) {
      setShouldAnimate(false)
    } else {
      setShouldAnimate(true)
      document.cookie = `kc_hasplayed=true;max-age=${
        60 * 60 * 24 * 30
      };secure;same-site`
    }
  }, [])

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

  useEffect(() => {
    if (containerRef.current) {
      setViewBox({
        vw: containerRef.current.clientWidth,
        vh: containerRef.current.clientHeight
      })
    }
  }, [containerRef.current])

  useEffect(() => {
    if (containerRef.current) {
      const t1 = animateTimeline(climbPathLength, viewBox.vw)
      if (shouldAnimate) {
        t1.invalidate()
        t1.play('start')
        t1.eventCallback('onComplete', () => setShouldAnimate(false))
      } else if (shouldAnimate === false) {
        t1.seek('end')
      } else {
        t1.seek('start')
        t1.pause()
      }
    }
  }, [shouldAnimate])

  const onRestart = () => setShouldAnimate(true)

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
      <svg id="binoSVG" viewBox={`0 0 ${viewBox.vw} ${viewBox.vh}`}>
        <defs>
          <clipPath id="binoculars">
            <circle cx={cx.left} cy="50%" r="75" />
            <circle cx={cx.right} cy="50%" r="75" />
          </clipPath>
        </defs>
      </svg>

      <h1></h1>

      <ClimbPathContainer pathLength={climbPathLength}>
        <ClimbPath id="climbPathSVG" />
      </ClimbPathContainer>

      <div id="emoji">😱</div>
      <img id="kcImage" src="kandc-bw.png" alt="kiesha and colin" />

      <img
        id="reloadIcon"
        src="reload-icon.png"
        alt="reload icon"
        onClick={onRestart}
      />
    </Container>
  )
}

export default Home
