import { render, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, Switch } from 'react-router-dom'
import fetch from 'isomorphic-fetch'
import jwt from 'jsonwebtoken'

import useRequest from '../use-request'
import { useAuthContext } from '../auth-context'

jest.mock('isomorphic-fetch')
jest.mock('jsonwebtoken')
jest.mock('../auth-context')

describe('useRequest', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const jwtToken = 'theToken'
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': ''
  }

  const runRequest = () => {
    const request = useRequest()
    return request('url', 'data')
  }

  it('should attach jwt in auth header if user is present', async () => {
    useAuthContext.mockReturnValue({
      user: { jwtToken }
    })
    fetch.mockResolvedValueOnce({ json: jest.fn() })

    await runRequest()
    expect(fetch).toHaveBeenCalledWith('url', {
      method: 'POST',
      headers: { ...headers, Authorization: `Bearer ${jwtToken}` },
      body: '"data"',
      credentials: 'include'
    })
  })

  it('should attach empty auth header if user is not present', async () => {
    useAuthContext.mockReturnValue({})
    fetch.mockResolvedValueOnce({ json: jest.fn() })

    await runRequest()
    expect(fetch).toHaveBeenCalledWith('url', {
      method: 'POST',
      headers,
      body: '"data"',
      credentials: 'include'
    })
  })

  it('should return error message if fetch fails', async () => {
    useAuthContext.mockReturnValue({})
    fetch.mockRejectedValueOnce({ error: 'uh oh' })

    const res = await runRequest()
    expect(res).toEqual({ error: 'Request was unable to send.' })
  })
})
