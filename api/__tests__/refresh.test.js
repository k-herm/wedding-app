import jwt from 'jsonwebtoken'
import refresh from '../refresh'
import fetchQuery from '../utils/hasura'

jest.mock('jsonwebtoken')
jest.mock('../utils/hasura.ts')

describe('refresh', () => {
  const user_id = 'crazy_guy_64'
  const token = 789
  const newToken = 'def'
  const fakeJwt = 'i am a fake'
  const cookieExpiry = 1243
  const match = { ' ': '\\s', '(': '\\(', ')': '\\)' }
  const cookieRegex = new RegExp(
    'refreshToken=\\[\\W?' +
      newToken +
      '\\W?,\\s?' +
      cookieExpiry +
      '\\];\\s?expires=' +
      new Date(cookieExpiry).toString().replace(/[\s()]/g, m => match[m]) +
      ';'
  )
  const headers = {
    authorization: 'Bearer someJwt',
    cookie: `refreshToken=["abc", ${cookieExpiry}]`
  }

  let res
  beforeEach(() => {
    jest.resetAllMocks()

    process.env.NODE_ENV = 'development'

    res = {
      setHeader: jest.fn(),
      status: jest.fn(),
      send: jest.fn(),
      redirect: jest.fn()
    }

    res.setHeader.mockImplementation(() => res)
    res.status.mockImplementation(() => res)
    res.send.mockImplementation(() => res)
    res.redirect.mockImplementation(() => res)
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should send a 401 if header does not contain a cookie', async () => {
    await refresh({ headers: {} }, res)

    expect(res.status).toBeCalledWith(401)
    expect(res.send).toBeCalledWith({ error: 'Please login.' })
  })

  it('should send a new JWT if old one is expired', async () => {
    const headers = { cookie: `refreshToken=["abc", ${cookieExpiry}]` }

    fetchQuery
      .mockResolvedValueOnce({
        Users: [{ user_id, token }]
      })
      .mockResolvedValueOnce({
        update_Users: { returning: [{ token: newToken }] }
      })

    jwt.sign.mockImplementation(() => fakeJwt)

    await refresh({ headers }, res)

    expect(fetchQuery).toHaveBeenCalledTimes(2)
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringMatching(cookieRegex)
    )
    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: { token: fakeJwt } })
  })

  it('should send a 401 redirect if jwt is invalid', async () => {
    jwt.verify.mockImplementation(() => Promise.reject())
    fetchQuery
      .mockResolvedValueOnce({
        Users: [{ user_id, token }]
      })
      .mockResolvedValueOnce({
        update_Users: { returning: [{ token: newToken }] }
      })

    await refresh({ headers }, res)

    expect(res.redirect).toBeCalledWith(401, '/')
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('should send refresh jwt if valid', async () => {
    fetchQuery
      .mockResolvedValueOnce({
        Users: [{ user_id, token }]
      })
      .mockResolvedValueOnce({
        update_Users: { returning: [{ token: newToken }] }
      })

    jwt.verify.mockImplementation(() => ({ user_id, permission: 'user' }))
    jwt.sign.mockImplementation(() => fakeJwt)

    await refresh({ headers }, res)

    expect(fetchQuery).toHaveBeenCalledTimes(2)
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringMatching(cookieRegex)
    )
    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: { token: fakeJwt } })
  })

  it('should send different jwt and cookie issuer if in prod env', async () => {
    process.env.NODE_ENV = 'production'

    fetchQuery
      .mockResolvedValueOnce({
        Users: [{ user_id, token }]
      })
      .mockResolvedValueOnce({
        update_Users: { returning: [{ token: newToken }] }
      })

    jwt.verify.mockImplementation(() => ({ user_id, permission: 'user' }))
    jwt.sign.mockImplementation(() => fakeJwt)

    await refresh({ headers }, res)

    expect(fetchQuery).toHaveBeenCalledTimes(2)
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringMatching(cookieRegex)
    )
    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: { token: fakeJwt } })
  })

  it('return an error message if there is an error with fetchQuery', async () => {
    const headers = { cookie: 'refreshToken=[]' }

    fetchQuery.mockRejectedValueOnce({ error: 'request failed' })

    await refresh({ headers }, res)

    expect(res.status).toBeCalledWith(500)
    expect(res.send).toBeCalledWith({
      error: 'Something went wrong refreshing token'
    })
  })

  it('should send 401 if the user is not found', async () => {
    fetchQuery.mockResolvedValueOnce({ Users: [] })

    await refresh({ headers }, res)

    expect(res.status).toBeCalledWith(401)
    expect(res.send).toBeCalledWith({ error: 'Please try again.' })
    expect(res.setHeader).not.toHaveBeenCalled()
  })
})
