import React, { useContext, createContext, useState } from 'react'
import useRequest from './use-request'

type User = {
  id?: string
  permission?: 'user' | 'admin'
  jwtToken?: string
}

type AuthContextType = {
  user: User
  signIn: (password: string, cb: () => void) => void
  signOut: (cb: () => void) => void
}

const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User>({})

  const request = useRequest()

  const signIn = async (password: string, cb: () => void) => {
    const response = await request('/api/login', { password })
    console.log(response) //response.token = jwt
    // decode with headrs to get expiry?? might be in payload {complete: true}
    setUser({ id: 'id', permission: 'user', jwtToken: '' })
    cb()
  }

  // refresh function

  const signOut = (cb: () => void) => {
    setUser({})
    cb()
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
  // put object in state to avoid re-renders
  const [auth] = useState<AuthContextType>(() => useAuthProvider())
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
