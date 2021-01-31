import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './pages/home'
import Admin from './pages/admin'

// TODO create 404 page
const App = (): JSX.Element => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="*">
        <div>This page does not exist</div>
      </Route>
    </Switch>
  </Router>
)

export default App
