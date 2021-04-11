import React, { useEffect } from 'react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { Guest } from './index'

import useRequest from '../../utils/use-request'

type ThankYouCardProps = {
  guests: Guest[]
}

const ThankYouCard = ({ guests }: ThankYouCardProps): JSX.Element => {
  const emails = guests.map(guest => guest.email)
  const notAttending = guests.every(guest => !guest.attending)

  useEffect(() => {
    // const request = useRequest()
    // TO DO send condirmation email
  }, [])

  return (
    <Card className="rsvp_card" raised>
      <div>
        <Typography variant="h2" align="center" gutterBottom>
          r.s.v.p
        </Typography>
        <Typography variant="h3" align="center" color="secondary" gutterBottom>
          Thank you {notAttending ? 'for letting us know' : ' '}
          <span>
            <img id="hearts" src="two-linked-hearts.ico" alt="hearts" />
          </span>
        </Typography>
        <Typography
          variant="h4"
          align="center"
          color="textSecondary"
          gutterBottom
        >
          {notAttending
            ? 'We will miss your presence at the wedding.'
            : "We can't wait to share our special day with you!"}
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          gutterBottom
        >
          A confirmation has been sent to:
          <ul>{emails.map(email => (email ? <li>{email}</li> : <></>))}</ul>
        </Typography>
      </div>

      <Button variant="contained" color="primary" component="a" href="/">
        Home
      </Button>
    </Card>
  )
}

export default ThankYouCard