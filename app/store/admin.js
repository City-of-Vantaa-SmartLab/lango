import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { pushError } from 'store/errors';
import * as appsyncApiCall from 'utils/appsync-api-call';

const DELETE_USER = 'Lango/admin/DELETE_USER';
const FETCH_USERS = 'Lango/admin/FETCH_USERS';
const SET_USERS = 'Lango/admin/SET_USERS';

const initialState = { users: [] };

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.data.id),
      };

    case SET_USERS:
      return {
        ...state,
        users: action.data.users,
      };

    default:
      return state;
  }
}

const selectSubstate = (rootState) => rootState.admin;

export const selectUsers = createSelector(
  selectSubstate,
  (substate) => substate.users,
);

export function deleteUser(id) {
  return { type: DELETE_USER, data: { id } };
}

export function fetchUsers() {
  return { type: FETCH_USERS };
}

function* deleteUserSaga(action) {
  try {
    yield appsyncApiCall.deleteUser({ id: action.data.id });
  } catch (e) {
    yield put(pushError(e));
  }
}

function* fetchUsersSaga() {
  try {
    const users = yield appsyncApiCall.getUsers();
    yield put({ type: SET_USERS, data: { users } });
  } catch (e) {
    yield put(pushError(e));
  }
}

export function* adminSaga() {
  yield takeLatest(DELETE_USER, deleteUserSaga);
  yield takeLatest(FETCH_USERS, fetchUsersSaga);
}
