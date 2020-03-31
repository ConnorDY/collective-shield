import { SystemState, SystemActionTypes, SET_USER } from './types'

const initialState: SystemState = {
  user: undefined,
  isLoading: false,
  hasErrored: false,
}

export function user(
  state = initialState,
  action: SystemActionTypes
): SystemState {
  switch (action.type) {
    case SET_USER: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}
