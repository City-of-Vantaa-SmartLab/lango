const REGION = 'eu-central-1';

export const config = {
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: REGION,
    aws_mandatory_sign_in: true,
  },
  API: {
    aws_appsync_graphqlEndpoint: process.env.GRAPHQL_ENDPOINT,
    aws_appsync_region: REGION,
    graphql_endpoint_iam_region: REGION,
    aws_appsync_authenticationType: 'AWS_IAM',
  },
  federated: {
    facebook_app_id: process.env.FACEBOOK_APP_ID,
  },
  firebase: {
    vapidKey: process.env.FIREBASE_VAPID_KEY,
  },
  Storage: {
    bucket: process.env.STORAGE_BUCKET,
    region: REGION,
    identityPoolId: process.env.IDENTITY_POOL_ID,
  },
};
