import React, {
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  ChangeEvent
} from 'react'
import styled from 'styled-components'
import gsap from 'gsap'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

import { Guest } from './index'
import { foodChoices } from '../../constants'
import { mediaBreaks } from '../../theme'

const TableWrapper = styled.div`
  width: 100%;

  .select {
    width: 100%;
  }

  @media (max-width: ${mediaBreaks.phone}px) {
    th,
    td {
      padding: 0.75rem;
    }
  }
`

type GuestTableProps = {
  guests: Guest[]
  setGuests: Dispatch<SetStateAction<Guest[]>>
  error: boolean
}

const GuestTable = ({
  guests,
  setGuests,
  error
}: GuestTableProps): JSX.Element => {
  const ref = useRef<HTMLElement>()
  useEffect(() => {
    if (guests.length) {
      gsap.from('.MuiTableContainer-root', {
        opacity: 0,
        height: 0,
        display: 'none',
        duration: 0.7,
        onComplete: () => ref.current?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [guests.length])

  const handleCheck = (e: ChangeEvent<HTMLInputElement>, guest: Guest) => {
    setGuests(
      guests.map(g => {
        if (g.first_name === guest.first_name) {
          g.attending = e.target.checked
          if (!e.target.checked) {
            g.food_preference = ''
          }
        }
        return g
      })
    )
  }

  const handleSelect = (e: ChangeEvent<{ value: unknown }>, guest: Guest) => {
    setGuests(
      guests.map(g => {
        if (g.first_name === guest.first_name) {
          g.food_preference = e.target.value as string
        }
        return g
      })
    )
  }

  return (
    <TableWrapper>
      <TableContainer component={Paper} ref={ref}>
        <Table aria-label="guest-list">
          {guests.length ? (
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Attending</TableCell>
                <TableCell>Food Preference</TableCell>
              </TableRow>
            </TableHead>
          ) : (
            <></>
          )}

          <TableBody>
            {guests.map(guest => {
              const hasError =
                error && guest.attending && !guest.food_preference
              return (
                <TableRow key={JSON.stringify(guest)}>
                  <TableCell
                    component="th"
                    scope="row"
                  >{`${guest.first_name} ${guest.last_name}`}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={guest.attending}
                      onChange={e => handleCheck(e, guest)}
                      color="primary"
                      size="small"
                      inputProps={{
                        'aria-label': `${guest.first_name} attending`
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl className="select" error={hasError}>
                      <Select
                        value={guest.food_preference || ''}
                        onChange={e => handleSelect(e, guest)}
                        disabled={!guest.attending}
                        inputProps={{
                          'aria-label': `${guest.first_name} food preference`
                        }}
                      >
                        {foodChoices.map((choice, i) => (
                          <MenuItem key={`${choice}_${i}`} value={choice}>
                            {choice}
                          </MenuItem>
                        ))}
                      </Select>
                      {hasError && (
                        <FormHelperText>
                          Mmm don&apos;t want to forget to pick one!
                        </FormHelperText>
                      )}
                    </FormControl>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </TableWrapper>
  )
}

export default GuestTable
