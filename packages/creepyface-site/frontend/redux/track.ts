import { Action } from './types'

const track = (action: any) => {
  fetch('/event', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(action)
  })
}

export default () => (next: (action: Action) => void) => (action: Action) => {
  if (action.type === 'receiveMessages') {
    track({ type: action.type, payload: action.payload.value })
  } else if (action.type === 'takePicture') {
    track({ type: action.type, payload: action.payload.src })
  } else {
    track(action)
  }
  const plausible = (window as any).plausible
  plausible && plausible(action.type)
  next(action)
}
