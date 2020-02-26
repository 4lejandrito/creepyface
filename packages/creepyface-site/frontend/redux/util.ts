import { ThunkAction } from 'redux-thunk'
import { State, Action } from './types'

type ActionCreatorFn = () => ThunkAction<void, State, void, Action>

export type ActionCreator = ActionCreatorFn & {
  enabled: (state: State) => boolean
}

export const makeActionCreator = (
  actionCreator: ActionCreatorFn,
  enabled: (state: State) => boolean = () => true
): ActionCreator => {
  const wrappedActionCreator: ActionCreator = () => (dispatch, getState) => {
    if (enabled(getState())) {
      dispatch(actionCreator())
    }
  }

  wrappedActionCreator.enabled = enabled

  return wrappedActionCreator
}
