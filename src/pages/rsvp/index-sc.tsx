import styled from 'styled-components'
import { colors, mediaBreaks } from '../../theme'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  /* background-color: ${colors.lightGreen}; */

  .rsvp_card {
    display: grid;
    grid-gap: 2rem;
    justify-items: center;
    padding: 2rem;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  #hearts {
    width: 80px;
    margin: 0 -1.75rem;
    vertical-align: middle;
  }

  @media (max-width: ${mediaBreaks.phone}px) {
    .rsvp_card {
      padding: 1rem;
    }
    h3 {
      font-size: 2.75rem;
    }
  }
`
