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

type AuthContextType = {
  user: User
  signIn: (
    password: string,
    cb?: () => void
  ) => Promise<Response<{ token: string }>>
  signOut: (cb?: () => void) => void
}

const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User>({})

  const request = useRequest()

  const signIn = async (
    password: string,
    cb?: () => void
  ): Promise<Response<JWT>> => {
    const response = (await request('/api/login', {
      password
    })) as Response<JWT>
    if (response?.data?.token) {
      const payload = jwt.decode(response.data.token) as User
      setUser({
        user_id: payload.user_id,
        permission: payload.permission,
        jwtToken: response.data.token
      })
      cb && cb()
    }

    return response
  }

  // refresh function

  const signOut = (cb?: () => void) => {
    // setUser({})
    cb && cb()
  }

  return { user, signIn, signOut }
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
