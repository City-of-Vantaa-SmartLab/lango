import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { pushError } from 'store/errors';
import * as appsyncApiCall from 'utils/appsync-api-call';

const BROWSE_LEFT = 'Lango/userRecommendations/BROWSE_LEFT';
const BROWSE_RIGHT = 'Lango/userRecommendations/BROWSE_RIGHT';
const FETCH = 'Lango/userRecommendations/FETCH';
const REMOVE = 'Lango/userRecommendations/REMOVE';
const SET = 'Lango/userRecommendations/SET';

const initialState = {
  currentIndex: 0,
  isLoading: false,
  items: [],
};

export default function userRecommendationsReducer(state = initialState, action) {
  switch (action.type) {
    case BROWSE_LEFT:
      if (state.currentIndex <= 0) {
        return state;
      }
      return {
        ...state,
        currentIndex: state.currentIndex - 1,
      };

    case BROWSE_RIGHT:
      if (state.currentIndex >= state.items.length - 1) {
        return state;
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
      };

    case FETCH:
      return {
        ...state,
        isLoading: true,
      };

    case REMOVE: {
      return {
        ...state,
        currentIndex: state.currentIndex + 1 === state.items.length
          ? state.currentIndex - 1
          : state.currentIndex + 1,
        items: state.items.filter((user) => user.id !== action.id),
      };
    }

    case SET:
      return {
        ...state,
        isLoading: false,
        items: action.userRecommendations,
        currentIndex: 0,
      };

    default:
      return state;
  }
}

const selectSubstate = (rootState) => rootState.userRecommendations;

export const selectCurrentUserRecommendation = createSelector(
  selectSubstate,
  (substate) => substate.items[substate.currentIndex],
);

export const selectIsLoadingUserRecommendations = createSelector(
  selectSubstate,
  (substate) => substate.isLoading,
);

export function browseUserRecommendationsLeft() {
  return { type: BROWSE_LEFT };
}

export function browseUserRecommendationsRight() {
  return { type: BROWSE_RIGHT };
}

export function fetchUserRecommendations() {
  return { type: FETCH };
}

export function removeUserRecommendation(id) {
  return { type: REMOVE, id };
}

function* fetchSaga() {
  try {
    const userRecommendations = yield appsyncApiCall.getUserRecommendations();
    yield put({ type: SET, userRecommendations });
  } catch (e) {
    yield put(pushError(e));
  }
}

export function* userRecommendationsSaga() {
  yield takeLatest(FETCH, fetchSaga);
}
