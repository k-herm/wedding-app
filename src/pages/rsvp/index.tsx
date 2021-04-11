import React, { useState, ChangeEvent } from 'react'

import RsvpForm from './rsvp-form'
import ConfirmDialog from './confirm-dialog'
import { Wrapper } from './index-sc'

import useRequest from '../../utils/use-request'

export type Guest = {
  first_name: string
  last_name: string
  attending: boolean
  food_preference: string
  submitted: boolean
}

const Rsvp = (): JSX.Element => {
  const [openDialog, setOpenDialog] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [guestsNotAttending, setGuestsNotAttending] = useState<Guest[]>([])

  const request = useRequest()

  const onSubmit = async () => {
    const response = await request('/api/send-rsvp', {
      data: guests.map(guest => ({ ...guest, submitted: true }))
    })
    console.log(response)
  }

  return (
    <Wrapper>
      <RsvpForm
        guests={guests}
        setGuests={setGuests}
        setGuestsNotAttending={setGuestsNotAttending}
        onSubmit={onSubmit}
        setOpenDialog={setOpenDialog}
      />
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
