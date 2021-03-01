import React from 'react'
import Admin from '../index'
import { render } from '@testing-library/react'

describe('admin', () => {
  it('should work', async () => {
    const { getByText } = render(<Admin />)
    expect(getByText('Admin')).toBeTruthy()
  })
})
