import fetch from 'isomorphic-fetch'
import { useAuthContext } from './auth-context'

export interface Response<T> {
  error?: string
  responseCode?: string
  data?: T
}

const useRequest = (): ((
  url: string,
  data: unknown
) => Promise<Response<[]>>) => {
  const { user } = useAuthContext()
  const request = async (url: string, data: unknown): Promise<Response<[]>> => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': ''
    }
    if (user?.jwtToken) {
      headers.Authorization = `Bearer ${user.jwtToken}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include'
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('ERROR: ', error)
      return { error: 'Request was unable to send.' }
    }
  }

  return request
}

export default useRequest
