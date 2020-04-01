import test from 'ava';

import * as appsyncApiCall from '../app/utils/appsync-api-call';

import init from './init';

test.before(init);

// TODO: Add a recommendable user to the database so that there's at least one thing to recommend

test.serial('get user recommendations', async (t) => {
  const userRecommendations = await appsyncApiCall.getUserRecommendations();

  t.assert(userRecommendations.length >= 1);

  const checkedUser = userRecommendations[0];
  t.truthy(checkedUser);

  t.truthy(checkedUser.description);
  t.truthy(checkedUser.email);
  t.truthy(checkedUser.firstName);
  t.truthy(checkedUser.gender);
  t.truthy(checkedUser.id);
  t.truthy(checkedUser.location);
});
