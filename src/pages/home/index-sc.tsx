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
    font-family: 'Nunito Sans', sans-serif;
    font-size: 3.5rem;
    background: ${colors.blackGrey};
    font-weight: bold;
    color: white;
    padding: 1.2rem;
    border-radius: 10px;
    z-index: 2;
    text-align: center;
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

  #reloadIcon {
    width: 85px;
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }

  @media (max-width: ${mediaBreaks.phone}px) {
    h1 {
      font-size: 2.5rem;
      margin-left: 5px;
      margin-right: 5px;
    }
    #reloadIcon {
      width: 50px;
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
