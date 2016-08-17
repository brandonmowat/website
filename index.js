import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

// Base styles (more of a reset than anything)
import './src/sass/_base.scss'

import App from './src/App'
import Chat from './src/views/Chat'

render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Chat}/>
      </Route>
    </Router>
  ),
  document.getElementById('app')
)
