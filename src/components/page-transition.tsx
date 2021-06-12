import React from 'react'
import { useLocation, RouteProps } from 'react-router-dom'
import styled from 'styled-components'
import { SwitchTransition, Transition } from 'react-transition-group'
import { gsap } from 'gsap'

import { colors } from '../theme'

type PageTransitionProps = {
  children(props: RouteProps): JSX.Element
}

const TransitionWrapper = styled.div`
  #slider {
    display: none;
    position: absolute;
    z-index: 2;
    width: 120%;
    height: 100%;
    background-color: ${colors.green};
    transform: skewX(-5deg) translateX(-50px);
  }
`
// TO DO check back/forward button is working with page transitions
const PageTransition = ({ children }: PageTransitionProps): JSX.Element => {
  const location = useLocation()

  const onEnter = () => {
    gsap.fromTo(
      '#slider',
      { x: '-10%', display: 'block' },
      { x: '100%', display: 'none', duration: 0.75 }
    )
  }

  const onExit = () => {
    gsap.fromTo(
      '#slider',
      { display: 'block', x: '-100%' },
      { x: '-10%', duration: 0.75 }
    )
  }

  return (
    <SwitchTransition mode="out-in">
      <Transition
        key={location.pathname}
        onEnter={onEnter}
        onExit={onExit}
        addEndListener={(node, done) =>
          node.addEventListener('transitionend', done, false)
        }
      >
        <TransitionWrapper>
          <div id="slider" />
          {children({ location })}
        </TransitionWrapper>
      </Transition>
    </SwitchTransition>
  )
}

export default PageTransition
