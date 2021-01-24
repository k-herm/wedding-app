import styled from 'styled-components'
import { mediaBreaks, colors } from '../../theme'

export const Container = styled.div`
  background: url('habrich-bg.jpg') center no-repeat;
  background-size: cover;
  position: relative;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  clip-path: url(#binoculars);

  h1 {
    display: none;
    position: absolute;
    top: 0;
    font-family: 'Codystar', cursive;
    font-size: 3.5rem;
    background: ${colors.blackGrey};
    font-weight: bold;
    color: white;
    padding: 1.2rem;
    z-index: 2;
  }

  #kcImage {
    width: 120%;
    max-width: 750px;
    height: auto;
  }

  #emoji {
    display: none;
    position: absolute;
    font-size: 20rem;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  #binoSVG {
    position: absolute;
  }
  @media (max-width: ${mediaBreaks.phone}px) {
    h1 {
      font-size: 2.5rem;
    }
  }
`

type ClimbPathProps = {
  pathLength: number
}

export const ClimbPathContainer = styled.div<ClimbPathProps>`
  width: 100%;
  height: 100%;
  position: absolute;

  #climbPathSVG {
    .inner {
      stroke: ${colors.terracotta};
      stroke-width: 4;
    }
    .outer {
      stroke: ${colors.darkGreen};
      stroke-width: 8;
    }
    #motionPath {
      stroke-width: 10;
      stroke-dasharray: ${props => props.pathLength};
    }

    #pathMaskReveal {
      display: none;
    }
    #ring {
      display: none;
    }
  }
`
