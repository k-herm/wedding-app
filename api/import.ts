import { NowRequest, NowResponse } from '@vercel/node'
import fetchQuery from './utils/hasura'

type Guest = {
  first_name: string
  last_name: string
  family: string
}

const query = `
  query getAllGuests {
    Guests {
      first_name
      last_name
      family
    }
  }
`
const mutation = (guests: Array<Guest>) => `
  mutation insertGuests {
    insert_Guests(objects: [ ${guests.map(
      guest =>
        `{last_name: "${guest.last_name}", first_name: "${guest.first_name}", family: "${guest.family}"}`
    )} ]) {
      returning {
        id
      }
    }
  }
`

// TODO ADD AUTHENTICATION
export default async function (
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  try {
    if (!req.body.data) return
    const incomingData = req.body.data

    const { Guests: currentGuests } = await fetchQuery({ query })

    const newGuests = incomingData.filter(newGuest =>
      currentGuests.find(
        currentGuest =>
          currentGuest.first_name === newGuest.first_name &&
          currentGuest.last_name === newGuest.last_name &&
          currentGuest.family === newGuest.family
      )
        ? false
        : true
    )

    const { insert_Guests } = await fetchQuery({
      query: mutation(newGuests)
    })

    res.send(insert_Guests.returning)
  } catch (error) {
    res.status(400).send({ error: 'Something went wrong during import' })
    console.error(error)
  }
}
