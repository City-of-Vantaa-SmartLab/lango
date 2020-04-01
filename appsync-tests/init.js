/**
 * Prepare Amplify for GraphQL calls used in tests
 *
 * AWS does this thing where it looks for your `$HOME/.aws` directory and tries
 * to fetch credentials from there. If you let it happen, the whole Facebook
 * login flow below will not affect what gets sent to AppSync whenever you make
 * a GraphQL call in your tests -- instead, your personal AWS credentials will
 * be used. To prevent this, the package.json script that runs the tests has to
 * have `AWS_PROFILE=nonexistent-profile` prepended to it.
 */

import Amplify, { Auth } from 'aws-amplify';
import { config } from '../app/utils/login-configuration';

function fetchUserCognitoData() {
  if (process.env.TEST_SKIP_FB_LOGIN) {
    return Promise.resolve(null);
  }

  const accessToken = process.env.TEST_FB_ACCESS_TOKEN;
  const expiresAt = process.env.TEST_FB_EXPIRES_AT;

  if (!accessToken || !expiresAt) {
    console.error('You need to provide a Facebook access token and expiration time to run tests. Do that by running this same command and prefixing it `TEST_FB_ACCESS_TOKEN=[access-token] TEST_FB_EXPIRES_AT=[expiration-time] `');
    process.exit(1);
  }

  return Auth.federatedSignIn('facebook', { token: accessToken, expires_at: expiresAt })
    .catch(null);
}

if (!config.API.aws_appsync_graphqlEndpoint.includes('ivmpinzy6na7vbk')) {
  console.error('Tests don\'t seem to be made in the dev environment, stopping!');
  process.exit(1);
}

Amplify.configure(config);

let userCognitoId = null;
export default async function (t) {
  if (!userCognitoId) {
    const userCognitoResponse = await fetchUserCognitoData();
    if (userCognitoResponse && 'data' in userCognitoResponse && 'IdentityId' in userCognitoResponse.data) {
      userCognitoId = userCognitoResponse.data.IdentityId;
    }
  }

  t.context.userCognitoId = userCognitoId; // eslint-disable-line
}
