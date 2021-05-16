import sendRsvp, { mutation } from '../send-rsvp'
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

  const req = data => ({ body: { data } })
  const wait = async () => await new Promise(res => setTimeout(res))

  const data = [
    {
      first_name: 'k',
      last_name: 'h',
      attending: true,
      food_preference: 'chicken',
      submitted: false
    },
    {
      first_name: 'c',
      last_name: 'p',
      attending: true,
      food_preference: '',
      submitted: false
    }
  ]

  const result = [
    { ...data[0], email: 'k@g' },
    { ...data[1], email: 'c@t' }
  ]

  it('should send the list of updated guests if successful', async () => {
    const kMutation = mutation(data[0])
    const cMutation = mutation(data[1])

    fetchQuery
      .mockResolvedValueOnce({
        update_Guests: { returning: [result[0]] }
      })
      .mockResolvedValueOnce({
        update_Guests: { returning: [result[1]] }
      })

    await sendRsvp(req(data), res)

    expect(fetchQuery).nthCalledWith(1, { query: kMutation })
    await wait()
    expect(fetchQuery).nthCalledWith(2, { query: cMutation })

    expect(res.status).toBeCalledWith(200)
    expect(res.send).toBeCalledWith({ data: result })
  })

  it('should throw validation error if body is missing data', async () => {
    const missingData = [{ first_name: 'k', last_name: 'h' }]

    await sendRsvp(req(missingData), res)

    expect(fetchQuery).not.toHaveBeenCalled()
    expect(res.status).toBeCalledWith(400)
    expect(res.send).toBeCalledWith({
      error: [
        {
          message: "should have required property 'attending'",
          prop: '/data/0',
          type: 'required'
        },
        {
          message: "should have required property 'submitted'",
          prop: '/data/0',
          type: 'required'
        }
      ]
    })
  })

  it('should throw server error if fetch query fails', async () => {
    fetchQuery.mockRejectedValue({ error: 'bad request' })
    await sendRsvp(req(data), res)

    expect(fetchQuery).toHaveBeenCalledTimes(2)
    await wait()

    expect(res.status).toBeCalledWith(500)
    expect(res.send).toBeCalledWith({
      error: 'Something went wrong during update'
    })
  })
})
