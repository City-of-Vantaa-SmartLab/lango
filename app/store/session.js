/* global firebase */

import { Auth } from 'aws-amplify';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { pushError } from 'store/errors';
import { setUser } from 'store/user'; // eslint-disable-line import/no-cycle
import { fetchFriendships, listenToMessages } from 'store/friendships'; // eslint-disable-line import/no-cycle
import * as appsyncApiCall from 'utils/appsync-api-call';
import { config } from 'utils/login-configuration';

const CREATE_SESSION = 'Lango/session/CREATE_SESSION';
const MARK_PUSH_TOKEN_SERVICE_WORKER_USED = 'Lango/session/MARK_PUSH_TOKEN_SERVICE_WORKER_USED';
const SET_COGNITO_ID = 'Lango/session/SET_COGNITO_ID';
const SET_FEDERATED_DATA = 'Lango/session/SET_FEDERATED_DATA';
const SIGN_IN = 'Lango/session/SIGN_IN';
const SIGN_OUT = 'Lango/session/SIGN_OUT';
const USER_IS_NEW = 'Lango/session/USER_IS_NEW';

export const SIGN_OUT_FINISHED = 'Lango/SIGN_OUT_FINISHED';

const initialState = {
  cognitoId: null,
  cognitoLoginFinished: false,
  federatedData: null,
  pushTokenServiceWorkerUsed: false,
  userIsNew: false,
};

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case MARK_PUSH_TOKEN_SERVICE_WORKER_USED:
      return {
        ...state,
        pushTokenServiceWorkerUsed: true,
      };

    case SET_COGNITO_ID:
      return {
        ...state,
        cognitoId: action.data.cognitoId,
        cognitoLoginFinished: true,
      };

    case SET_FEDERATED_DATA:
      return {
        ...state,
        federatedData: action.data,
      };

    case USER_IS_NEW:
      return {
        ...state,
        userIsNew: true,
      };

    case SIGN_OUT_FINISHED:
      return {
        ...state,
        cognitoLoginFinished: true,
      };

    default:
      return state;
  }
}

export const selectSession = (rootState) => rootState.session;

export const selectIsLoggedIn = createSelector(
  selectSession,
  (state) => state.cognitoId !== null,
);

export function createSession() {
  return { type: CREATE_SESSION };
}

export function signIn(data) {
  return { type: SIGN_IN, data };
}

export function signOut() {
  return { type: SIGN_OUT };
}

function* createSessionSaga() {
  try {
    const cognitoId = yield Auth.currentAuthenticatedUser().then((response) => response.id);
    yield put({ type: SET_COGNITO_ID, data: { cognitoId } });
    yield call(fetchUserSaga);
  } catch (e) {
    if (e === 'not authenticated') {
      yield call(signOutSaga);
    } else {
      throw e;
    }
  }
}

function* fetchUserSaga() {
  try {
    const { cognitoId } = yield select(selectSession);

    const userId = yield appsyncApiCall.getUserIdByCognitoId(cognitoId);

    if (!userId) {
      yield put({ type: USER_IS_NEW });
      return;
    }

    let user;
    try {
      user = yield appsyncApiCall.getUser(userId);
    } catch (e) {
      // It's OK if getUser throws something, we handle the indirectly just below
    }

    if (!user) {
      yield put({ type: USER_IS_NEW });
      return;
    }

    yield all([
      put(fetchFriendships()), // HACK: This has to come before setUser because the routing relies on friendships fetch being started before the userId is set
      put(setUser(user)),
      put(listenToMessages(userId)),
      call(updatePushTokenSaga),
    ]);
  } catch (e) {
    // This needs to be checked here because at the moment Amplify
    // does not have a stable method for checking valid sessions.
    if (e.message === 'No credentials') {
      yield call(signOutSaga);
    } else {
      throw e;
    }
  }
}

function* signInSaga(action) {
  try {
    yield Auth.federatedSignIn('facebook', {
      token: action.data.accessToken,
      expires_at: action.data.expiresIn * 1000 + new Date().getTime(),
    });
    yield put({ type: SET_FEDERATED_DATA, data: action.data });
    yield call(createSessionSaga);
  } catch (e) {
    yield put(pushError(e));
  }
}

function* signOutSaga() {
  const { cognitoId } = yield select(selectSession);
  if (cognitoId) { // We can't attempt an AppSync API call otherwise
    yield appsyncApiCall.updateUserPushToken({ pushToken: null });
  }

  yield Auth.signOut();

  yield put({ type: SIGN_OUT_FINISHED });
}

function* updatePushTokenSaga() {
  try {
    const messaging = firebase.messaging();

    const { pushTokenServiceWorkerUsed } = yield select(selectSession);
    if (!pushTokenServiceWorkerUsed) {
      const registration = yield navigator.serviceWorker.ready;
      messaging.useServiceWorker(registration);

      messaging.usePublicVapidKey(config.firebase.vapidKey);

      yield put({ type: MARK_PUSH_TOKEN_SERVICE_WORKER_USED });
    }

    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    // This will prompt the user for permission to show push notifications.
    messaging.getToken()
      .then((pushToken) => {
        if (pushToken) {
          appsyncApiCall.updateUserPushToken({ pushToken });
        } else {
          console.log('No push token available');
        }
      })
      .catch((e) => {
        console.log(`An error occurred while retrieving push token: ${e}`);
      });

    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(() => {
      messaging.getToken()
        .then((pushToken) => {
          appsyncApiCall.updateUserPushToken({ pushToken });
        })
        .catch((e) => {
          console.log(`An error occurred while updating push token: ${e}`);
        });
    });
  } catch (e) {
    // We can just swallow the error because it is most likely about the browser not supporting push notifications
    console.log(`Push token update failed: ${e}`);
    // TODO: Inform the user about push notifications missing
  }
}

export function* sessionSaga() {
  yield takeLatest(CREATE_SESSION, createSessionSaga);
  yield takeLatest(SIGN_IN, signInSaga);
  yield takeLatest(SIGN_OUT, signOutSaga);
}
