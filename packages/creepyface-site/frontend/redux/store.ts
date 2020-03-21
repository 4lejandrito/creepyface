import { createStore, applyMiddleware, compose, Store } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import track from './track'
import { State, Action } from './types'

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default (): Store<State, Action> =>
  createStore(reducer, composeEnhancers(applyMiddleware(thunk, track)))
