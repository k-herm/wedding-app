import jwt from 'jsonwebtoken'
import login, { ADMIN_COOKIE_EXPIRY } from '../login'
import fetchQuery from '../utils/hasura'
import { COOKIE_EXPIRY } from '../utils/with-auth'

jest.mock('jsonwebtoken')
jest.mock('../utils/hasura.ts')

describe('import', () => {
  const user_id = 'crazy_guy_64'
  const fakeJwt = 'i am a fake'
  const cookieRegex = expiry =>
    new RegExp(
      '^refreshToken=\\[\\W?.{16}\\W?,\\s?' +
        expiry +
        '\\];\\s?max-age=' +
        expiry +
        ';'
    )

  let res

  beforeEach(() => {
    jest.resetAllMocks()

    jest.useFakeTimers('modern')
    jest.setSystemTime(Date.parse('2021'))

    res = {
      setHeader: jest.fn(),
      status: jest.fn(),
      send: jest.fn()
    }

    res.setHeader.mockImplementation(() => res)
    res.status.mockImplementation(() => res)
    res.send.mockImplementation(() => res)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const req = (body, referer = 'protected') => ({
    headers: { referer: `${process.env.LOCAL_HOST}/${referer}` },
    body
  })

  it('should send a 200 if header contains a cookie and token', async () => {
    const headers = { authorization: 'Bearer ahh', cookie: 'yumm' }
    await login({ headers }, res)

    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ message: 'You are logged in.' })
  })

  it('should send a 401 and message if no password entered', async () => {
    await login(req({ password: '' }), res)

    expect(res.status).toBeCalledWith(401)
    expect(res.send).toBeCalledWith({ error: 'No password entered' })
  })

  it('should send a 401 if admin passwords do not match', async () => {
    process.env.ADMIN_SECRET = 'whos asking'
    await login(req({ password: 'wrong' }, 'admin'), res)

    expect(res.status).toBeCalledWith(401)
    expect(res.send).toBeCalledWith({ error: 'Incorrect Password' })
  })

  it('should send a 401 if user passwords do not match', async () => {
    process.env.GUEST_SECRET = 'nope'
    await login(req({ password: 'please?' }), res)

    expect(res.status).toBeCalledWith(401)
    expect(res.send).toBeCalledWith({ error: 'Incorrect Password' })
  })

  it('should send a jwt and cookie if admin passwords match', async () => {
    fetchQuery.mockResolvedValueOnce({
      insert_Users_one: { user_id }
    })
    jwt.sign.mockImplementation(() => fakeJwt)

    process.env.ADMIN_SECRET = 'fine, youre in'
    await login(req({ password: 'fine, youre in' }, 'admin'), res)

    const expiry = Date.now() + ADMIN_COOKIE_EXPIRY
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringMatching(cookieRegex(expiry))
    )
    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: { token: fakeJwt } })
  })

  it('should send a jwt and cookie if user passwords match', async () => {
    fetchQuery.mockResolvedValueOnce({
      insert_Users_one: { user_id }
    })
    jwt.sign.mockImplementation(() => fakeJwt)

    process.env.GUEST_SECRET = 'not you again'
    await login(req({ password: 'not you again' }), res)

    const expiry = Date.now() + COOKIE_EXPIRY
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringMatching(cookieRegex(expiry))
    )
    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: { token: fakeJwt } })
  })

  it('return an error message if there is an error with fetchQuery', async () => {
    fetchQuery.mockRejectedValueOnce({ name: 'request failed' })

    process.env.GUEST_SECRET = 'hey'
    await login(req({ password: 'hey' }), res)

    expect(res.status).toBeCalledWith(500)
    expect(res.send).toBeCalledWith({
      error: 'Something went wrong logging in'
    })
  })
})
