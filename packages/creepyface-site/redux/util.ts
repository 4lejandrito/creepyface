import { ThunkAction } from 'redux-thunk'
import { State, Action } from './types'

type ActionCreatorFunction = () => ThunkAction<void, State, void, Action>

export type ActionCreator = ActionCreatorFunction & {
  enabled: (state: State) => boolean
}

export const makeActionCreator = (
  actionCreatorFunction: ActionCreatorFunction,
  enabled: (state: State) => boolean = () => true
): ActionCreator => {
  const actionCreator = () => actionCreatorFunction()

  actionCreator.enabled = enabled

  return wrapActionCreator(actionCreator, (dispatch, getState) => {
    if (enabled(getState())) {
      dispatch()
    }
  })
}

export const wrapActionCreator = (
  actionCreator: ActionCreator,
  wrapper: (dispatch: () => void, getState: () => State) => void
): ActionCreator => {
  const wrappedActionCreator: ActionCreator = () => (dispatch, getState) =>
    wrapper(() => dispatch(actionCreator()), getState)

  wrappedActionCreator.enabled = actionCreator.enabled

  return wrappedActionCreator
}
