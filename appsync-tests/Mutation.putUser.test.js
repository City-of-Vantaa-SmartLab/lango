import test from 'ava';

import { TEST_USER, TEST_USER_COGNITO_ID } from './constants';
import * as appsyncApiCall from '../app/utils/appsync-api-call';

import init from './init';

test.before(init);

let user;

test.serial('create Cognito ID mapping', async (t) => {
  const { userId } = await appsyncApiCall.createCognitoIdToUserIdMapping({ cognitoId: TEST_USER_COGNITO_ID });

  t.truthy(userId);

  user = { ...TEST_USER, id: userId };
});

test.serial('create user', async () => {
  await appsyncApiCall.putUser({
    id: user.id,
    firstName: user.firstName,
    email: user.email,
    description: user.description,
    gender: user.gender,
    location: user.location,
  });

  // TODO: Check the result of putUser
});

test.serial('verify user', async (t) => {
  const gottenUser = await appsyncApiCall.getUser(user.id);

  t.truthy(gottenUser);

  t.is(gottenUser.description, TEST_USER.description);
  t.is(gottenUser.email, TEST_USER.email);
  t.is(gottenUser.firstName, TEST_USER.firstName);
  t.is(gottenUser.gender, TEST_USER.gender);
  t.is(gottenUser.location, TEST_USER.location);
});

test.serial('delete user', async () => {
  await appsyncApiCall.deleteUser({ id: user.id });

  // TODO: Check the result of deleteUser
});
