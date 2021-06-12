import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { render, fireEvent, waitFor } from '@testing-library/react'
import fetch from 'isomorphic-fetch'
import Rsvp from '../index'

jest.mock('isomorphic-fetch')
jest.mock('gsap', () => ({
  from: jest.fn(),
  fromTo: jest.fn(),
  to: jest.fn(),
  set: jest.fn(),
  registerPlugin: jest.fn()
}))

describe('rsvp', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const renderRsvp = () =>
    render(
      <BrowserRouter>
        <Switch>
          <Rsvp mount={true} />
        </Switch>
      </BrowserRouter>
    )

  const fillInName = (getByLabelText, getByText) => {
    fireEvent.change(getByLabelText('first name'), {
      target: { value: 'k' }
    })
    fireEvent.change(getByLabelText('last name'), {
      target: { value: 'h' }
    })
    fireEvent.click(getByText('Find my invite'))
  }

  const guests = [
    {
      first_name: 'K',
      last_name: 'H',
      attending: null,
      food_preference: null,
      submitted: true,
      email: 'k@h'
    }
  ]

  it('should not render cards if mount is false', async () => {
    const { queryByText } = render(<Rsvp mount={false} />)
    expect(queryByText('r.s.v.p')).toBeFalsy()
  })

  it('should render cards if mount is true', async () => {
    const { getAllByText } = renderRsvp()
    expect(getAllByText('r.s.v.p')).toBeTruthy()
  })

  describe('get invite', () => {
    it('should get invite if exists', async () => {
      fetch.mockResolvedValueOnce({ json: () => ({ data: guests }) })

      const { getByText, queryByText, getByLabelText } = renderRsvp()
      expect(getByText('Kiesha Colin')).toBeTruthy()
      expect(queryByText('Thank you')).toBeFalsy()

      fillInName(getByLabelText, getByText)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toHaveBeenCalledWith(
          '/api/get-invite',
          expect.objectContaining({
            body: JSON.stringify({ first_name: 'K', last_name: 'H' })
          })
        )
        expect(getByText('K H')).toBeTruthy()
        expect(getByText('Attending')).toBeTruthy()
        expect(getByText('Food Preference')).toBeTruthy()
      })
    })

    it('should show error if getInvite returns one', async () => {
      fetch.mockResolvedValueOnce({ json: () => ({ error: 'durp' }) })

      const { getByText, queryByText, getByLabelText } = renderRsvp()
      fillInName(getByLabelText, getByText)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(getByText('durp')).toBeTruthy()
        expect(queryByText('K H')).toBeFalsy()
        expect(queryByText('Attending')).toBeFalsy()
        expect(queryByText('Food Preference')).toBeFalsy()
      })
    })

    it('should show error if invite not found', async () => {
      fetch.mockResolvedValueOnce({ json: () => ({ data: [] }) })

      const { getByText, queryByText, getByLabelText } = renderRsvp()
      fillInName(getByLabelText, getByText)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(
          getByText(
            'Sorry we could not find your invite. Try another name or drop us a message!'
          )
        ).toBeTruthy()
        expect(queryByText('K H')).toBeFalsy()
        expect(queryByText('Attending')).toBeFalsy()
        expect(queryByText('Food Preference')).toBeFalsy()
      })
    })

    it('should show error if passed rsvp deadline', async () => {
      fetch.mockResolvedValueOnce({ json: () => ({ data: guests }) })
      jest.useFakeTimers('modern')
      jest.setSystemTime(Date.parse('2030'))

      const { getByText, queryByText, getByLabelText } = renderRsvp()
      fillInName(getByLabelText, getByText)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(
          getByText('Need to update your rsvp? Send us an email!')
        ).toBeTruthy()
        expect(queryByText('K H')).toBeFalsy()
        expect(queryByText('Attending')).toBeFalsy()
        expect(queryByText('Food Preference')).toBeFalsy()
      })

      jest.useRealTimers()
      jest.resetModules()
    })
  })

  describe('send rsvp', () => {
    beforeEach(() => {
      fetch.mockResolvedValue({ json: () => ({ data: guests }) })
    })

    it('should show confirmation dialog if guests are not attending', async () => {
      const updatedGuest = {
        ...guests[0],
        food_preference: null,
        attending: null
      }
      const { getByText, getByLabelText } = renderRsvp()
      fillInName(getByLabelText, getByText)

      await waitFor(async () => {
        fireEvent.click(getByText('RSVP!'))
      })

      expect(getByText('Confirm RSVP')).toBeTruthy()
      fireEvent.click(getByText('Confirm'))

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2)
        expect(fetch).nthCalledWith(
          2,
          '/api/send-rsvp',
          expect.objectContaining({
            body: JSON.stringify({ data: [updatedGuest] })
          })
        )
        expect(getByText('Thank you for letting us know')).toBeTruthy()
        expect(
          getByText('We will miss your presence at the wedding.')
        ).toBeTruthy()
        expect(guests[0].email).toBeTruthy()
      })
    })

    it('should not submit if missing rsvp inputs', async () => {
      const { getByText, getByLabelText } = renderRsvp()
      fillInName(getByLabelText, getByText)

      await waitFor(async () => {
        fireEvent.click(getByLabelText('K attending'))
        fireEvent.click(getByText('RSVP!'))
      })

      expect(getByText("Mmm don't want to forget to pick one!")).toBeTruthy()
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should show thank you page on send success', async () => {
      const updatedGuest = {
        ...guests[0],
        food_preference: 'Chicken',
        attending: true
      }
      const { getByText, getByLabelText } = renderRsvp()
      fillInName(getByLabelText, getByText)

      await waitFor(async () => {
        fireEvent.click(getByLabelText('K attending'))
        fireEvent.mouseDown(getByLabelText('K food preference'))
        fireEvent.click(getByText('Chicken'))
        fireEvent.click(getByText('RSVP!'))
      })

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2)
        expect(fetch).nthCalledWith(
          2,
          '/api/send-rsvp',
          expect.objectContaining({
            body: JSON.stringify({ data: [updatedGuest] })
          })
        )
        expect(getByText('Thank you')).toBeTruthy()
        expect(
          getByText("We can't wait to share our special day with you!")
        ).toBeTruthy()
        expect(guests[0].email).toBeTruthy()
      })
    })
  })
})
