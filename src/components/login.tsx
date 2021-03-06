import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'

import Card from '@material-ui/core/Card'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { SignInFunction } from '../utils/auth-context'

const LoginWrapper = styled.div`
  z-index: 2;
  width: 100%;
  height: 100vh;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  .login_card {
    padding: 1.5rem;
    max-width: 600px;
    margin: 0.5rem;
    min-width: 290px;
    min-height: 150px;
  }
  .login_input {
    margin: 1rem 0;
  }
  .login_button_wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`

type LoginProps = {
  signIn?: SignInFunction
  showLogin: boolean
}

const Login = ({ signIn, showLogin }: LoginProps): JSX.Element => {
  const [password, setPassword] = useState('')
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [removeLogin, setRemoveLogin] = useState(!showLogin)

  useEffect(() => {
    if (showLogin) {
      setRemoveLogin(false)
    } else {
      gsap
        .to('#login_screen', { opacity: 0, duration: 0.5 })
        .then(() => setRemoveLogin(true))
    }
  }, [showLogin])

  useEffect(() => {
    if (!removeLogin) {
      gsap.from('#login_screen', { opacity: 0, duration: 1 })
    }
  }, [removeLogin])

  const handleClick = async (): Promise<void> => {
    if (signIn && password) {
      const result = await signIn(password)
      if (result.error) {
        setHasError(true)
        setErrorMessage(result.error)
      } else {
        setHasError(false)
        setErrorMessage('')
      }
    }
  }

  if (removeLogin) return <></>
  return (
    <LoginWrapper id="login_screen">
      <Card className="login_card" raised>
        <Typography gutterBottom variant="h5" component="h2">
          Hey there! Please sign in with the password from your invite ????
        </Typography>
        <TextField
          className="login_input"
          required
          name="password"
          label="Password"
          inputProps={{ 'aria-label': 'password' }}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          error={hasError}
          helperText={hasError && errorMessage}
        />
        <div className="login_button_wrapper">
          <Button variant="outlined" color="primary" onClick={handleClick}>
            Unlock
          </Button>
        </div>
      </Card>
    </LoginWrapper>
  )
}

export default Login
