import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { spawn } from 'redux-saga/effects';

import adminReducer, { adminSaga } from 'store/admin';
import errorsReducer from 'store/errors';
import friendshipsReducer, { friendshipsSaga } from 'store/friendships';
import sessionReducer, { sessionSaga, SIGN_OUT_FINISHED } from 'store/session';
import userRecommendationsReducer, { userRecommendationsSaga } from 'store/user-recommendations';
import userReducer, { userSaga } from 'store/user';

const initialState = {};
const sagaMiddleware = createSagaMiddleware();

const appReducer = combineReducers({
  admin: adminReducer,
  errors: errorsReducer,
  friendships: friendshipsReducer,
  session: sessionReducer,
  user: userReducer,
  userRecommendations: userRecommendationsReducer,
});

const rootReducer = (state, action) => {
  // The following will reset the store on sign out which
  // will prevent state bugs on sign in/on after that.
  if (action.type === SIGN_OUT_FINISHED) {
    state = undefined;
  }

  return appReducer(state, action);
};

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

store.runSaga = sagaMiddleware.run;

sagaMiddleware.run(function* rootSaga() {
  yield spawn(adminSaga);
  yield spawn(friendshipsSaga);
  yield spawn(sessionSaga);
  yield spawn(userRecommendationsSaga);
  yield spawn(userSaga);
});

export default store;
