import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { useAuthContext } from './auth-context'

import Login from '../components/login'
import { Response } from './use-request'
import { JWT } from './auth-context'

type FilterProps = {
  filter?: string
}

type PrivateRouteProps = {
  children: JSX.Element | ((props: { isLoggedIn: boolean }) => JSX.Element)
  path: string
  permission?: string
}

const Filter = styled.div<FilterProps>`
  ${props =>
    props.filter &&
    `
    filter: blur(8px);
    -webkit-filter: blur(6px);
  `}
`

const PrivateRoute = ({
  children,
  permission = '',
  ...rest
}: PrivateRouteProps): JSX.Element => {
  const { user, signIn, refresh } = useAuthContext()

  const [showLogin, setShowLogin] = useState(false)
  useEffect(() => {
    const getUser = async () => {
      if (user?.user_id) {
        permission
          ? setShowLogin(!(user.permission === permission))
          : setShowLogin(false) // all permissions can access
        return
      }

      if (refresh) {
        const response = (await refresh()) as Response<JWT>
        if (response.data?.token) {
          setShowLogin(false)
        } else {
          setShowLogin(true)
        }
      }
    }

    getUser()
  }, [user?.permission])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (user?.jwtToken) {
      timer = setTimeout(() => refresh && refresh(), 1000 * 60 * 20)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [user?.jwtToken])

  return (
    <Route
      {...rest}
      render={() => (
        <>
          <Login signIn={signIn} showLogin={showLogin} />
          <Filter filter={showLogin ? 'true' : undefined}>
            {typeof children === 'function'
              ? children({ isLoggedIn: !showLogin })
              : children}
          </Filter>
        </>
      )}
    />
  )
}

export default PrivateRoute
