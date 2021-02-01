import { createStore, applyMiddleware, compose, Store } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import track from './track'
import { State, Action } from './types'

let composeEnhancers = compose

if (typeof (window as any) !== 'undefined') {
  composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

export default function store(): Store<State, Action> {
  return createStore(reducer, composeEnhancers(applyMiddleware(thunk, track)))
}
