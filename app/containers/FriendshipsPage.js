import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import { colors } from 'styles';
import {
  acceptFriendship,
  selectAcceptedFriendships,
  cancelFriendship,
  selectCancellableFriendRequests,
  selectFriendshipsWithUnreadMessages,
  selectUnseenFriendRequests,
  selectReactableFriendRequests,
  rejectFriendship,
  updateUserLastSeenInFriendship,
} from 'store/friendships';
import DefaultNavigation from 'containers/DefaultNavigation';
import { CommentIcon, HandshakeIcon } from 'components/icons';
import FriendshipList from 'components/FriendshipList';
import RedDot from 'components/icons/RedDot';
import Info from 'components/Info';

const Tabs = styled.div`
  display: flex;
  font-weight: bold;
`;

const Tab = styled.div`
  cursor: pointer;
  list-style: none;
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0.75rem 0;
  color: ${(props) => (props.selected ? colors.black : colors.grey)};
  border-bottom: ${(props) => (props.selected
    ? `0.25rem solid ${colors.primary}`
    : `0.05rem solid ${colors.grey}`)};

  svg {
    color: ${(props) => (props.selected ? colors.primary : colors.grey)};
  }
`;

const OverlappingRedDot = styled(RedDot)`
  margin-left: -2px;
`;

const MILLISECONDS_UNTIL_FRIEND_REQUEST_RED_DOT_DISAPPEARS = 5000;

function FriendshipsPage(props) {
  const [tab, setTab] = useState(true);

  const hasFriendshipsToRender = props.friendships.length > 0;
  const hasFriendRequestsToRender = props.cancellableFriendRequests.length > 0 || props.reactableFriendRequests.length > 0;

  const friendshipTab = hasFriendshipsToRender
    ? (
      <FriendshipList
        friendships={props.friendships}
        rejectFriendship={props.rejectFriendship}
      />
    )
    : <Info>Sinulla ei ole vielä kielikavereita!</Info>;

  const friendRequestTab = hasFriendRequestsToRender
    ? (
      <>
        <FriendshipList
          friendships={props.reactableFriendRequests}
          acceptFriendship={props.acceptFriendship}
          rejectFriendship={props.rejectFriendship}
        />

        <FriendshipList
          friendships={props.cancellableFriendRequests}
          cancelFriendship={props.cancelFriendship}
        />
      </>
    )
    : <Info>Sinulla ei ole tällä hetkellä yhteyspyyntöjä.</Info>;

  const currentTab = tab
    ? friendshipTab
    : friendRequestTab;

  useEffect(() => {
    if (currentTab === friendRequestTab) {
      props.unseenFriendRequests.forEach((friendship) => {
        setTimeout(() => {
          props.updateUserLastSeenInFriendship(friendship.id);
        }, MILLISECONDS_UNTIL_FRIEND_REQUEST_RED_DOT_DISAPPEARS);
      });
    }
  }, [props.unseenFriendRequests.length, tab]);

  return (
    <>
      <DefaultNavigation />

      <Tabs>
        <Tab selected={tab} onClick={() => setTab(true)}>
          <span><CommentIcon /> Keskustelut</span>
          <OverlappingRedDot show={props.friendshipsWithUnreadMessages.length > 0} />
        </Tab>
        <Tab selected={!tab} onClick={() => setTab(false)}>
          <span><HandshakeIcon /> Yhteyspyynnöt</span>
          <OverlappingRedDot show={props.unseenFriendRequests.length > 0} />
        </Tab>
      </Tabs>

      {currentTab}
    </>
  );
}

FriendshipsPage.propTypes = {
  acceptFriendship: PropTypes.func.isRequired,
  cancelFriendship: PropTypes.func.isRequired,
  cancellableFriendRequests: PropTypes.array.isRequired,
  friendships: PropTypes.array.isRequired,
  friendshipsWithUnreadMessages: PropTypes.array.isRequired,
  reactableFriendRequests: PropTypes.array.isRequired,
  rejectFriendship: PropTypes.func.isRequired,
  unseenFriendRequests: PropTypes.array.isRequired,
  updateUserLastSeenInFriendship: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  cancellableFriendRequests: selectCancellableFriendRequests,
  friendships: selectAcceptedFriendships,
  friendshipsWithUnreadMessages: selectFriendshipsWithUnreadMessages,
  reactableFriendRequests: selectReactableFriendRequests,
  unseenFriendRequests: selectUnseenFriendRequests,
});

const mapDispatchToProps = {
  acceptFriendship,
  cancelFriendship,
  rejectFriendship,
  updateUserLastSeenInFriendship,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendshipsPage);
