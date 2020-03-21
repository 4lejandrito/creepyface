import React, { ReactNode } from 'react'
import {
  Provider as ReduxProvider,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook
} from 'react-redux'
import createStore from '../redux/store'
import { State } from '../redux/types'
import { Dispatch } from '../redux/types'

const store = createStore()

export default function StateProvider({
  children
}: {
  children: ReactNode | ReactNode[]
}) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

export const useSelector: TypedUseSelectorHook<State> = useReduxSelector
export const useDispatch: () => Dispatch = useReduxDispatch
