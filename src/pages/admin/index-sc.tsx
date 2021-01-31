import styled from 'styled-components'
import { colors } from '../../theme'

type ContainerProps = {
  pColor: boolean
}

export const Container = styled.div<ContainerProps>`
  margin: 2rem;

  p {
    padding: 1rem;
    border-radius: 5px;
    background-color: ${props =>
      props.pColor ? colors.success : colors.error};
    transform-origin: top;
    @keyframes reveal {
      from {
        transform: scaleY(0);
      }
      to {
        transform: scaleY(100%);
      }
    }
    animation: reveal 0.5s;
  }

  section,
  form {
    display: flex;
    flex-direction: column;
    * {
      margin: 0.5rem 0;
    }
  }

  button {
    padding: 7px;
    width: 100px;
  }
`
