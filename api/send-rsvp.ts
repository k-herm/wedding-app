import { VercelRequest, VercelResponse } from '@vercel/node'
import S from 'fluent-json-schema'
import Ajv from 'ajv'
import withAuth from './utils/with-auth'
import fetchQuery from './utils/hasura'
import { ValidationError } from './utils/validation-error'

export const mutation = (guest: Guest) => `
  mutation updateGuests {
    update_Guests(
      where: {
        first_name: {_eq: "${guest.first_name}"}, 
        last_name: {_eq: "${guest.last_name}"}
      }, 
      _set: {
        attending: ${guest.attending}, 
        food_preference: ${
          guest.food_preference ? `"${guest.food_preference}"` : 'null'
        },
        submitted: "${guest.submitted}"
      }
    ) {
      returning {
        attending
        first_name
        food_preference
        last_name
        submitted
        email
      }
    }
  }
`

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  withAuth(req, res, 'user', async () => {
    try {
      const ajv = new Ajv({ allErrors: true })
      const validateBody = ajv.compile(bodySchema)

      if (!validateBody(req.body)) {
        throw new ValidationError(validateBody.errors)
      }

      const rsvps = (req.body as { data: [] }).data
      const updatedGuests = []
      await Promise.all(
        rsvps.map(async rsvp => {
          const { update_Guests } = await fetchQuery({ query: mutation(rsvp) })
          updatedGuests.push(update_Guests.returning)
        })
      )

      res.status(200).send({ data: updatedGuests.flat() })
    } catch (error) {
      let errorMessage = 'Something went wrong during update'
      let code = 500
      if (error.name === 'ValidationError') {
        errorMessage = error.errors
        code = 400
      }

      res.status(code).send({ error: errorMessage })
      console.error(error)
    }
  })
}

export type Guest = {
  first_name: string
  last_name: string
  attending: boolean
  food_preference: string
  submitted: boolean
}

const bodySchema = S.object()
  .prop(
    'data',
    S.array()
      .items(
        S.object()
          .prop('first_name', S.string().required())
          .prop('last_name', S.string().required())
          .prop('attending', S.boolean().required())
          .prop('food_preference', S.string().raw({ nullable: true }))
          .prop('submitted', S.boolean().required())
      )
      .required()
  )
  .valueOf()
