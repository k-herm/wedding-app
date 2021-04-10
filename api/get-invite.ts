import { VercelRequest, VercelResponse } from '@vercel/node'
import withAuth from './utils/with-auth'
import fetchQuery from './utils/hasura'
import { ValidationError } from './utils/validation-error'

const familyQuery = (first_name: string, last_name: string) => `
  query getGuest {
    Guests(where: {first_name: {_eq: "${first_name}"}, last_name: {_eq: "${last_name}"}}) {
      family
    }
  }
`

const guestsQuery = (family: string) => `
  query getGuests {
    Guests(where: {family: {_eq: "${family}"}}) {
      first_name
      last_name
      attending
      food_preference
      submitted
    }
  }
`

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  // withAuth(req, res, 'user', async () => {
  try {
    if (!req.body?.first_name || !req.body?.last_name) {
      throw new ValidationError([
        { keyword: 'email', message: 'Please enter your first and last name' }
      ])
    }

    const { first_name, last_name } = req.body
    const { Guests: Guest } = await fetchQuery({
      query: familyQuery(first_name, last_name)
    })
    let family = []
    if (Guest.length) {
      const { Guests } = await fetchQuery({
        query: guestsQuery((Guest[0] as { family: string }).family)
      })
      family = Guests
    }

    res.status(200).send({ data: family })
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
