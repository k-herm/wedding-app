import importApi, { mutation } from '../import'
import withAuth from '../utils/with-auth'
import fetchQuery from '../utils/hasura'

jest.mock('../utils/hasura.ts')
jest.mock('../utils/with-auth.ts')

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

  const req = data => ({ body: { data } })

  it('insert new values and return ids of values inserted', async () => {
    const data = [
      {
        first_name: 'k',
        last_name: 'h',
        family: 'mh'
      }
    ]
    const query = mutation(data)

    fetchQuery
      .mockResolvedValueOnce({
        Guests: []
      })
      .mockResolvedValueOnce({
        insert_Guests: {
          returning: ['1']
        }
      })

    await importApi(req(data), res)

    expect(fetchQuery).nthCalledWith(2, { query })

    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: ['1'] })
  })

  it('should trim whitespace and not insert values if already in db', async () => {
    const dbData = [
      {
        first_name: 'k',
        last_name: 'h',
        family: 'mh'
      }
    ]
    const data = [
      {
        first_name: 'k ',
        last_name: 'h  ',
        family: 'mh'
      }
    ]
    const query = mutation([])

    fetchQuery
      .mockResolvedValueOnce({
        Guests: dbData
      })
      .mockResolvedValueOnce({
        insert_Guests: {
          returning: []
        }
      })

    await importApi(req(data), res)

    expect(fetchQuery).nthCalledWith(2, { query })

    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: [] })
  })

  it('return an error message if there is an error with fetchQuery', async () => {
    const data = [
      {
        first_name: 'k ',
        last_name: 'h  ',
        family: 'mh'
      }
    ]

    fetchQuery.mockRejectedValueOnce({ name: 'request failed' })

    await importApi(req(data), res)

    expect(fetchQuery).not.nthCalledWith(2)

    expect(res.status).toBeCalledWith(500)
    expect(res.send).toBeCalledWith({
      error: 'Something went wrong during import'
    })
  })

  it('should return an error if body is invalid', async () => {
    const testData = [
      { data: [{ invalidProp: 'yes it is' }] },
      { data: {} },
      {}
    ]

    testData.forEach(async test => {
      await importApi({ body: test }, res)
      expect(fetchQuery).not.toHaveBeenCalled()

      expect(res.status).toBeCalledWith(400)
      expect(res.send).toBeCalledWith({
        error: expect.any(Array)
      })
    })
  })
})
