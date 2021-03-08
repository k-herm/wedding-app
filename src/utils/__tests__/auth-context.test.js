import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import fetch from 'isomorphic-fetch'
import jwt from 'jsonwebtoken'
import { useAuthContext, AuthProvider } from '../auth-context'

jest.mock('isomorphic-fetch')
jest.mock('jsonwebtoken')

describe('auth-context', () => {
  const data = { data: { token: '123' } }
  const payload = {
    user_id: 'id',
    permission: 'user',
    jwtToken: data.data.token
  }
  let cb
  beforeEach(() => {
    jest.resetAllMocks()
    cb = jest.fn()
  })

  const TestComponent = () => {
    const auth = useAuthContext()
    return (
      <div>
        <h1>{auth.user.user_id}</h1>
        <h1>{auth.user.permission}</h1>
        <h1>{auth.user.jwtToken}</h1>
        <button onClick={() => auth.signIn('password', cb)}>signin</button>
        <button onClick={() => auth.refresh(cb)}>refresh</button>
        <button onClick={() => auth.signOut(cb)}>signout</button>
      </div>
    )
  }

  const renderProvider = () =>
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

  it('should render children', async () => {
    const { getByText } = renderProvider()
    expect(getByText('signin')).toBeTruthy()
    expect(getByText('refresh')).toBeTruthy()
    expect(getByText('signout')).toBeTruthy()
  })

  it('should trigger callback and set user on success signin', async () => {
    fetch.mockResolvedValue({ json: jest.fn(() => data) })
    jwt.decode.mockReturnValueOnce(payload)

    const { getByText } = renderProvider()
    fireEvent.click(getByText('signin'))

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        '/api/login',
        expect.objectContaining({ body: '{"password":"password"}' })
      )
      expect(getByText(payload.user_id)).toBeTruthy()
      expect(getByText(payload.permission)).toBeTruthy()
      expect(getByText(payload.jwtToken)).toBeTruthy()
      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  it('should not trigger callback or set user on unsuccessful signin', async () => {
    fetch.mockResolvedValue({ json: jest.fn(() => ({ error: 'damn' })) })

    const { getByText, queryByText } = renderProvider()
    fireEvent.click(getByText('signin'))

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        '/api/login',
        expect.objectContaining({ body: '{"password":"password"}' })
      )
      expect(jwt.decode).not.toHaveBeenCalled()
      expect(cb).not.toHaveBeenCalled()
      expect(queryByText(payload.user_id)).toBeFalsy()
      expect(queryByText(payload.permission)).toBeFalsy()
      expect(queryByText(payload.jwtToken)).toBeFalsy()
    })
  })

  it('should trigger callback and set user on success refresh', async () => {
    fetch.mockResolvedValue({ json: jest.fn(() => data) })
    jwt.decode.mockReturnValueOnce(payload)

    const { getByText } = renderProvider()
    fireEvent.click(getByText('refresh'))

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        '/api/refresh',
        expect.objectContaining({ body: undefined })
      )
      expect(getByText(payload.user_id)).toBeTruthy()
      expect(getByText(payload.permission)).toBeTruthy()
      expect(getByText(payload.jwtToken)).toBeTruthy()
      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  it('should not trigger callback or set user on unsuccessful refresh', async () => {
    fetch.mockResolvedValue({ json: jest.fn(() => ({ error: 'damn' })) })

    const { getByText, queryByText } = renderProvider()
    fireEvent.click(getByText('refresh'))

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        '/api/refresh',
        expect.objectContaining({ body: undefined })
      )
      expect(jwt.decode).not.toHaveBeenCalled()
      expect(cb).not.toHaveBeenCalled()
      expect(queryByText(payload.user_id)).toBeFalsy()
      expect(queryByText(payload.permission)).toBeFalsy()
      expect(queryByText(payload.jwtToken)).toBeFalsy()
    })
  })

  it('should signout', async () => {
    // fetch.mockResolvedValue({ json: jest.fn(() => ({ error: 'damn' })) })

    const { getByText, queryByText } = renderProvider()
    fireEvent.click(getByText('signout'))

    await waitFor(() => {
      // expect(fetch).toHaveBeenLastCalledWith(
      //   '/api/refresh',
      //   expect.objectContaining({ body: undefined })
      // )
      // expect(jwt.decode).not.toHaveBeenCalled()
      expect(cb).toHaveBeenCalled()
      expect(queryByText(payload.user_id)).toBeFalsy()
      expect(queryByText(payload.permission)).toBeFalsy()
      expect(queryByText(payload.jwtToken)).toBeFalsy()
    })
  })
})
