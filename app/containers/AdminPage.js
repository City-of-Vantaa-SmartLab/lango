import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import DeleteProfile from 'components/DeleteProfile';
import { deleteUser, fetchUsers, selectUsers } from 'store/admin';
import ProfileCard from 'components/profile/ProfileCard';
import { colors, boxShadow } from 'styles';
import CenteredSpinner from 'components/icons/CenteredSpinner';
import { NavigationWithBackButton } from 'components/Navigation';

const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem 0;
`;

const Button = styled.button`
  ${boxShadow}
  height: 60px;
  border: 2px solid ${colors.grey};
  border-radius: 8px;
  background-color: ${colors.light};
  cursor: pointer;
`;

const createDescription = (user) => `Poistat kaikki käyttäjän ${user.firstName} profiilitiedot mukaan lukien hänen yhteytensä ja kavereidensa lähettämät viestit.`;

const OFFSET_STEP = 50;

function AdminPage(props) {
  const [offset, setOffset] = useState(0);

  const decreaseOffset = () => {
    const decreasedOffset = offset - OFFSET_STEP;
    if (decreasedOffset > 0) {
      setOffset(decreasedOffset);
    } else {
      setOffset(0);
    }
  };

  const increaseOffset = () => {
    const increasedOffset = offset + OFFSET_STEP;
    const maxOffset = props.users.length - OFFSET_STEP;
    if (increasedOffset < maxOffset) {
      setOffset(increasedOffset);
    } else {
      setOffset(maxOffset);
    }
  };

  useEffect(() => {
    props.fetchUsers();
  }, []);

  return (
    <>
      <NavigationWithBackButton to="/settings" title="Admin" />

      {props.users.length === 0
        ? <CenteredSpinner />
        : (
          <>
            <ButtonBar>
              <Button onClick={decreaseOffset}>Edelliset 50</Button>
              <Button onClick={increaseOffset}>Seuraavat 50</Button>
            </ButtonBar>

            {props.users.slice(offset, offset + OFFSET_STEP).map((user) => (
              <React.Fragment key={user.id}>
                <ProfileCard user={user} />

                <br />

                <DeleteProfile
                  description={createDescription(user)}
                  onDeleteUser={() => props.deleteUser(user.id)}
                  deletingInProgress={false}
                />

                <br />
                <br />
                <br />
              </React.Fragment>
            ))}

            <ButtonBar>
              <Button onClick={decreaseOffset}>Edelliset 50</Button>
              <Button onClick={increaseOffset}>Seuraavat 50</Button>
            </ButtonBar>
          </>
        )}
    </>
  );
}

AdminPage.propTypes = {
  deleteUser: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = createStructuredSelector({
  users: selectUsers,
});

const mapDispatchToProps = {
  deleteUser,
  fetchUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
