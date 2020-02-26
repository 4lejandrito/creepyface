import { createStore, applyMiddleware, compose, Store } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import reducer from './reducer'
import track from './track'
import { History } from 'history'
import { State, Action } from './types'

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default (history: History): Store<State, Action> =>
  createStore(
    reducer(history),
    undefined,
    composeEnhancers(applyMiddleware(routerMiddleware(history), thunk, track))
  )
