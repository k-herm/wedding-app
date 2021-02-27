import jwt from 'jsonwebtoken'
import withAuth from '../utils/with-auth'
import fetchQuery from '../utils/hasura'

jest.mock('jsonwebtoken')
jest.mock('../utils/hasura.ts')

describe('import', () => {
  const user_id = 'crazy_guy'
  const token = 789
  let callback

  let res

  beforeEach(() => {
    jest.resetAllMocks()

    res = { redirect: jest.fn() }
    res.redirect.mockImplementation(() => res)

    callback = jest.fn()
  })

  it('should send a 401 redirect if no jwt', async () => {
    const headers = {}
    await withAuth({ headers }, res, 'user', callback)

    expect(res.redirect).toBeCalledWith(401, '/')
    expect(callback).not.toHaveBeenCalled()
  })

  it('should send a 401 redirect if jwt is invalid', async () => {
    jwt.verify.mockImplementation(() => Promise.reject())

    const headers = {
      authorization: 'Bearer 123'
    }
    await withAuth({ headers }, res, 'user', callback)

    expect(res.redirect).toBeCalledWith(401, '/')
    expect(callback).not.toHaveBeenCalled()
  })

  it('should send a 401 redirect if permission does not match', async () => {
    jwt.verify.mockImplementation(() => ({
      user_id,
      permission: 'user',
      token
    }))
    fetchQuery.mockResolvedValueOnce({
      Users: [{ user_id, token }]
    })

    const headers = {
      authorization: 'Bearer 123'
    }
    await withAuth({ headers }, res, 'admin', callback)

    expect(res.redirect).toBeCalledWith(401, '/')
    expect(callback).not.toHaveBeenCalled()
  })

  it('should call callback function if valid jwt and permissions', async () => {
    jwt.verify.mockImplementation(() => ({
      user_id,
      permission: 'admin',
      token
    }))
    fetchQuery.mockResolvedValueOnce({
      Users: [{ user_id, token }]
    })

    const headers = {
      authorization: 'Bearer 123'
    }
    await withAuth({ headers }, res, 'admin', callback)

    expect(callback).toHaveBeenCalled()
  })
})
