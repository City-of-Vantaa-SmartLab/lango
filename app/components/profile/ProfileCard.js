import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import IdCard from 'components/profile/IdCard';
import LanguageBox from 'components/profile/LanguageBox';

const Container = styled.div`
  display: flex;
  flex-direction : column;
`;

function ProfileCard({ user }) {
  return (
    <Container>
      <IdCard
        cognitoId={user.cognitoId}
        firstName={user.firstName}
        location={user.location}
        description={user.description}
      />

      <LanguageBox
        learning={user.learning}
        spoken={user.spoken}
      />
    </Container>
  );
}

ProfileCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileCard;
