import React, { ReactNode } from 'react'
import {
  Provider as ReduxProvider,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook
} from 'react-redux'
import { createBrowserHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import createStore from '../redux/store'
import { State } from '../redux/types'
import { Dispatch } from '../redux/types'

const history = createBrowserHistory()
const store = createStore(history)

export default function StateProvider({
  children
}: {
  children: ReactNode | ReactNode[]
}) {
  return (
    <ReduxProvider store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </ReduxProvider>
  )
}

export const useSelector: TypedUseSelectorHook<State> = useReduxSelector
export const useGlobalState = () => useSelector(state => state)
export const useDispatch: () => Dispatch = useReduxDispatch
