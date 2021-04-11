import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

import { Guest } from './'

const DialogWrapper = styled.div`
  li,
  p {
    text-align: center;
  }
  ul {
    margin-bottom: 1rem;
  }

  .MuiDialogActions-root {
    justify-content: space-between;
  }
  .MuiDialogContent-root {
    min-width: 250px;
    margin-bottom: 1rem;
  }
`

type ConfirmDialogProps = {
  guestsNotAttending: Guest[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onSubmit: () => void
}

const ConfirmDialog = ({
  guestsNotAttending,
  isOpen,
  setIsOpen,
  onSubmit
}: ConfirmDialogProps): JSX.Element => {
  const handleClose = () => setIsOpen(false)
  const handleSubmit = () => {
    handleClose()
    onSubmit()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="confirm not attending"
    >
      <DialogWrapper>
        <DialogTitle>Confirm RSVP</DialogTitle>

        <DialogContent>
          <List>
            {guestsNotAttending.map((guest: Guest) => (
              <ListItem key={JSON.stringify(guest)}>
                <ListItemText>{`${guest.first_name} ${guest.last_name}`}</ListItemText>
              </ListItem>
            ))}
          </List>
          <DialogContentText>will not be joining the event.</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Whoops!
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </DialogWrapper>
    </Dialog>
  )
}

export default ConfirmDialog
