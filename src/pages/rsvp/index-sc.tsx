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

  h5 {
    margin-top: 2rem;
    font-size: 1.2rem;

    ul {
      list-style-type: none;
      padding-left: 0;
    }
  }

  .rsvp_card {
    display: grid;
    grid-gap: 2rem;
    justify-items: center;
    padding: 2rem;
    margin: 0.5rem;
    max-width: 650px;
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

  a {
    text-decoration: none;
  }
  .actionButtons {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .backButton {
    position: absolute;
    right: 2rem;
    top: 1.2rem;
    border-radius: unset;
    a {
      color: inherit;
    }
  }
  .whiteLink {
    color: white;
  }

  #hearts {
    width: 80px;
    margin: 0 -1.75rem;
    vertical-align: middle;
  }

  // for animations
  .cardIn {
    display: none;
  }
  .cardOut {
    display: none;
  }

  @media (max-width: ${mediaBreaks.phone}px) {
    .rsvp_card {
      padding: 0.8rem;
    }
    .backButton {
      right: 0.1rem;
      top: 0.1rem;
    }
    h3 {
      font-size: 2.75rem;
    }
    h4 {
      font-size: 1.75rem;
    }
  }
`
