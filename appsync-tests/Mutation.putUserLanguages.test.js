import test from 'ava';

import { TEST_USER, TEST_USER_COGNITO_ID, TEST_USER_LEARNING_LANGUAGES, TEST_USER_SPOKEN_LANGUAGES } from './constants';
import { createTestUser, deleteTestUser } from './helpers';
import * as appsyncApiCall from '../app/utils/appsync-api-call';

import init from './init';

test.before(async (t) => {
  await init(t);
  t.context.user = await createTestUser(TEST_USER_COGNITO_ID, TEST_USER);
});

test.serial('add user languages', async () => {
  await appsyncApiCall.putUserLanguages({
    learning: TEST_USER_SPOKEN_LANGUAGES,
    spoken: TEST_USER_LEARNING_LANGUAGES,
  });

  // TODO: Check the result of putUserLanguages
});

test.serial('verify added user languages', async (t) => {
  const user = await appsyncApiCall.getUser(t.context.user.id);
  t.truthy(user);

  t.deepEqual(user.spoken.sort(), TEST_USER_SPOKEN_LANGUAGES);
  t.deepEqual(user.learning.sort(), TEST_USER_LEARNING_LANGUAGES);
});

test.serial('remove user languages', async () => {
  await appsyncApiCall.putUserLanguages({ learning: [], spoken: [] });

  // TODO: Check the reuslt of putUserLanguages
});

test.serial('verify removed user languages', async (t) => {
  const user = await appsyncApiCall.getUser(t.context.user.id);

  t.truthy(user);

  t.deepEqual(user.spoken, []);
  t.deepEqual(user.learning, []);
});

test.after.always(async (t) => {
  await deleteTestUser(t.context.user);
});
