import { makeActionCreator } from './util'
import getNext from '../util/get-next'
import { Language, Action, Dispatch, State, Namespace } from './types'
import url from '../util/url'

const receiveMessages = ({
  value,
  messages,
}: {
  value: Language
  messages?: { [K: string]: string }
}): Action => {
  document.documentElement.lang = value
  localStorage.setItem('locale', value)
  return {
    type: 'receiveMessages',
    payload: { value, messages },
  }
}

const loadLocaleValue = (value: Language) => (
  dispatch: Dispatch,
  getState: () => State
) => {
  const { locale } = getState()
  dispatch({ type: 'requestMessages', payload: value })
  if (value === 'es') {
    if (!locale.messages) {
      import('../locales/es').then(({ messages }) => {
        dispatch(receiveMessages({ value, messages }))
      })
    } else {
      dispatch(receiveMessages({ value, messages: locale.messages }))
    }
  } else {
    dispatch(receiveMessages({ value, messages: locale.messages }))
  }
}

export const loadLocale = makeActionCreator(() => (dispatch, getState) => {
  const { locale } = getState()
  dispatch(loadLocaleValue(locale.value))
})

export const toggleLocale = makeActionCreator(() => (dispatch, getState) => {
  const { locale } = getState()
  dispatch(loadLocaleValue(locale.value === 'en' ? 'es' : 'en'))
})

export const toggleShortcuts = makeActionCreator(() => (dispatch) =>
  dispatch({ type: 'toggleShortcuts' })
)

export const setIsCreating = (isCreating: boolean) =>
  makeActionCreator(() => (dispatch, getState) => {
    if (isCreating !== getState().isCreating) {
      dispatch({
        type: isCreating ? 'startCreation' : 'stopCreation',
      })
    }
  })

export const restartCreation = makeActionCreator(() => (dispatch) =>
  dispatch({ type: 'restartCreation' })
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

export const upload = (namespace: Namespace) =>
  makeActionCreator(
    () => (dispatch, getState) => {
      dispatch({ type: 'requestUpload' })
      const { pictures, permissions } = getState()
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
            formData.append('namespace', namespace)
          }

          return formData
        })(),
      })
        .then((res) => res.json())
        .then((data: { download: string; view: string; count: number }) =>
          dispatch({ type: 'receiveUpload', payload: data })
        )
        .catch(() => dispatch({ type: 'uploadFailed' }))
    },
    ({ pictures }) => getNext(pictures) === undefined
  )

export const requestCount = (namespace: Namespace) =>
  makeActionCreator(() => (dispatch) => {
    fetch(`${url}/api/count${namespace ? '?namespace=' + namespace : ''}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(({ count }: { count: number }) =>
        dispatch({ type: 'receiveCount', payload: count })
      )
  })

export const toggleCode = makeActionCreator(
  () => (dispatch) => dispatch({ type: 'toggleCode' }),
  ({ pointProvider }) => pointProvider !== 'dance'
)

export const showPermissions = makeActionCreator(() => (dispatch) =>
  dispatch({ type: 'showPermissions' })
)

export const nextPointProvider = makeActionCreator(
  () => (dispatch, getState) => {
    const pointProviders = ['pointer', 'firefly', 'dance'] as const
    const { pointProvider } = getState()
    dispatch({
      type: 'changePointProvider',
      payload:
        pointProviders[
          (pointProviders.indexOf(pointProvider) + 1) % pointProviders.length
        ],
    })
  }
)

export const toggleDance = makeActionCreator(() => (dispatch, getState) => {
  const { pointProvider } = getState()
  dispatch({
    type: 'changePointProvider',
    payload: pointProvider === 'dance' ? 'pointer' : 'dance',
  })
})
