import React, { useEffect, ReactNode, useMemo } from 'react'
import { useSelector, useDispatch } from './State'
import Mousetrap from 'mousetrap'
import {
  toggleLocale,
  toggleShortcuts,
  restartCreation,
  takePicture,
  toggleCode,
  toggleFirefly
} from '../redux/actions'
import { ActionCreator } from '../redux/util'

const shortcuts = {
  l: toggleLocale,
  t: toggleShortcuts,
  o: restartCreation,
  s: takePicture,
  c: toggleCode,
  f: toggleFirefly
}

export default function Shortcuts({
  children
}: {
  children: ReactNode | ReactNode[]
}) {
  const dispatch = useDispatch()

  useEffect(() => {
    Object.entries(shortcuts).forEach(([shortcut, action]) => {
      Mousetrap.bind(shortcut, () => dispatch(action()))
    })

    return () =>
      Object.keys(shortcuts).forEach(shortcut => Mousetrap.unbind(shortcut))
  }, [])

  return <>{children}</>
}

export const useShortcuts = () => ({
  show: useSelector(state => state.shortcuts),
  shortcut: useMemo(
    () => (action: ActionCreator) => {
      const pair = Object.entries(shortcuts).find(([_, a]) => a === action)
      return pair ? pair[0] : null
    },
    []
  )
})
