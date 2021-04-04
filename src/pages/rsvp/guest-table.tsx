import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

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

import { Guest } from './index'

const TableWrapper = styled.div`
  .select {
    width: 100%;
  }
`

type GuestTableProps = {
  guests: Guest[]
  setGuests: Dispatch<SetStateAction<Guest[]>>
}

const GuestTable = ({ guests, setGuests }: GuestTableProps): JSX.Element => {
  const handleCheck = (guest: Guest) => {
    setGuests(
      [...guests].map(g => {
        if (g.first_name === guest.first_name) {
          g.attending = !g.attending
        }
        return g
      })
    )
  }

  return (
    <TableWrapper>
      <TableContainer component={Paper}>
        <Table className="table" aria-label="guest-list">
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
            {guests.map(guest => (
              <TableRow key={JSON.stringify(guest)}>
                <TableCell
                  component="th"
                  scope="row"
                >{`${guest.first_name} ${guest.last_name}`}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={guest.attending}
                    onChange={() => handleCheck(guest)}
                    color="primary"
                    size="small"
                    inputProps={{
                      'aria-label': `${guest.first_name} attending`
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    // value={age}
                    // onChange={handleChange}
                    className="select"
                    inputProps={{
                      'aria-label': `${guest.first_name} food preference`
                    }}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </TableWrapper>
  )
}

export default GuestTable
