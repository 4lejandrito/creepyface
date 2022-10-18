import { makeActionCreator } from './util'
import getNext from '../util/get-next'
import { themes } from '../util/theme'

export const toggleShortcuts = makeActionCreator(
  () => (dispatch) => dispatch({ type: 'toggleShortcuts' })
)

export const setIsCreating = (isCreating: boolean) =>
  makeActionCreator(() => (dispatch, getState) => {
    if (isCreating !== getState().isCreating) {
      dispatch({
        type: isCreating ? 'startCreation' : 'stopCreation',
      })
    }
  })

export const restartCreation = makeActionCreator(
  () => (dispatch) => dispatch({ type: 'restartCreation' })
)

export const takePicture = makeActionCreator(
  () => (dispatch, getState) => {
    const { shoot } = getState()
    if (shoot) {
      const picture = shoot()
      dispatch({
        type: 'takePicture',
        payload: picture,
      })
    }
  },
  ({ shoot }) => !!shoot
)

export const upload = () =>
  makeActionCreator(
    () => (dispatch, getState) => {
      dispatch({ type: 'requestUpload' })
      const { pictures, permissions, reload, namespace } = getState()
      fetch('/api/content', {
        credentials: 'include',
        method: 'POST',
        body: (() => {
          var formData = new FormData()

          Object.entries(pictures).forEach(([k, picture]) => {
            if (picture) formData.append(k, picture.blob)
          })

          Object.entries(permissions).forEach(([name, enabled]) => {
            formData.append(name, `${enabled}`)
          })

          if (namespace) {
            formData.append('namespace', namespace.key)
          }

          return formData
        })(),
      })
        .then((res) => res.json())
        .then((data: { download: string; view: string; count: number }) => {
          reload?.()
          dispatch({ type: 'receiveUpload', payload: data })
        })
        .catch(() => dispatch({ type: 'uploadFailed' }))
    },
    ({ pictures }) => getNext(pictures) === undefined
  )

export const toggleCode = makeActionCreator(
  () => (dispatch) => dispatch({ type: 'toggleCode' }),
  ({ pointProvider }) => pointProvider !== 'dance'
)

export const showPermissions = makeActionCreator(
  () => (dispatch) => dispatch({ type: 'showPermissions' })
)

export const changePointProvider = (
  pointProvider: 'pointer' | 'firefly' | 'dance'
) =>
  makeActionCreator(() => (dispatch, getState) => {
    dispatch({
      type: 'changePointProvider',
      payload:
        getState().pointProvider === pointProvider ? 'pointer' : pointProvider,
    })
  })

export const toggleDance = makeActionCreator(() => (dispatch, getState) => {
  const { pointProvider } = getState()
  dispatch({
    type: 'changePointProvider',
    payload: pointProvider === 'dance' ? 'pointer' : 'dance',
  })
})

export const nextTheme = makeActionCreator(() => (dispatch, getState) => {
  const { theme } = getState()
  const allThemes = Object.values(themes)
  dispatch({
    type: 'setTheme',
    payload: allThemes[(allThemes.indexOf(theme) + 1) % allThemes.length],
  })
})
