import { combineReducers } from 'redux';
import example from './example';
import user from './user';

export const rootReducer = combineReducers({
  ...example,
  ...user,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer
