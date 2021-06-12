import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import PageTransition from './components/page-transition'
import PrivateRoute from './utils/private-route'
import { AuthProvider } from './utils/auth-context'

const Home = lazy(() => import('./pages/home'))
const Admin = lazy(() => import('./pages/admin'))
const Rsvp = lazy(() => import('./pages/rsvp'))
const PageDoesNotExist = lazy(() => import('./pages/404'))

import { theme } from './theme'

const App = (): JSX.Element => (
  // TO DO add loading state
  <Suspense fallback={<></>}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <PageTransition>
            {({ location }) => (
              <Switch location={location}>
                <Route exact path="/">
                  <Home />
                </Route>

                <PrivateRoute path="/rsvp">
                  {({ isLoggedIn }) => <Rsvp mount={isLoggedIn} />}
                </PrivateRoute>

                <PrivateRoute path="/admin" permission="admin">
                  <Admin />
                </PrivateRoute>

                <Route path="*">
                  <PageDoesNotExist />
                </Route>
              </Switch>
            )}
          </PageTransition>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  </Suspense>
)

export default App
