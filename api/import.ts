import { NowRequest, NowResponse } from '@vercel/node'
import fetchQuery from './utils/hasura'

type Guest = {
  first_name: string
  last_name: string
  family: string
}

let fakeIncomingData = [
  { first_name: 'Kiesha', last_name: 'Herman', family: 'michaelherman' },
  { first_name: 'Colin', last_name: 'Parry', family: 'normparry' }
]

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

export default async function (
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  try {
    const { Guests } = await fetchQuery({ query })

    // replace with request incoming data
    fakeIncomingData = fakeIncomingData.filter(newGuest =>
      Guests.find(
        currentGuest =>
          currentGuest.first_name === newGuest.first_name &&
          currentGuest.last_name === newGuest.last_name &&
          currentGuest.family === newGuest.family
      )
        ? false
        : true
    )

    const { insert_Guests } = await fetchQuery({
      query: mutation(fakeIncomingData)
    })

    res.send(insert_Guests.returning)
  } catch (error) {
    console.error(error)
  }
}
