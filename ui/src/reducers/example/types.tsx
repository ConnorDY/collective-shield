export const GET_EXAMPLE_SUCCESS = 'GET_EXAMPLE_SUCCESS';

export interface SystemState {
  example: boolean;
}

interface GetExampleSuccessAction {
  type: typeof GET_EXAMPLE_SUCCESS;
  payload: SystemState;
}

export type SystemActionTypes = GetExampleSuccessAction;
