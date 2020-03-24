import React, { ReactNode, useMemo } from 'react'
import {
  Provider as ReduxProvider,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook
} from 'react-redux'
import createStore from '../redux/store'
import { State, Action } from '../redux/types'
import { Dispatch } from '../redux/types'
import { Store } from 'redux'

export default function StateProvider(props: {
  store?: Store<State, Action>
  children: ReactNode | ReactNode[]
}) {
  const store = useMemo(() => props.store || createStore(), [props.store])
  return <ReduxProvider store={store}>{props.children}</ReduxProvider>
}

export const useSelector: TypedUseSelectorHook<State> = useReduxSelector
export const useDispatch: () => Dispatch = useReduxDispatch
