import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom'
import styled from 'styled-components'
import { useAuthContext } from './auth-context'

import Login from '../components/login'

type FilterProps = {
  filter: boolean
}

type PrivateRouteProps = {
  children: React.ReactNode
  path: string
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
  ...rest
}: PrivateRouteProps): JSX.Element => {
  const auth = useAuthContext()
  console.log(auth.user)
  // check expiry
  // call refresh if needed
  return (
    <Route
      {...rest}
      render={({ location }) => (
        <>
          <Login />
          <Filter filter={true}>{children}</Filter>
        </>
      )}
    />
  )
}

export default PrivateRoute

{
  /* <Redirect
  to={{
    pathname: '/',
    state: { from: location }
  }}
/> */
}
