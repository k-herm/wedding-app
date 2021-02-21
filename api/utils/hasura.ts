import fetch from 'isomorphic-fetch'

type Query = {
  query: string
  variables?: Record<string, unknown>
}

type Data = {
  Guests?: [Record<string, unknown>]
  insert_Guests?: {
    returning: [Record<string, unknown>]
  }
  Users?: [Record<string, string>]
  insert_Users_one?: {
    user_id: string
  }
  update_Users?: {
    returning: [Record<string, unknown>]
  }
}

async function query({ query, variables = {} }: Query): Promise<Data> {
  try {
    const response = await fetch(process.env.HASURA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({ query, variables })
    })

    const result = await response.json()
    return result.data
  } catch (error) {
    // TODO send back helpful information if there are errors
    console.error(error)
  }
}

export default query
