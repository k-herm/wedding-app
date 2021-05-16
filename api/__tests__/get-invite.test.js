import getInvite, { familyQuery, guestsQuery } from '../get-invite'
import withAuth from '../utils/with-auth'
import fetchQuery from '../utils/hasura'

jest.mock('../utils/hasura')
jest.mock('../utils/with-auth')

describe('import', () => {
  let res
  beforeEach(() => {
    jest.resetAllMocks()

    res = {
      status: jest.fn(),
      send: jest.fn()
    }

    res.status.mockImplementation(() => res)
    res.send.mockImplementation(() => res)

    withAuth.mockImplementation((req, res, permission, callback) => callback())
  })

  const req = body => ({ body })
  const wait = async () => await new Promise(res => setTimeout(res))

  const body = {
    first_name: 'k',
    last_name: 'h'
  }
  const dbData = [
    {
      ...body,
      family: 'mh'
    }
  ]

  it('returns the family list if first and last names are in db', async () => {
    const famNameQuery = familyQuery(body.first_name, body.last_name)
    const guestListQuery = guestsQuery(dbData[0].family)

    fetchQuery
      .mockResolvedValueOnce({ Guests: [{ family: dbData[0].family }] })
      .mockResolvedValueOnce({ Guests: dbData })

    await getInvite(req(body), res)

    expect(fetchQuery).nthCalledWith(1, { query: famNameQuery })
    await wait()
    expect(fetchQuery).nthCalledWith(2, { query: guestListQuery })

    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: dbData })
  })

  it('should not perform guestList query if name is not present in db', async () => {
    fetchQuery.mockResolvedValueOnce({ Guests: [] })

    await getInvite(req(body), res)

    expect(fetchQuery).toHaveBeenCalledTimes(1)
    await wait()

    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: [] })
  })

  it('throws validation error if first name or last name not present', async () => {
    const message = 'Please enter your first and last name'

    await getInvite(req({ first_name: 'k' }), res)
    expect(fetchQuery).not.toHaveBeenCalled()
    expect(res.status).toBeCalledWith(400)
    expect(res.send).toBeCalledWith({ error: message })

    await getInvite(req({ last_name: 'k' }), res)
    expect(fetchQuery).not.toHaveBeenCalled()
    expect(res.status).toBeCalledWith(400)
    expect(res.send).toBeCalledWith({ error: message })
  })

  it('throws validation error if no body', async () => {
    const message = 'Please enter your first and last name'

    await getInvite(req(), res)
    expect(fetchQuery).not.toHaveBeenCalled()
    expect(res.status).toBeCalledWith(400)
    expect(res.send).toBeCalledWith({ error: message })
  })

  it('should throw query error if fetchQuery fails', async () => {
    fetchQuery.mockRejectedValueOnce({ error: 'shit went down' })

    await getInvite(req(body), res)

    expect(fetchQuery).toHaveBeenCalledTimes(1)
    await wait()

    expect(res.status).toBeCalledWith(500)
    expect(res.send).toBeCalledWith({
      error: 'Something went wrong during query'
    })
  })
})
