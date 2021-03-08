import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import Admin from '../index'
import fetch from 'isomorphic-fetch'

jest.mock('isomorphic-fetch')

describe('admin', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the admin page', async () => {
    const { getByText } = render(<Admin />)
    expect(getByText('Admin')).toBeTruthy()
  })

  it('should show error message if no csv inputted', async () => {
    const { getByText } = render(<Admin />)

    fireEvent.click(getByText('Submit'))
    expect(getByText('Whoops! Select a csv file to import.')).toBeTruthy()
  })

  it('should show success response', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn(() => ({ data: [] }))
    })

    const { getByText, getByLabelText } = render(<Admin />)

    const button = getByText('Submit')
    const file = new File(['test'], 'test.csv', { type: 'csv' })
    fireEvent.change(getByLabelText('csv-input'), {
      target: { files: [file] }
    })
    fireEvent.click(button)

    expect(button.disabled).toBe(true)
    await waitFor(() => {
      expect(button.disabled).toBe(false)
      expect(getByText('Success! 0 entries have been added.'))
    })
  })

  it('should show fail response', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn(() => ({ error: ['validation error'] }))
    })

    const { getByText, getByLabelText } = render(<Admin />)

    const button = getByText('Submit')
    const file = new File(['test'], 'test.csv', { type: 'csv' })
    fireEvent.change(getByLabelText('csv-input'), {
      target: { files: [file] }
    })
    fireEvent.click(button)

    expect(button.disabled).toBe(true)
    await waitFor(() => {
      expect(button.disabled).toBe(false)
      expect(getByText('Error: validation error'))
    })
  })
})
