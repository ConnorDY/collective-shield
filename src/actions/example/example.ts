import { GET_EXAMPLE_SUCCESS } from '../../reducers/example/types';

// TypeScript infers that this function is returning SendMessageAction
export function setExample(val: Boolean) {
  return {
    type: GET_EXAMPLE_SUCCESS,
    payload: { example: val }
  };
}

export default setExample;
