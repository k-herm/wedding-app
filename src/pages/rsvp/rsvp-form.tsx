import React, {
  useState,
  useEffect,
  ChangeEvent,
  Dispatch,
  SetStateAction
} from 'react'
import { Link } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import GuestTable from './guest-table'

import { Guest } from './index'
import { weddingDate, weddingTime, rsvpDeadline } from '../../constants'
import { capitalize } from '../../utils/helpers'
import { cardIn, cardOut } from './animation'
import useRequest from '../../utils/use-request'

type RsvpFormProps = {
  guests: Guest[]
  setGuests: Dispatch<SetStateAction<Guest[]>>
  setGuestsNotAttending: Dispatch<SetStateAction<Guest[]>>
  onSubmit: () => void
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  showCard: boolean
}

const RsvpForm = ({
  guests,
  setGuests,
  setGuestsNotAttending,
  onSubmit,
  setOpenDialog,
  showCard
}: RsvpFormProps): JSX.Element => {
  const [name, setName] = useState({ firstName: '', lastName: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [hasRsvpError, setHasRsvpError] = useState(false)

  useEffect(() => {
    cardIn()
    return () => {
      cardOut()
    }
  }, [showCard])

  const request = useRequest()

  const getInvite = async (): Promise<void> => {
    const response = await request('/api/get-invite', {
      first_name: capitalize(name.firstName),
      last_name: capitalize(name.lastName)
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

  const handleRsvp = () => {
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
      onSubmit()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName({ ...name, [e.target.name]: e.target.value })

  return (
    <Card className={`rsvp_card ${showCard ? 'cardIn' : 'cardOut'}`} raised>
      <div>
        <IconButton className="backButton" aria-label="delete">
          <Link to="/">X</Link>
        </IconButton>
        <Typography variant="h2" align="center" gutterBottom>
          r.s.v.p
        </Typography>
        <Typography variant="h3" align="center" color="secondary" gutterBottom>
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
      </div>

      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}

      <GuestTable setGuests={setGuests} guests={guests} error={hasRsvpError} />

      <div className="actionButtons">
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
  )
}

export default RsvpForm
