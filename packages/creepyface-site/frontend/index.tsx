import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Language from './components/Language'
import Shortcuts from './components/Shortcuts'
import State from './components/State'

ReactDOM.render(
  <State>
    <Shortcuts>
      <Language>
        <App />
      </Language>
    </Shortcuts>
  </State>,
  document.getElementById('root')
)
