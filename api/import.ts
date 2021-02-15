import { NowRequest, NowResponse } from '@vercel/node'
import S from 'fluent-json-schema'
import Ajv from 'ajv'
import withAuth from './utils/with-auth'
import fetchQuery from './utils/hasura'
import { ValidationError } from './utils/validation-error'

const query = `
  query getAllGuests {
    Guests {
      first_name
      last_name
      family
    }
  }
`
export const mutation = (guests: Guest[]): string => `
  mutation insertGuests {
    insert_Guests(objects: [ ${guests.map(
      guest => `{
        last_name: "${guest.last_name.trim()}", 
        first_name: "${guest.first_name.trim()}", 
        family: "${guest.family.trim()}"
      }`
    )} ]) {
      returning {
        id
      }
    }
  }
`

export default async (req: NowRequest, res: NowResponse): Promise<void> =>
  withAuth(req, res, async () => {
    try {
      const ajv = new Ajv({ allErrors: true })
      const validateBody = ajv.compile(bodySchema)

      if (!validateBody(req.body)) {
        throw new ValidationError(validateBody.errors)
      }

      const incomingData = (req.body as { data: [] }).data
      const { Guests: currentGuests } = await fetchQuery({ query })

      const newGuests = incomingData.filter((newGuest: Guest) =>
        currentGuests.find(
          currentGuest =>
            currentGuest.first_name === newGuest.first_name.trim() &&
            currentGuest.last_name === newGuest.last_name.trim() &&
            currentGuest.family === newGuest.family.trim()
        )
          ? false
          : true
      )

      const { insert_Guests } = await fetchQuery({
        query: mutation(newGuests)
      })

      res.status(200).send({ data: insert_Guests.returning })
    } catch (error) {
      let errorMessage = 'Something went wrong during import'
      let code = 500
      if (error.name === 'ValidationError') {
        errorMessage = error.errors
        code = 400
      }

      res.status(code).send({ error: errorMessage })
      console.error(error)
    }
  })

// TYPES / SCHEMAS
type Guest = {
  first_name: string
  last_name: string
  family: string
}

const bodySchema = S.object()
  .prop(
    'data',
    S.array()
      .items(
        S.object()
          .prop('first_name', S.string().required())
          .prop('last_name', S.string().required())
          .prop('family', S.string().required())
      )
      .required()
  )
  .valueOf()
