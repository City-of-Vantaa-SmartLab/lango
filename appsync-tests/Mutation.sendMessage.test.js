import test from 'ava';

import { TEST_USER, TEST_USER_COGNITO_ID, TEST_USER_2, TEST_USER_2_COGNITO_ID } from './constants';
import { createTestFriendship, createTestUser, deleteTestUser } from './helpers';
import * as appsyncApiCall from '../app/utils/appsync-api-call';

import init from './init';

const A_MESSAGE_CONTENT = 'this is a message from user A to user B';
const B_MESSAGE_CONTENT = 'this is a message from user B to user A';

test.before(async (t) => {
  await init(t);
  t.context.userA = await createTestUser(TEST_USER_COGNITO_ID, TEST_USER);
  t.context.userB = await createTestUser(TEST_USER_2_COGNITO_ID, TEST_USER_2);
  t.context.friendshipId = await createTestFriendship(t.context.userA.id);
});

test.serial('send messages', async (t) => {
  const messageA = await appsyncApiCall.sendMessage({
    friendshipId: t.context.friendshipId,
    content: A_MESSAGE_CONTENT,
    senderUserId: t.context.userA.id,
    receiverUserId: t.context.userB.id,
  });

  t.truthy(messageA.id);
  t.context.messageAId = messageA.id;

  const messageB = await appsyncApiCall.sendMessage({
    friendshipId: t.context.friendshipId,
    content: B_MESSAGE_CONTENT,
    senderUserId: t.context.userA.id,
    receiverUserId: t.context.userB.id,
  });

  t.truthy(messageB.id);
});

test.serial('verify friendship', async (t) => {
  const friendship = await appsyncApiCall.getFriendship(t.context.friendshipId);

  t.assert(Array.isArray(friendship.messages));
  t.assert(friendship.messages.length === 2);
  t.assert(friendship.messages.some((m) => m.content === A_MESSAGE_CONTENT));
  t.assert(friendship.messages.some((m) => m.content === B_MESSAGE_CONTENT));
});

test.after.always(async (t) => {
  await deleteTestUser(t.context.userA);
  await deleteTestUser(t.context.userB);
  // Friendships cannot be deleted, that's why there's no delete here
});
