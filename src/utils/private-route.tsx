import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { useAuthContext } from './auth-context'

import Login from '../components/login'

type FilterProps = {
  filter: boolean
}

type PrivateRouteProps = {
  children: React.ReactNode
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
  const { user, refresh } = useAuthContext()

  const [showLogin, setShowLogin] = useState(true)
  useEffect(() => {
    if (user?.user_id) {
      if (permission) {
        setShowLogin(!(user.permission === permission))
      } else {
        setShowLogin(false)
      }
    } else {
      setShowLogin(true)
    }
  }, [user?.user_id])

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
          {showLogin && <Login />}
          <Filter filter={showLogin}>{children}</Filter>
        </>
      )}
    />
  )
}

export default PrivateRoute
