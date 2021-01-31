import fetch from 'isomorphic-fetch'

interface Response<T> {
  errorMessage?: string
  responseCode?: string
  data?: T
}

export default async (
  url: string,
  data: unknown
): Promise<Response<unknown>> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('ERROR: ', error)
    return { errorMessage: 'Request was unable to send.' }
  }
}
