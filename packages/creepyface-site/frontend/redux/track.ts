import { Action } from './types'

export default () => (next: (action: Action) => void) => (action: Action) => {
  const plausible = (window as any).plausible
  plausible && plausible(action.type)
  next(action)
}
