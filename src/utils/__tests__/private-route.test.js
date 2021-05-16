import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, Switch } from 'react-router-dom'
import fetch from 'isomorphic-fetch'
import jwt from 'jsonwebtoken'

import PrivateRoute from '../private-route'
import { AuthProvider } from '../auth-context'

jest.mock('isomorphic-fetch')
jest.mock('jsonwebtoken')

describe('private-route', () => {
  const user_id = 'crazy_gal'
  const token = 789
  const loginTitle =
    'Hey there! Please sign in with the password from your invite 🙂'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const renderRoute = (permission = '') =>
    render(
      <AuthProvider>
        <BrowserRouter>
          <Switch>
            <PrivateRoute permission={permission || undefined}>
              <div>hello</div>
            </PrivateRoute>
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    )

  it('should show the login page if there are no cookies or auth', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn(() => ({ error: 'Not logged in.' }))
    })
    jwt.decode = jest.fn()

    const { getByText } = renderRoute()
    await waitFor(() => expect(getByText(loginTitle)).toBeTruthy())

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(jwt.decode).not.toHaveBeenCalled()
  })

  it('should show incorrect password', async () => {
    fetch
      .mockResolvedValueOnce({
        json: jest.fn(() => ({ error: 'Not logged in.' }))
      })
      .mockResolvedValueOnce({
        json: jest.fn(() => ({ error: 'Incorrect password' }))
      })
    jwt.decode = jest.fn()

    const { getByText, getByLabelText } = renderRoute()

    await waitFor(() => expect(getByText(loginTitle)).toBeTruthy())

    const input = getByLabelText('password')
    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.click(getByText('Unlock'))

    await waitFor(() => expect(getByText('Incorrect password')).toBeTruthy())
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(jwt.decode).not.toHaveBeenCalled()
  })

  it('should login', async () => {
    fetch
      .mockResolvedValueOnce({
        json: jest.fn(() => ({ error: 'Not logged in.' }))
      })
      .mockResolvedValueOnce({ json: jest.fn(() => ({ data: { token } })) })

    jwt.decode.mockReturnValueOnce({
      user_id,
      permission: 'user',
      token
    })

    const { getByText, getByLabelText, queryByText } = renderRoute()

    await waitFor(() => expect(getByText(loginTitle)).toBeTruthy())

    const input = getByLabelText('password')
    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.click(getByText('Unlock'))

    await waitFor(() => expect(queryByText(loginTitle)).toBeFalsy())
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(jwt.decode).toHaveBeenCalledTimes(1)
  })

  it('should not show login if cookie is present', async () => {
    fetch.mockResolvedValueOnce({ json: jest.fn(() => ({ data: { token } })) })

    jwt.decode.mockReturnValueOnce({
      user_id,
      permission: 'user',
      token
    })

    const { queryByText } = renderRoute()

    await waitFor(() => expect(queryByText(loginTitle)).toBeFalsy())

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(jwt.decode).toHaveBeenCalledTimes(1)
  })

  it('should show login if permissions do not match', async () => {
    fetch.mockResolvedValueOnce({ json: jest.fn(() => ({ data: { token } })) })

    jwt.decode.mockReturnValueOnce({
      user_id,
      permission: 'user',
      token
    })

    const { getByText } = renderRoute('admin')

    await waitFor(() => expect(getByText(loginTitle)).toBeTruthy())

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(jwt.decode).toHaveBeenCalledTimes(1)
  })

  it('should login if permissions do not match but enters correct password', async () => {
    fetch.mockResolvedValue({ json: jest.fn(() => ({ data: { token } })) })

    jwt.decode
      .mockReturnValueOnce({
        user_id,
        permission: 'user',
        token
      })
      .mockReturnValueOnce({
        user_id,
        permission: 'admin',
        token
      })

    const { getByText, getByLabelText, queryByText } = renderRoute('admin')

    await waitFor(() => expect(getByText(loginTitle)).toBeTruthy())

    const input = getByLabelText('password')
    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.click(getByText('Unlock'))

    await waitFor(() => expect(queryByText(loginTitle)).toBeFalsy())
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(jwt.decode).toHaveBeenCalledTimes(2)
  })

  it('should refresh token after timer is up', async () => {
    jest.useFakeTimers()

    fetch.mockResolvedValue({ json: jest.fn(() => ({ data: { token } })) })
    jwt.decode.mockReturnValue({
      user_id,
      permission: 'user',
      token
    })

    const { queryByText } = renderRoute()

    await waitFor(() => expect(queryByText(loginTitle)).toBeFalsy())

    jest.runAllTimers()
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(jwt.decode).toHaveBeenCalledTimes(2)
      expect(setTimeout).toHaveBeenCalledTimes(2)
    })

    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('render props', () => {
    const renderRouteWithProps = () =>
      render(
        <AuthProvider>
          <BrowserRouter>
            <Switch>
              <PrivateRoute permission={'user'}>
                {({ isLoggedIn }) => <div>{`isLoggedIn: ${isLoggedIn}`}</div>}
              </PrivateRoute>
            </Switch>
          </BrowserRouter>
        </AuthProvider>
      )

    it('should pass isLoggedIn false prop to children if not logged in', async () => {
      fetch.mockResolvedValueOnce({
        json: jest.fn(() => ({ error: 'Not logged in.' }))
      })
      jwt.decode = jest.fn()

      const { getByText } = renderRouteWithProps()

      await waitFor(() => expect(getByText('isLoggedIn: false')).toBeTruthy())
    })

    it('should pass isLoggedIn true prop to children if logged in', async () => {
      fetch.mockResolvedValueOnce({
        json: jest.fn(() => ({ data: { token } }))
      })

      jwt.decode.mockReturnValueOnce({
        user_id,
        permission: 'user',
        token
      })

      const { getByText } = renderRouteWithProps()

      await waitFor(() => expect(getByText('isLoggedIn: true')).toBeTruthy())
    })
  })
})
