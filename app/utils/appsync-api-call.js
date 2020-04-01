/**
 * This is a collection of abstracted GraphQL API calls.
 * The goal of the abstraction is to provide a more consistent way of calling
 * the API, lessen the chance of bugs and take care of handling errors.
 *
 * There is a convention in how the variables for the calls are provided:
 * - Query functions have zero or more primitive parameters.
 * - Mutation functions have a single object parameter that should contain all
 *   the variables.
 * - Subscription functions alike mutations
 * This is because mutations and subscriptions usually need several possibly
 * optional variables that became unwieldy to pass as arguments. Queries do not
 * have this problem.
 */
import { API, graphqlOperation } from 'aws-amplify';

import formatDateLikePostgres from 'utils/format-date-like-postgres';

// The GraphQL extension for VSCode wants to see tagged template strings, so here we go
const gql = (x) => x.join('');

async function call(operationName, variables, graphql) {
  try {
    const response = await API.graphql(graphqlOperation(graphql, variables));

    if ('error' in response) {
      // TODO: Throw an error
      console.error('GraphQL call response errored:', response.error);
      return null;
    }

    const result = response.data[operationName];

    if (result === null) {
      console.debug(`GraphQL call (${operationName} returned null with the variables`, variables);
    }

    return result;
  } catch (e) {
    // TODO: Catch the error in sagas
    console.error('GraphQL call failed:', e);
  }

  return null;
}

export async function acceptRequestedFriendship(variables) {
  return call('acceptRequestedFriendship', variables, gql`
    mutation acceptRequestedFriendship($id: ID!) {
      acceptRequestedFriendship(id: $id) {
        id
        initiatorUserId
        otherUserId
        initiatorUserLastSeen
        otherUserLastSeen
        status
        friend {
          cognitoId
          description
          firstName
          gender
          id
          learning
          location
          spoken
        }
      }
    }
  `);
}

export async function cancelRequestedFriendship(variables) {
  return call('cancelRequestedFriendship', variables, gql`
    mutation cancelRequestedFriendship($id: ID!) {
      cancelRequestedFriendship(id: $id) {
        id
        initiatorUserId
        otherUserId
        initiatorUserLastSeen
        otherUserLastSeen
        status
        friend {
          cognitoId
          description
          firstName
          gender
          id
          learning
          location
          spoken
        }
      }
    }
  `);
}

export async function createCognitoIdToUserIdMapping(variables) {
  return call('createCognitoIdToUserIdMapping', variables, gql`
    mutation createCognitoIdToUserIdMapping($cognitoId: String!) {
      createCognitoIdToUserIdMapping(cognitoId: $cognitoId) {
        userId
      }
    }
  `);
}

export async function deleteUser(variables) {
  return call('deleteUser', variables, gql`
    mutation deleteuser($id: ID!) {
      deleteUser(id: $id)
    }
  `);
}

export async function fetchFriendships() {
  return call('fetchFriendships', null, gql`
    query fetchFriendships {
      fetchFriendships {
        id
        initiatorUserId
        otherUserId
        initiatorUserLastSeen
        otherUserLastSeen
        status
        friend {
          cognitoId
          description
          firstName
          gender
          id
          learning
          location
          spoken
        }
        messages {
          id
          content
          senderUserId
          receiverUserId
          sentDate
        }
      }
    }
  `);
}

export function getFriendshipRaw(id) {
  const graphql = gql`
    query getFriendship($id: ID!) {
      getFriendship(id: $id) {
        messages {
          id
          content
          senderUserId
          receiverUserId
          sentDate
        }
      }
    }
  `;
  return graphqlOperation(graphql, { id });
}

export async function getFriendship(id) {
  const response = await API.graphql(getFriendshipRaw(id));
  return response.data.getFriendship;
}

export async function getUser(id) {
  return call('getUser', { id }, gql`
    query getUser($id: ID!) {
      getUser(id: $id) {
        cognitoId
        description
        email
        firstName
        gender
        id
        isAdmin
        isHidden
        learning
        location
        spoken
        preferences {
          gender
        }
      }
    }
  `);
}

export async function getUsers() {
  return call('getUsers', null, gql`
    query getUsers {
      getUsers {
        cognitoId
        description
        firstName
        gender
        id
        learning
        location
        spoken
      }
    }
  `);
}

export async function getUserIdByCognitoId(cognitoId) {
  return call('getUserIdByCognitoId', { cognitoId }, gql`
    query getUserIdByCognitoId($cognitoId: String!) {
      getUserIdByCognitoId(cognitoId: $cognitoId)
    }
  `);
}

export async function getUserRecommendations() {
  return call('getUserRecommendations', null, gql`
    query getUserRecommendations {
      getUserRecommendations {
        cognitoId
        description
        firstName
        gender
        id
        learning
        location
        spoken
      }
    }
  `);
}

export async function putUser(variables) {
  return call('putUser', variables, gql`
    mutation putUser(
      $id: ID!
      $firstName: String
      $email: AWSEmail
      $gender: String
      $description: String
      $location: String
      $isHidden: Boolean
    ) {
      putUser(
        id: $id
        firstName: $firstName
        email: $email
        gender: $gender
        description: $description
        location: $location
        isHidden: $isHidden
      )
    }
  `);
}

export async function putUserLanguages(variables) {
  return call('putUserLanguages', variables, gql`
    mutation putUserLanguages($learning: [String!], $spoken: [String!]) {
      putUserLanguages(learning: $learning, spoken: $spoken)
    }
  `);
}

export async function putUserPreferences(variables) {
  return call('putUserPreferences', variables, gql`
    mutation putUserPreferences($gender: [String!]) {
      putUserPreferences(gender: $gender)
    }
  `);
}

export async function rejectFriendship(variables) {
  return call('rejectFriendship', variables, gql`
    mutation rejectFriendship($id: ID!) {
      rejectFriendship(id: $id) {
        id
        initiatorUserId
        otherUserId
        initiatorUserLastSeen
        otherUserLastSeen
        status
        friend {
          cognitoId
          description
          firstName
          gender
          id
          learning
          location
          spoken
        }
      }
    }
  `);
}

export async function requestFriendship(variables) {
  return call('requestFriendship', variables, gql`
    mutation requestFriendship($otherUserId: ID!) {
      requestFriendship(otherUserId: $otherUserId) {
        id
        initiatorUserId
        otherUserId
        initiatorUserLastSeen
        otherUserLastSeen
        status
        friend {
          cognitoId
          description
          firstName
          gender
          id
          learning
          location
          spoken
        }
      }
    }
  `);
}

export async function sendMessage(variables) {
  // The real sentDate that gets saved in the database is generated by Postgres.
  // This date here is just to make the message subscriptions (that don't
  // involve data sources/databases at all) get some kind of a sent date so
  // that they can work with it.
  const sentDate = formatDateLikePostgres(new Date());

  variables = { ...variables, sentDate };
  return call('sendMessage', variables, gql`
    mutation sendMessage(
      $content: String!
      $senderUserId: ID!
      $friendshipId: ID!
      $receiverUserId: ID!
      $sentDate: String!
    ) {
      sendMessage(
        content: $content
        senderUserId: $senderUserId
        friendshipId: $friendshipId
        receiverUserId: $receiverUserId
        sentDate: $sentDate
      ) {
        content
        friendshipId
        id
        receiverUserId
        senderUserId
        sentDate
      }
    }
  `);
}

export function subscribeToNewMessagesByUser(variables) {
  const graphql = gql`
    subscription subscribeToNewMessagesByUser($receiverUserId: ID!) {
      subscribeToNewMessageByUser(receiverUserId: $receiverUserId) {
        content
        friendshipId
        id
        receiverUserId
        senderUserId
        sentDate
      }
    }
  `;
  return API.graphql(graphqlOperation(graphql, variables));
}

export async function updateUserLastSeenInFriendship(variables) {
  return call('updateUserLastSeenInFriendship', variables, gql`
    mutation updateUserLastSeenInFriendship($friendshipId: ID!) {
      updateUserLastSeenInFriendship(friendshipId: $friendshipId) {
        id
        initiatorUserId
        otherUserId
        initiatorUserLastSeen
        otherUserLastSeen
        status
        friend {
          cognitoId
          description
          firstName
          gender
          id
          learning
          location
          spoken
        }
      }
    }
  `);
}

export async function updateUserPushToken(variables) {
  return call('updateUserPushToken', variables, gql`
    mutation updateUserPushToken($pushToken: String) {
      updateUserPushToken(pushToken: $pushToken)
    }
  `);
}
