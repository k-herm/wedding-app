import styled from 'styled-components'
import { colors } from '../../theme'

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
    position: absolute;
    top: 0;
    font-family: 'Codystar', cursive;
    font-size: 4rem;
    background: ${colors.blackGrey};
    font-weight: bold;
    color: white;
    padding: 1.2rem;
  }

  #kcImage {
    width: 120%;
    max-width: 750px;
    height: auto;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  #binoSVG {
    position: absolute;
  }
`

type ClimbPathProps = {
  pathLength: number
}

export const ClimbPathContainer = styled.div<ClimbPathProps>`
  width: 100%;
  height: 100%;

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

    #heart {
      stroke: ${colors.darkGreen};
      stroke-width: 3;
      fill: ${colors.terracotta};
    }
  }
`
