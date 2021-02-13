import fetch from 'isomorphic-fetch'

export interface Response<T> {
  error?: string
  responseCode?: string
  data?: T
}

export default async (url: string, data: unknown): Promise<Response<[]>> => {
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
    return { error: 'Request was unable to send.' }
  }
}
