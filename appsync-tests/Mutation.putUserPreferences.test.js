import test from 'ava';

import { TEST_USER, TEST_USER_COGNITO_ID, TEST_USER_PREFERENCES } from './constants';
import { createTestUser, deleteTestUser } from './helpers';
import * as appsyncApiCall from '../app/utils/appsync-api-call';

import init from './init';

test.before(async (t) => {
  await init(t);
  t.context.user = await createTestUser(TEST_USER_COGNITO_ID, TEST_USER);
});

test.serial('add user preferences', async () => {
  await appsyncApiCall.putUserPreferences(TEST_USER_PREFERENCES);

  // TODO: Check the result of putUserPreferences
});

test.serial('verify added user preferences', async (t) => {
  const user = await appsyncApiCall.getUser(t.context.user.id);

  t.truthy(user);

  t.deepEqual(user.preferences, TEST_USER_PREFERENCES);
});

test.serial('remove user preferences', async () => {
  await appsyncApiCall.putUserPreferences({});

  // TODO: Check the result of putUserPreferences
});

test.serial('verify removed user preferences', async (t) => {
  const user = await appsyncApiCall.getUser(t.context.user.id);

  t.truthy(user);

  t.deepEqual(user.preferences, { gender: [] });
});

test.after.always(async (t) => {
  await deleteTestUser(t.context.user);
});
