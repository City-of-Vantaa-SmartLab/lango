import { select, put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import profilePicture from 'utils/profile-picture';
import { pushError } from 'store/errors';
import { signOut } from 'store/session'; // eslint-disable-line import/no-cycle
import * as appsyncApiCall from 'utils/appsync-api-call';

const DELETE = 'Lango/user/DELETE';
const NEW = 'Lango/user/NEW';
const PUT = 'Lango/user/PUT';
const PUT_PREFERENCES = 'Lango/user/PUT_PREFERENCES';
const SET = 'Lango/user/SET';
const SET_GENDER_PREFERENCE = 'Lango/user/SET_GENDER_PREFERENCE';

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET:
      return action.data;

    case SET_GENDER_PREFERENCE: {
      const preferences = {
        ...(state.preferences || {}),
        gender: action.data.gender,
      };
      return {
        ...state,
        preferences,
      };
    }

    default:
      return state;
  }
}

const selectState = (rootState) => rootState.user;

export const selectUser = selectState;

export const selectUserId = createSelector(
  selectState,
  (state) => state.id,
);

export const selectUserIsAdmin = createSelector(
  selectState,
  (state) => state.isAdmin,
);

export const selectUserPreferences = createSelector(
  selectState,
  (state) => state.preferences || {},
);

export function changeGenderPreference(gender) {
  return { type: SET_GENDER_PREFERENCE, data: { gender } };
}

export function deleteUser() {
  return { type: DELETE };
}

export function newUser(user) {
  return { type: NEW, data: user };
}

export function putUser(user) {
  return { type: PUT, data: user };
}

export function savePreferences(preferences) {
  return { type: PUT_PREFERENCES, preferences };
}

export function setUser(user) {
  return { type: SET, data: user };
}

function* deleteSaga() {
  const userId = yield select(selectUserId);

  try {
    yield profilePicture.remove();
  } catch (e) {
    console.error(`Could not delete profile picture: ${e}`);
  }

  yield appsyncApiCall.deleteUser({ id: userId });

  yield put(signOut());
}

function* newSaga(action) {
  try {
    const { description, email, firstName, gender, location, isHidden, learning, spoken, cognitoId, pictureUrl } = action.data;

    const { userId } = yield appsyncApiCall.createCognitoIdToUserIdMapping({ cognitoId });
    yield appsyncApiCall.putUser({ id: userId, firstName, email, description, gender, location, isHidden });
    yield appsyncApiCall.putUserLanguages({ learning, spoken });

    const picBlob = yield fetch(pictureUrl).then((response) => response.blob());
    yield profilePicture.put(picBlob);

    window.location.href = `${window.location.origin}/`;
  } catch (e) {
    yield put(pushError(e));
  }
}

function* putSaga(action) {
  try {
    const { description, email, firstName, gender, location, isHidden, learning, spoken } = action.data;

    const userId = yield select(selectUserId);
    yield appsyncApiCall.putUser({ id: userId, firstName, email, description, gender, location, isHidden });
    yield appsyncApiCall.putUserLanguages({ learning, spoken });

    window.location.href = `${window.location.origin}/`;
  } catch (e) {
    yield put(pushError(e));
  }
}

function* putPreferencesSaga() {
  try {
    const { preferences } = yield select(selectUser);

    yield appsyncApiCall.putUserPreferences(preferences);

    window.location.href = `${window.location.origin}/`;
  } catch (e) {
    yield put(pushError(e));
  }
}

export function* userSaga() {
  yield takeLatest(DELETE, deleteSaga);
  yield takeLatest(NEW, newSaga);
  yield takeLatest(PUT, putSaga);
  yield takeLatest(PUT_PREFERENCES, putPreferencesSaga);
}
