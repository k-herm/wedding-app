import React, { useContext, createContext, useState } from 'react'
import useRequest, { Response } from './use-request'
import jwt from 'jsonwebtoken'

type User = {
  user_id?: string
  permission?: 'user' | 'admin'
  jwtToken?: string
}

type JWT = {
  token: string
}

export type SignInFunction = (
  password: string,
  cb?: () => void
) => Promise<Response<{ token: string }>>

type AuthContextType = {
  user: User
  signIn: SignInFunction
  signOut: (cb?: () => void) => void
  refresh: (cb?: () => void) => void
}

const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User>({})

  const request = useRequest()

  const decodeAndSet = (token: string) => {
    const payload = jwt.decode(token) as User
    setUser({
      user_id: payload.user_id,
      permission: payload.permission,
      jwtToken: token
    })
  }

  const signIn = async (
    password: string,
    cb?: () => void
  ): Promise<Response<JWT>> => {
    const response = (await request('/api/login', {
      password
    })) as Response<JWT>
    if (response?.data?.token) {
      decodeAndSet(response.data.token)
      cb && cb()
    }

    return response
  }

  const refresh = async (cb?: () => void) => {
    const response = (await request('/api/refresh')) as Response<JWT>
    if (response?.data?.token) {
      decodeAndSet(response.data.token)
      cb && cb()
    }
    return response
  }

  const signOut = (cb?: () => void) => {
    setUser({})
    cb && cb()
  }

  return { user, signIn, signOut, refresh }
}

const authContext = createContext<Partial<AuthContextType>>({})

export const useAuthContext = (): Partial<AuthContextType> =>
  useContext(authContext)

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const auth = useAuthProvider()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
