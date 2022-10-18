import React, { ReactNode, useMemo } from 'react'
import {
  Provider as ReduxProvider,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux'
import createStore from '../redux/store'
import { State } from '../redux/types'
import { Dispatch } from '../redux/types'
import ThemeProvider from './Theme'
import { Namespace } from '../util/namespaces'

export default function StateProvider(props: {
  namespace: Namespace | null
  children: ReactNode | ReactNode[]
}) {
  const store = useMemo(() => createStore(props.namespace), [props.namespace])
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>{props.children}</ThemeProvider>
    </ReduxProvider>
  )
}

export const useSelector: TypedUseSelectorHook<State> = useReduxSelector
export const useDispatch: () => Dispatch = useReduxDispatch
export const useNamespace = () =>
  useSelector((state) => state.namespace ?? undefined)
