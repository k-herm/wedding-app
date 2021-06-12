import React, { useState } from 'react'

import RsvpForm from './rsvp-form'
import ThankYou from './thank-you'
import ConfirmDialog from './confirm-dialog'
import { Wrapper } from './index-sc'

import useRequest from '../../utils/use-request'

export type Guest = {
  first_name: string
  last_name: string
  attending: boolean
  food_preference: string
  submitted: boolean
  email?: string
}

type RsvpProps = {
  mount: boolean
}

const Rsvp = ({ mount }: RsvpProps): JSX.Element => {
  const [guests, setGuests] = useState<Guest[]>([])
  const [guestsNotAttending, setGuestsNotAttending] = useState<Guest[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const request = useRequest()

  const onSubmit = async () => {
    const response = await request('/api/send-rsvp', {
      data: guests.map(guest => ({ ...guest, submitted: true }))
    })
    if (response.data) {
      setGuests(response.data as Guest[])
      setShowThankYou(true)
    }
  }

  return (
    <Wrapper>
      {mount && (
        <>
          <ThankYou guests={guests} showCard={showThankYou} />
          <RsvpForm
            guests={guests}
            setGuests={setGuests}
            setGuestsNotAttending={setGuestsNotAttending}
            onSubmit={onSubmit}
            setOpenDialog={setOpenDialog}
            showCard={!showThankYou}
          />
          <ConfirmDialog
            isOpen={openDialog}
            setIsOpen={setOpenDialog}
            guestsNotAttending={guestsNotAttending}
            onSubmit={onSubmit}
          />
        </>
      )}
    </Wrapper>
  )
}

export default Rsvp
