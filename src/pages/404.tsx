import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { colors } from '../theme'

const PageWrapper = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  justify-items: center;
  height: 100vh;
  color: ${colors.green};

  h1 {
    display: flex;
    font-family: 'Fredoka One', cursive;
    font-size: 8rem;

    span {
      padding: 0 5px;
      img {
        margin-left: 1rem;
        vertical-align: middle;
      }
    }
  }

  h3 {
    padding: 1rem;
  }

  button {
    margin-top: 1rem;
    font-size: 1.5rem;
  }

  a {
    text-decoration: none;
  }
`

const PageDoesNotExist = (): JSX.Element => (
  <PageWrapper>
    <Typography variant="h1" component="h1">
      4
      <span>
        <img src="pusheen_cake.png" alt="pusheen loves cake" />
      </span>
      4
    </Typography>
    <Typography variant="h3" align="center">
      Oops! This page doesn&apos;t exist
    </Typography>
    <Link to="/">
      <Button variant="contained" color="primary">
        Take me home
      </Button>
    </Link>
  </PageWrapper>
)

export default PageDoesNotExist
