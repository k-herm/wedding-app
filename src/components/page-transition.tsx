import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { TimelineLite } from 'gsap'

import { colors } from '../theme'

type PageTransitionProps = {
  children: React.ReactNode
}

const TransitionWrapper = styled.div`
  #slider {
    display: none;
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: ${colors.green};
    transform: skewX(-5deg) translateX(-50px);
  }
`
const PageTransition = ({ children }: PageTransitionProps): JSX.Element => {
  const location = useLocation()

  useEffect(() => {
    const t1 = new TimelineLite()
    t1.set('#slider', { display: 'block' })
    t1.fromTo('#slider', { width: '0%' }, { width: '100%', duration: 1 })
    t1.to('#slider', { width: '0%', display: 'none', duration: 1 })
  }, [location])

  return (
    <TransitionWrapper>
      <div id="slider" />
      {children}
    </TransitionWrapper>
  )
}

export default PageTransition
