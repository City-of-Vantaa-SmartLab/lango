import test from 'ava';

import {
  TEST_USER,
  TEST_USER_COGNITO_ID,
  TEST_USER_2,
  TEST_USER_2_COGNITO_ID,
  TEST_USER_3,
  TEST_USER_3_COGNITO_ID,
} from './constants';

import { createTestUser, deleteTestUser } from './helpers';
import init from './init';
import * as appsyncApiCall from '../app/utils/appsync-api-call';

test.before(async (t) => {
  await init(t);
  t.context.userA = await createTestUser(TEST_USER_COGNITO_ID, TEST_USER);
  t.context.userB = await createTestUser(TEST_USER_2_COGNITO_ID, TEST_USER_2);
  t.context.userC = await createTestUser(TEST_USER_3_COGNITO_ID, TEST_USER_3);
});

test.serial('userB should have no friendships', async (t) => {
  const user = await appsyncApiCall.getUser(t.context.userB.id);

  t.is(user.friendships.length, 0);
});

test.serial('create first requested friendship', async (t) => {
  const friendship = await appsyncApiCall.requestFriendship({ otherUserId: t.context.userB.id });

  t.truthy(friendship.id);
});

test.serial('userB should have one requested friendship', async (t) => {
  const user = await appsyncApiCall.getUser(t.context.userB.id);

  t.is(user.friendships.length, 1);
});

test.serial('create second requested friendship', async (t) => {
  const friendship = await appsyncApiCall.requestFriendship({ otherUserId: t.context.userC.id });

  t.truthy(friendship.id);
});

test.serial('userB should have two requested friendships', async (t) => {
  const user = await appsyncApiCall.getUser(t.context.userB.id);

  t.is(user.friendships.length, 2);
});

test.serial('cannot create duplicate friendship', async (t) => {
  const friendship = await appsyncApiCall.requestFriendship({ otherUserId: t.context.userC.id });

  t.deepEqual(friendship, null);
});

test.serial('userB should still have two friendships', async (t) => {
  const user = await appsyncApiCall.getUser(t.context.userB.id);

  t.is(user.friendships.length, 2);
});

test.after.always(async (t) => {
  await deleteTestUser(t.context.userA);
  await deleteTestUser(t.context.userB);
  await deleteTestUser(t.context.userC);
});
