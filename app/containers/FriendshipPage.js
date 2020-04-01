import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import ProfileCard from 'components/profile/ProfileCard';

import { selectUserId } from 'store/user';
import { acceptFriendship, cancelFriendship, rejectFriendship } from 'store/friendships';
import DefaultNavigation from 'containers/DefaultNavigation';
import FriendshipButtons from 'components/FriendshipButtons';

const ProfileContainer = styled.div`
  padding-bottom: 5rem;
`;

const Footer = styled.div`
  position: fixed;
  bottom : 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  width: 100%;
  padding: 1rem;
`;

function FriendshipPage(props) {
  const { friendship, userId } = props;

  const accept = friendship.status === 'requested' && friendship.otherUserId === userId
    ? props.acceptFriendship
    : null;

  const cancel = friendship.status === 'requested' && friendship.initiatorUserId === userId
    ? props.cancelFriendship
    : null;

  const reject = !cancel
    ? props.rejectFriendship
    : null;

  return (
    <>
      <DefaultNavigation />

      <ProfileContainer>
        <ProfileCard user={friendship.friend} />

        <Footer>
          <FriendshipButtons
            friendship={friendship}
            acceptFriendship={accept}
            cancelFriendship={cancel}
            rejectFriendship={reject}
          />
        </Footer>
      </ProfileContainer>
    </>
  );
}

FriendshipPage.propTypes = {
  acceptFriendship: PropTypes.func.isRequired,
  cancelFriendship: PropTypes.func.isRequired,
  friendship: PropTypes.object.isRequired,
  rejectFriendship: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userId: selectUserId,
});

const mapDispatchToProps = {
  acceptFriendship,
  cancelFriendship,
  rejectFriendship,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendshipPage);
