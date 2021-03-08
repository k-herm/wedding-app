import fetch from 'isomorphic-fetch'
import fetchQuery from '../utils/hasura'

jest.mock('isomorphic-fetch')

describe('hasura', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    process.env.HASURA_API_URL = 'http://hasura'
    process.env.HASURA_ADMIN_SECRET = 'shhh'
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should fetch with the correct url, headers, and body', async () => {
    const query = 'Query'
    const variables = 'Variables'

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({ query, variables })
    }

    fetch.mockResolvedValue({
      json: jest.fn()
    })

    await fetchQuery({ query, variables })

    expect(fetch).toHaveBeenCalledWith(process.env.HASURA_API_URL, options)
  })
})
