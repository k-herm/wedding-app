import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import PrivateRoute from './utils/private-route'
import { AuthProvider } from './utils/auth-context'

import Home from './pages/home'
import Admin from './pages/admin'
import Rsvp from './pages/rsvp'
import PageDoesNotExist from './pages/404'

import { theme } from './theme'

const App = (): JSX.Element => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/rsvp">
            <Rsvp />
          </Route>

          <PrivateRoute path="/admin" permission="admin">
            <Admin />
          </PrivateRoute>

          <Route path="*">
            <PageDoesNotExist />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  </ThemeProvider>
)

export default App
