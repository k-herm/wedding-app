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

  .card {
    padding: 1.5rem;
    min-width: 290px;
    min-height: 150px;
  }
  .input {
    margin: 1rem 0;
  }
`

const Login = (): JSX.Element => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const auth = useAuthContext()

  return (
    <LoginWrapper>
      <Card className="card">
        <Typography gutterBottom variant="h5" component="h2">
          You feeling lucky?
        </Typography>
        <TextField
          className="input"
          required
          name="password"
          label="Password"
          inputProps={{ 'aria-label': 'password' }}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />
        <Button variant="outlined" color="primary">
          Submit
        </Button>
      </Card>
    </LoginWrapper>
  )
}

export default Login
