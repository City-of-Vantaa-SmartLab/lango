import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectFriendshipsWithUnreadMessages, selectUnseenFriendRequests } from 'store/friendships';
import { MainNavigation } from 'components/Navigation';

function DefaultNavigation(props) {
  return (
    <MainNavigation
      friendshipsWithUnreadMessages={props.friendshipsWithUnreadMessages}
      unseenFriendRequests={props.unseenFriendRequests}
    />
  );
}

DefaultNavigation.propTypes = {
  friendshipsWithUnreadMessages: PropTypes.array.isRequired,
  unseenFriendRequests: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  friendshipsWithUnreadMessages: selectFriendshipsWithUnreadMessages,
  unseenFriendRequests: selectUnseenFriendRequests,
});

export default connect(mapStateToProps)(DefaultNavigation);
