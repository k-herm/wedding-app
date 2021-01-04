import styled from 'styled-components'
import { colors } from '../../theme'

export const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 100vh; */
`

export const Container = styled.div`
  background: url('habrich-bg.jpg') center no-repeat;
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
