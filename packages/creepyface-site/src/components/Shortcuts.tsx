import React, { useEffect, ReactNode, useMemo } from 'react'
import { useSelector, useDispatch } from './State'
import Mousetrap from 'mousetrap'
import {
  toggleShortcuts,
  restartCreation,
  takePicture,
  toggleCode,
  toggleDance,
  nextTheme,
} from '../redux/actions'
import { ActionCreator } from '../redux/util'

const shortcuts = {
  t: toggleShortcuts,
  o: restartCreation,
  s: takePicture,
  c: toggleCode,
  d: toggleDance,
  a: process.env.NODE_ENV === 'development' ? nextTheme : undefined,
}

export default function Shortcuts({
  children,
}: {
  children: ReactNode | ReactNode[]
}) {
  const dispatch = useDispatch()

  useEffect(() => {
    Object.entries(shortcuts).forEach(([shortcut, action]) => {
      if (action) Mousetrap.bind(shortcut, () => dispatch(action()))
    })

    return () =>
      Object.keys(shortcuts).forEach((shortcut) => Mousetrap.unbind(shortcut))
  }, [dispatch])

  return <>{children}</>
}

export const useShortcuts = () => ({
  show: useSelector((state) => state.shortcuts),
  shortcut: useMemo(
    () => (action: ActionCreator) => {
      const pair = Object.entries(shortcuts).find(([_, a]) => a === action)
      return pair ? pair[0] : null
    },
    []
  ),
})
