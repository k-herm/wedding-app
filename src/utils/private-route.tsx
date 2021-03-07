import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { useAuthContext } from './auth-context'

import Login from '../components/login'

type FilterProps = {
  filter?: string
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
  const { user, signIn, refresh } = useAuthContext()

  const [showLogin, setShowLogin] = useState(false)
  useEffect(() => {
    if (user?.user_id) {
      permission
        ? setShowLogin(!(user.permission === permission))
        : setShowLogin(false) // all users can access
      return
    }

    if (refresh) {
      refresh()
      return
    }

    setShowLogin(true)
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
          {showLogin && <Login signIn={signIn} />}
          <Filter filter={showLogin ? 'true' : undefined}>{children}</Filter>
        </>
      )}
    />
  )
}

export default PrivateRoute
