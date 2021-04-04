import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import GuestTable from './guest-table'

import { colors, mediaBreaks } from '../../theme'
import useRequest from '../../utils/use-request'

const Wrapper = styled.div`
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

  @media (max-width: ${mediaBreaks.phone}px) {
    .rsvp_card {
      padding: 1rem;
    }
    h3 {
      font-size: 2.75rem;
    }
  }
`

export type Guest = {
  first_name: string
  last_name: string
  attending: boolean
  food_preference: string
}

const Rsvp = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const request = useRequest()

  // useEffect(() => {
  //   if (guests.length) {
  //   }
  // }, [guests])

  const getInvite = async (): Promise<void> => {
    const response = await request('/api/get-invite', { email })
    if (response.error) {
      setHasError(true)
      setErrorMessage(response.error)
      return
    }
    const guests = response.data as Guest[]
    if (!guests.length) {
      setHasError(true)
      setErrorMessage(
        'Sorry we could not find your email. Try another or drop us a message!'
      )
      return
    }
    setHasError(false)
    setErrorMessage('')
    setGuests(guests)
  }

  const handleRsvp = () => {
    console.log('logged')
  }

  return (
    <Wrapper>
      <Card className="rsvp_card">
        <div className="header">
          <Typography variant="h2" align="center" gutterBottom>
            r.s.v.p
          </Typography>
          <Typography variant="h3" align="center" gutterBottom>
            Kiesha & Colin
          </Typography>
          <Typography variant="h4" align="center" gutterBottom>
            Date
          </Typography>
        </div>

        <TextField
          className="email_input"
          required
          name="email"
          label="Email"
          inputProps={{ 'aria-label': 'email' }}
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          error={hasError}
          helperText={hasError && errorMessage}
        />

        <GuestTable setGuests={setGuests} guests={guests} />

        <div className="buttons">
          <Button variant="outlined" color="primary">
            Email us
          </Button>
          {guests.length ? (
            <Button variant="contained" color="primary" onClick={handleRsvp}>
              RSVP!
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={getInvite}>
              Find my invite
            </Button>
          )}
        </div>
      </Card>
    </Wrapper>
  )
}

export default Rsvp
