import User from '../../models/User';

export const SET_USER = 'SET_USER';

export interface SystemState {
  user?: User | undefined;
  isLoading?: boolean;
  hasErrored?: boolean;
}

interface GetUserAction {
  type: typeof SET_USER;
  payload: SystemState;
}

export type SystemActionTypes = GetUserAction
