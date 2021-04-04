import { VercelRequest, VercelResponse } from '@vercel/node'
import withAuth from './utils/with-auth'
import fetchQuery from './utils/hasura'
import { ValidationError } from './utils/validation-error'

const query = (email: string) => `
  query getGuests {
    Guests(where: {email: {_eq: "${email}"}}) {
      first_name
      last_name
      attending
      food_preference
    }
  }
`

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  // withAuth(req, res, 'user', async () => {
  try {
    if (!req.body?.email) {
      throw new ValidationError([
        { keyword: 'email', message: 'Please enter your email' }
      ])
    }

    const { email } = req.body
    const { Guests } = await fetchQuery({ query: query(email) })

    res.status(200).send({ data: Guests })
  } catch (error) {
    let errorMessage = 'Something went wrong during query'
    let code = 500
    if (error.name === 'ValidationError') {
      errorMessage = error.errors[0].message
      code = 400
    }

    res.status(code).send({ error: errorMessage })
    console.error(error)
  }
  // })
}
