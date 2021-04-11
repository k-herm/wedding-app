import styled from 'styled-components'
import { colors, mediaBreaks } from '../../theme'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${colors.lightGreen} url('flower-frame.png') no-repeat fixed
    center;

  h2,
  h3,
  h4 {
    font-family: 'Fredericka the Great', cursive;
    font-weight: 600;
  }

  .rsvp_card {
    display: grid;
    grid-gap: 2rem;
    justify-items: center;
    padding: 2rem;
    margin: 0.5rem;
  }

  .MuiFormHelperText-root {
    font-size: 0.9rem;
  }

  .textFields {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    * {
      flex-grow: 1;
      margin-bottom: 5px;
      margin-right: 5px;
    }
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
      padding: 0.8rem;
    }
    h3 {
      font-size: 2.75rem;
    }
    h4 {
      font-size: 1.75rem;
    }
  }
`
