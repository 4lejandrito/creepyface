import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Language from './components/Language'
import Shortcuts from './components/Shortcuts'
import State from './components/State'
import Router from './components/Router'

ReactDOM.render(
  <State>
    <Router>
      <Shortcuts>
        <Language>
          <App />
        </Language>
      </Shortcuts>
    </Router>
  </State>,
  document.getElementById('root')
)
