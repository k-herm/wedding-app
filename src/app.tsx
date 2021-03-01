import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import PrivateRoute from './utils/private-route'
import { AuthProvider } from './utils/auth-context'

import Home from './pages/home'
import Admin from './pages/admin'

import { theme } from './theme'

// TODO create 404 page
const App = (): JSX.Element => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <PrivateRoute path="/admin">
            <Admin />
          </PrivateRoute>

          <Route path="*">
            <div>This page does not exist</div>
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  </ThemeProvider>
)

export default App
