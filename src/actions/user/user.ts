import axios from 'axios';
import { Dispatch } from 'redux';
import { get } from 'lodash';
import { SET_USER, SystemState } from '../../reducers/user/types';
import { history } from '../../index';
import { buildEndpointUrl } from '../../utilities';

// TypeScript infers that this function is returning SendMessageAction
const setUser = ({ user, isLoading, hasErrored } : { user?: SystemState, isLoading?: Boolean, hasErrored?: Boolean }) => {
  return {
    type: SET_USER,
    payload: { user, isLoading, hasErrored }
  }
}

export function getUser() {
  return (dispatch: Dispatch) => {
    dispatch(setUser({ isLoading: true, hasErrored: false }));
    axios
      .get(buildEndpointUrl('me'))
      .then((res) => {
        dispatch(setUser({ user: res.data, isLoading: false, hasErrored: false }));
      })
      .catch((err) => {
        if (get(err, 'response.status') === 401) {
          history.push('/login');
          dispatch(setUser({ isLoading: false, hasErrored: false }));
        } else {
          dispatch(setUser({ isLoading: false, hasErrored: true }));
        }
      });
  }
}

export default getUser;
