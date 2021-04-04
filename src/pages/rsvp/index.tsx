import React, { useState, useEffect } from 'react'
import gsap from 'gsap'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import GuestTable from './guest-table'
import { Wrapper } from './index-sc'

import useRequest from '../../utils/use-request'
import { weddingDate, weddingTime } from '../../constants'

export type Guest = {
  first_name: string
  last_name: string
  attending: boolean
  food_preference: string
}

const Rsvp = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [hasRsvpError, setHasRsvpError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const request = useRequest()

  // useEffect(() => {
  //   if (guests.length) {
  //   }
  // }, [guests])

  // TO DO = if you've already rsvp'd, ask them to email you to update (after a certain date)
  const getInvite = async (): Promise<void> => {
    const response = await request('/api/get-invite', { email })
    if (response.error) {
      setErrorMessage(response.error)
      return
    }
    const guests = response.data as Guest[]
    if (!guests.length) {
      setErrorMessage(
        'Sorry we could not find your email. Try another or drop us a message!'
      )
      return
    }
    setErrorMessage('')
    setGuests(guests)
  }

  // TO DO add a modal - confirm i will not be attending
  const handleRsvp = async () => {
    let missingData = false
    guests.forEach(guest => {
      if (guest.attending && !guest.food_preference) {
        missingData = true
        setHasRsvpError(true)
      }
    })
    if (!missingData) {
      setHasRsvpError(false)
      const response = await request('/api/send-rsvp', { data: guests })
      console.log(response)
    }
  }

  return (
    <Wrapper>
      <Card className="rsvp_card">
        <div>
          <Typography variant="h2" align="center" gutterBottom>
            r.s.v.p
          </Typography>
          <Typography
            variant="h3"
            align="center"
            color="secondary"
            gutterBottom
          >
            Kiesha{' '}
            <span>
              <img id="hearts" src="two-linked-hearts.ico" alt="hearts" />
            </span>{' '}
            Colin
          </Typography>
          <Typography
            variant="h4"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            {`${weddingDate} at ${weddingTime}`}
          </Typography>
        </div>

        <TextField
          required
          name="email"
          label="Email"
          inputProps={{ 'aria-label': 'email' }}
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          error={!!errorMessage}
          helperText={errorMessage}
        />

        <GuestTable
          setGuests={setGuests}
          guests={guests}
          error={hasRsvpError}
        />

        {/* TO DO = add email link */}
        {/* TO DO = option to find a different invite???? */}
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
