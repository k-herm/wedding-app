import React, { useState } from 'react'
import styled from 'styled-components'

import Card from '@material-ui/core/Card'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { useAuthContext } from '../utils/auth-context'

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

const Login = (): JSX.Element => {
  const [password, setPassword] = useState('')
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const auth = useAuthContext()

  const handleClick = async (): Promise<void> => {
    if (auth.signIn && password) {
      const result = await auth.signIn(password)
      if (result.error) {
        setHasError(true)
        setErrorMessage(result.error)
      } else {
        setHasError(false)
        setErrorMessage('')
      }
    }
  }

  return (
    <LoginWrapper>
      <Card className="login_card">
        <Typography gutterBottom variant="h5" component="h2">
          You feeling lucky?
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
