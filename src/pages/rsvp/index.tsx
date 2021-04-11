import React, { useState, useEffect, ChangeEvent } from 'react'
import gsap from 'gsap'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import GuestTable from './guest-table'
import ConfirmDialog from './confirm-dialog'
import { Wrapper } from './index-sc'

import useRequest from '../../utils/use-request'
import { weddingDate, weddingTime, rsvpDeadline } from '../../constants'

export type Guest = {
  first_name: string
  last_name: string
  attending: boolean
  food_preference: string
  submitted: boolean
}

const Rsvp = (): JSX.Element => {
  const [name, setName] = useState({ firstName: '', lastName: '' })
  const [guests, setGuests] = useState<Guest[]>([])
  const [guestsNotAttending, setGuestsNotAttending] = useState<Guest[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [hasRsvpError, setHasRsvpError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const request = useRequest()

  // useEffect(() => {
  //   if (guests.length) {
  //   }
  // }, [guests])

  const getInvite = async (): Promise<void> => {
    const response = await request('/api/get-invite', {
      first_name: name.firstName,
      last_name: name.lastName
    })

    if (response.error) {
      setErrorMessage(response.error)
      return
    }
    const guests = response.data as Guest[]
    if (!guests.length) {
      setErrorMessage(
        'Sorry we could not find your invite. Try another name or drop us a message!'
      )
      return
    }

    if (new Date() > rsvpDeadline && guests[0].submitted) {
      setErrorMessage('Need to update your rsvp? Send us an email!')
      return
    }

    setErrorMessage('')
    setGuests(guests)
  }

  const onSubmit = async () => {
    setHasRsvpError(false)
    const response = await request('/api/send-rsvp', {
      data: guests.map(guest => ({ ...guest, submitted: true }))
    })
    console.log(response)
  }

  const handleRsvp = async () => {
    let missingData = false
    const notComing: Guest[] = []
    guests.forEach(guest => {
      if (guest.attending && !guest.food_preference) {
        missingData = true
        setHasRsvpError(true)
      }
      if (!guest.attending) {
        notComing.push(guest)
      }
    })

    setGuestsNotAttending(notComing)
    if (!missingData && notComing.length) {
      setOpenDialog(true)
      return
    }

    if (!missingData) {
      await onSubmit()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName({ ...name, [e.target.name]: e.target.value })

  return (
    <Wrapper>
      <Card className="rsvp_card" raised>
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

        <div className="textFields">
          <TextField
            required
            name="firstName"
            label="First Name"
            inputProps={{ 'aria-label': 'first name' }}
            type="text"
            value={name.firstName}
            onChange={handleChange}
          />

          <TextField
            required
            name="lastName"
            label="Last Name"
            inputProps={{ 'aria-label': 'last name' }}
            type="text"
            value={name.lastName}
            onChange={handleChange}
          />

          {errorMessage && (
            <FormHelperText error>{errorMessage}</FormHelperText>
          )}
        </div>

        <GuestTable
          setGuests={setGuests}
          guests={guests}
          error={hasRsvpError}
        />

        <div className="buttons">
          <Button
            variant="outlined"
            color="primary"
            component="a"
            href="mailto:kiesha.herman@gmail.com"
          >
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

      <ConfirmDialog
        isOpen={openDialog}
        setIsOpen={setOpenDialog}
        guestsNotAttending={guestsNotAttending}
        onSubmit={onSubmit}
      />
    </Wrapper>
  )
}

export default Rsvp
