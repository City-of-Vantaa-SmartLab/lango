import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { colors } from 'styles';
import { AcceptIcon, DeclineIcon } from 'components/icons';

const Button = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  color: ${colors.light};
  flex: 0 0 4rem;
  height: 4rem;
  border-radius: 50%;
  padding: 1rem;
  cursor: pointer;

  &:not(:first-child) {
    margin-left: 0.5rem;
  }
`;

const Accept = styled(Button)`
  background-color: ${colors.success};
`;

const Reject = styled(Button)`
  background-color: ${colors.lightgrey};

  &:hover, &:active {
    background-color: ${colors.danger};
  }
`;


function createAcceptButton(friendship, acceptFriendship) {
  if (!acceptFriendship) {
    return null;
  }

  return (
    <Accept onClick={() => acceptFriendship(friendship.id)}>
      <AcceptIcon />
    </Accept>
  );
}

function createDeclineButton(friendship, cancelFriendship, rejectFriendship, history) {
  if (cancelFriendship) {
    const handleCancelFriendship = () => {
      const question = 'Haluatko varmasti perua yhteyspyynnön?';
      if (window.confirm(question)) {
        cancelFriendship(friendship.id);
        history.replace('/friendships');
      }
    };
    return (
      <Reject onClick={handleCancelFriendship}>
        <DeclineIcon />
      </Reject>
    );
  }

  if (rejectFriendship) {
    const handleRejectFriendship = () => {
      const question = `Haluatko varmasti hylätä käyttäjän ${friendship.friend.firstName}?`;
      if (window.confirm(question)) {
        rejectFriendship(friendship.id);
        history.replace('/friendships');
      }
    };
    return (
      <Reject onClick={handleRejectFriendship}>
        <DeclineIcon />
      </Reject>
    );
  }

  return null;
}

function FriendshipButtons({ friendship, acceptFriendship, cancelFriendship, rejectFriendship }) {
  const history = useHistory();

  return (
    <>
      {createAcceptButton(friendship, acceptFriendship)}
      {createDeclineButton(friendship, cancelFriendship, rejectFriendship, history)}
    </>
  );
}

FriendshipButtons.propTypes = {
  acceptFriendship: PropTypes.func,
  cancelFriendship: PropTypes.func,
  friendship: PropTypes.object.isRequired,
  rejectFriendship: PropTypes.func,
};

FriendshipButtons.defaultProps = {
  acceptFriendship: null,
  cancelFriendship: null,
  rejectFriendship: null,
};

export default FriendshipButtons;
