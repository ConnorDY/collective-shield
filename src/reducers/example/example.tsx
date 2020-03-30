import { SystemState, SystemActionTypes, GET_EXAMPLE_SUCCESS } from './types'

const initialState: SystemState = {
  example: false
}

export function example(
  state = initialState,
  action: SystemActionTypes
): SystemState {
  switch (action.type) {
    case GET_EXAMPLE_SUCCESS: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}
