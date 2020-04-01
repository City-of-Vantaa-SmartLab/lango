import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Friendship from 'components/Friendship';

const ListUl = styled.ul`
  padding: 0;
  list-style: none;
  width: 100%;
`;

function FriendshipList({ friendships, acceptFriendship, cancelFriendship, rejectFriendship }) {
  if (friendships.length === 0) {
    return null;
  }

  return (
    <ListUl>
      {
        friendships.map((friendship) => (
          <Friendship
            key={friendship.id}
            friendship={friendship}
            acceptFriendship={acceptFriendship}
            cancelFriendship={cancelFriendship}
            rejectFriendship={rejectFriendship}
          />
        ))
      }
    </ListUl>
  );
}

FriendshipList.propTypes = {
  acceptFriendship: PropTypes.func,
  cancelFriendship: PropTypes.func,
  friendships: PropTypes.array.isRequired,
  rejectFriendship: PropTypes.func,
};

FriendshipList.defaultProps = {
  acceptFriendship: null,
  cancelFriendship: null,
  rejectFriendship: null,
};

export default FriendshipList;
