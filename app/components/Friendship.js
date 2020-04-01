import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { colors } from 'styles';
import ProfilePicture from 'components/profile/ProfilePicture';
import FriendshipButtons from 'components/FriendshipButtons';
import { selectFriendshipsWithUnreadMessages, selectUnseenFriendRequests } from 'store/friendships';
import RedDot from 'components/icons/RedDot';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.3rem;
`;

const FriendshipLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  color: ${colors.dark};
  text-decoration: none;
  width: 100%;
  min-width: 0;
`;

const NameAndStatus = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  min-width: 0;
`;

const Name = styled.span`
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const Status = styled.span`
  font-style: italic;
  font-size: 0.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const OverlappingRedDot = styled(RedDot)`
  margin-left: -15px;
  position: absolute;
`;

function createReadableStatus(friendship, cancelFriendship) {
  if (friendship.status === 'accepted') {
    return friendship.lastMessage;
  }
  if (friendship.status === 'requested') {
    if (cancelFriendship) {
      return 'Ei ole vielä vastannut pyyntöösi';
    }
    return 'Odottaa vastaustasi!';
  }

  return null;
}

function Friendship({
  friendship,
  friendshipsWithUnreadMessages,
  acceptFriendship,
  cancelFriendship,
  rejectFriendship,
  unseenFriendRequests,
}) {
  const url = friendship.status === 'accepted'
    ? `friendships/${friendship.id}/chat`
    : `friendships/${friendship.id}`;

  const readableStatus = createReadableStatus(friendship, cancelFriendship);

  const showRedDot = friendshipsWithUnreadMessages.some(({ id }) => friendship.id === id)
    || unseenFriendRequests.some(({ id }) => friendship.id === id);

  return (
    <Container>
      <FriendshipLink to={url}>
        <div>
          <ProfilePicture small cognitoId={friendship.friend.cognitoId} />
          <OverlappingRedDot show={showRedDot} />
        </div>

        <NameAndStatus>
          <Name>{friendship.friend.firstName}</Name>
          {readableStatus && <Status>{readableStatus}</Status>}
        </NameAndStatus>
      </FriendshipLink>

      <FriendshipButtons
        friendship={friendship}
        acceptFriendship={acceptFriendship}
        cancelFriendship={cancelFriendship}
        rejectFriendship={rejectFriendship}
      />
    </Container>
  );
}

Friendship.propTypes = {
  acceptFriendship: PropTypes.func,
  cancelFriendship: PropTypes.func,
  friendship: PropTypes.object.isRequired,
  friendshipsWithUnreadMessages: PropTypes.array.isRequired,
  rejectFriendship: PropTypes.func,
  unseenFriendRequests: PropTypes.array.isRequired,
};

Friendship.defaultProps = {
  acceptFriendship: null,
  cancelFriendship: null,
  rejectFriendship: null,
};

const mapStateToProps = createStructuredSelector({
  friendshipsWithUnreadMessages: selectFriendshipsWithUnreadMessages,
  unseenFriendRequests: selectUnseenFriendRequests,
});

export default connect(mapStateToProps)(Friendship);
