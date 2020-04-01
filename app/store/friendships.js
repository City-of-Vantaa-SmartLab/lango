import { createSelector } from 'reselect';
import { put, select, take, takeLatest } from 'redux-saga/effects';
import { channel } from 'redux-saga';

import { pushError } from 'store/errors';
import { removeUserRecommendation } from 'store/user-recommendations';
import { selectUserId } from 'store/user'; // eslint-disable-line import/no-cycle
import * as appsyncApiCall from 'utils/appsync-api-call';

const ACCEPT = 'Lango/friendships/ACCEPT';
const CANCEL = 'Lango/friendships/CANCEL';
const FETCH_ALL = 'Lango/friendships/FETCH_ALL';
const LISTEN_TO_MESSAGES = 'Lango/friendships/LISTEN_TO_MESSAGES';
const MARK_MESSAGE_DELIVERED = 'Lango/friendships/MARK_MESSAGE_DELIVERED';
const REJECT = 'Lango/friendships/REJECT';
const REQUEST = 'Lango/friendships/REQUEST';
const SAVE_MESSAGE = 'Lango/friendships/SAVE_MESSAGE';
const SEND_MESSAGE = 'Lango/friendships/SEND_MESSAGE';
const SET_ALL = 'Lango/friendships/SET_ALL';
const SET_ONE = 'Lango/friendships/SET_ONE';
const UPDATE_USER_LAST_SEEN = 'Lango/friendships/UPDATE_USER_LAST_SEEN';

const initialState = {
  isLoading: false,
  items: [],
};

export default function friendshipsReducer(state = initialState, action) {
  switch (action.type) {
    case CANCEL:
      return {
        ...state,
        items: state.items.filter(
          (friendship) => friendship.id !== action.data.id
        ),
      };

    case FETCH_ALL:
      return {
        ...state,
        isLoading: true,
      };

    case MARK_MESSAGE_DELIVERED:
      return {
        ...state,
        items: state.items.map(
          (friendship) => (
            friendship.id !== action.data.message.friendshipId
              ? friendship
              : {
                ...friendship,
                messages: friendship.messages.map(
                  (message) => (
                    message.temporaryId !== action.data.message.temporaryId
                      ? message
                      : { ...message, pending: false }
                  ),
                ),
              }
          ),
        ),
      };

    case SET_ALL:
      return {
        ...state,
        isLoading: false,
        items: action.data,
      };

    case SET_ONE:
      return {
        ...state,
        items: state.items.map(
          (friendship) => (
            friendship.id !== action.data.id
              ? friendship
              : { ...friendship, ...action.data }
          )
        ),
      };

    case SAVE_MESSAGE:
      return {
        ...state,
        items: state.items.map(
          (friendship) => (
            friendship.id !== action.data.message.friendshipId
              ? friendship
              : {
                ...friendship,
                messages: [...(friendship.messages || []), action.data.message],
              }
          )
        ),
      };

    default:
      return state;
  }
}

const selectFriendships = (rootState) => rootState.friendships.items;

export const selectAreFriendshipsLoading = (rootState) => rootState.friendships.isLoading;

export const selectFriendshipsById = createSelector(
  selectFriendships,
  (friendships) => friendships
    .reduce(
      (friendshipsById, friendship) => {
        friendshipsById[friendship.id] = friendship;
        return friendshipsById;
      },
      {},
    ),
);

export const selectAcceptedFriendships = createSelector(
  selectFriendships,
  (friendships) => friendships
    .filter((friendship) => friendship.status === 'accepted')
    .map(
      (friendship) => {
        const lastMessage = friendship.messages && friendship.messages.length > 0
          ? friendship.messages.slice(-1)[0].content.replace(/(?:\r\n|\r|\n)/g, ' ')
          : null;

        return { ...friendship, lastMessage };
      }
    ),
);

export const selectCancellableFriendRequests = createSelector(
  selectFriendships,
  selectUserId,
  (friendships, userId) => friendships
    .filter((friendship) => friendship.status === 'requested'
      && friendship.initiatorUserId === userId),
);

export const selectFriendshipsWithUnreadMessages = createSelector(
  selectFriendships,
  selectUserId,
  (friendships, userId) => friendships
    .filter((friendship) => {
      const myLastSeen = friendship.initiatorUserId === userId
        ? friendship.initiatorUserLastSeen
        : friendship.otherUserLastSeen;
      return (friendship.messages || []).some((message) => message.sentDate >= myLastSeen);
    }),
);

export const selectReactableFriendRequests = createSelector(
  selectFriendships,
  selectUserId,
  (friendships, userId) => friendships
    .filter((friendship) => friendship.status === 'requested'
      && friendship.initiatorUserId !== userId),
);

export const selectUnseenFriendRequests = createSelector(
  selectFriendships,
  selectUserId,
  (friendships, userId) => friendships
    .filter((friendship) => {
      const userIsInitiator = friendship.initiatorUserId === userId;
      const [userLastSeen, friendLastSeen] = userIsInitiator
        ? [friendship.initiatorUserLastSeen, friendship.otherUserLastSeen]
        : [friendship.otherUserLastSeen, friendship.initiatorUserLastSeen];
      return !userIsInitiator && friendship.status === 'requested' && userLastSeen <= friendLastSeen;
    }),
);

export function acceptFriendship(id) {
  return { type: ACCEPT, data: { id } };
}

export function cancelFriendship(id) {
  return { type: CANCEL, data: { id } };
}

export function fetchFriendships() {
  return { type: FETCH_ALL };
}

export function listenToMessages(userId) {
  return { type: LISTEN_TO_MESSAGES, data: { userId } };
}

export function rejectFriendship(id) {
  return { type: REJECT, data: { id } };
}

export function requestFriendship(id) {
  return { type: REQUEST, data: { id } };
}

export function sendMessage(message) {
  return { type: SEND_MESSAGE, data: { message } };
}

export function updateUserLastSeenInFriendship(friendshipId) {
  return { type: UPDATE_USER_LAST_SEEN, data: { friendshipId } };
}

function* acceptSaga(action) {
  try {
    const acceptedFriendship = yield appsyncApiCall.acceptRequestedFriendship({ id: action.data.id });
    yield put({ type: SET_ONE, data: acceptedFriendship });
  } catch (e) {
    yield put(pushError(e));
  }
}

function* cancelSaga(action) {
  try {
    yield appsyncApiCall.cancelRequestedFriendship({ id: action.data.id });
  } catch (e) {
    yield put(pushError(e));
  }
}

function* fetchAllSaga() {
  try {
    const friendships = yield appsyncApiCall.fetchFriendships();
    yield put({ type: SET_ALL, data: friendships });
  } catch (e) {
    yield put(pushError(e));
  }
}

function* listenToMessagesSaga(action) {
  const newMessageChannel = yield channel();

  const subscribe = () => {
    appsyncApiCall.subscribeToNewMessagesByUser({ receiverUserId: action.data.userId })
      .subscribe({
        next: (payload) => {
          const message = payload.value.data.subscribeToNewMessageByUser;
          newMessageChannel.put(message);
        },
        error: (e) => {
          console.debug('Message subscription died, resubscribing... Reason:', e);
          newMessageChannel.put({ error: true });
        },
      });
  };

  subscribe();

  while (true) {
    const message = yield take(newMessageChannel);

    if ('error' in message) {
      setTimeout(subscribe, 5000); // Not right away because if the connection is down we get a busy loop
    } else {
      yield put({ type: SAVE_MESSAGE, data: { message } });
    }
  }
}

function* rejectSaga(action) {
  try {
    const rejectedFriendship = yield appsyncApiCall.rejectFriendship({ id: action.data.id });
    yield put({ type: SET_ONE, data: rejectedFriendship });
  } catch (e) {
    yield put(pushError(e));
  }
}

function* requestSaga(action) {
  try {
    const requestedFriendship = yield appsyncApiCall.requestFriendship({ otherUserId: action.data.id });
    yield put({ type: SET_ONE, data: requestedFriendship });
    yield put(removeUserRecommendation(action.data.id));
  } catch (e) {
    yield put(pushError(e));
  }
}

function* sendMessageSaga(action) {
  try {
    const senderUserId = yield select(selectUserId);

    const message = {
      content: action.data.message.content,
      friendshipId: action.data.message.id,
      temporaryId: new Date().getTime(), // This is only for local use
      receiverUserId: action.data.message.receiverUserId,
      senderUserId,
    };

    yield put({
      type: SAVE_MESSAGE,
      data: { message: { ...message, pending: true } },
    });

    yield appsyncApiCall.sendMessage(message);

    // Sending the message causes listenToMessagesSaga to catch and persist it
    // once it's confirmed by the backend, and that's when the `pending`
    // property set above gets dropped altogether
    yield put({
      type: MARK_MESSAGE_DELIVERED,
      data: { message },
    });
  } catch (e) {
    yield put(pushError(e));
  }
}

function* updateUserLastSeenSaga(action) {
  try {
    const updatedFriendship = yield appsyncApiCall.updateUserLastSeenInFriendship({
      friendshipId: action.data.friendshipId,
    });
    yield put({ type: SET_ONE, data: updatedFriendship });
  } catch (e) {
    yield put(pushError(e));
  }
}

export function* friendshipsSaga() {
  yield takeLatest(ACCEPT, acceptSaga);
  yield takeLatest(CANCEL, cancelSaga);
  yield takeLatest(FETCH_ALL, fetchAllSaga);
  yield takeLatest(LISTEN_TO_MESSAGES, listenToMessagesSaga);
  yield takeLatest(REJECT, rejectSaga);
  yield takeLatest(REQUEST, requestSaga);
  yield takeLatest(SEND_MESSAGE, sendMessageSaga);
  yield takeLatest(UPDATE_USER_LAST_SEEN, updateUserLastSeenSaga);
}
