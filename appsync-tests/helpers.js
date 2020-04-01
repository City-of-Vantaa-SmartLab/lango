import * as appsyncApiCall from 'utils/appsync-api-call';

export async function createTestUser(cognitoId, { firstName, email, description, gender, location }) {
  const { userId } = await appsyncApiCall.createCognitoIdToUserIdMapping({ cognitoId });

  const userRes = await appsyncApiCall.putUser({ id: userId, firstName, email, description, gender, location });

  if (userRes.data.putUser !== 1) {
    throw new Error('Mutation.putUser failed, affected line count is not 1');
  }

  return {
    id: userId,
    firstName,
    email,
    description,
    gender,
    location,
  };
}

export async function deleteTestUser(userData) {
  if (!userData) {
    // User has not been created at all
    return;
  }

  await appsyncApiCall.deleteUser({ id: userData.id });
}

export async function createTestFriendship(otherUserId) {
  const friendship = await appsyncApiCall.requestFriendship({ otherUserId });

  if (!friendship) {
    throw new Error('Mutation.putFriendship failed');
  }

  return friendship;
}
