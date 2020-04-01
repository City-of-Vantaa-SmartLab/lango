import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { colors } from 'styles';
import ProfilePicture from 'components/profile/ProfilePicture';

const Row = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 25px;
  `;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    padding-top: 25px;
`;

const Name = styled.div`
  font-weight: bold;
  line-height: 1.5;
`;

const Location = styled.div`
  height: 28px;
  width: 139px;
  color: ${colors.grey};
  line-height: 28px;
`;

const Description = styled.div`
  line-height: 1.5;
  opacity: 0.75;
  margin-bottom: 20px;
`;

function IdCard({ description, firstName, cognitoId, location }) {
  return (
    <div>
      <Row>
        <ProfilePicture cognitoId={cognitoId} />
        <Column>
          <Name>{firstName}</Name>
          <Location>{location}</Location>
        </Column>
      </Row>

      <Description>
        <p>{description}</p>
      </Description>
    </div>
  );
}

IdCard.propTypes = {
  description: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  cognitoId: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

IdCard.defaultProps = {
  description: '',
};

export default IdCard;
