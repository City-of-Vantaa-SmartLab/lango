import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import profilePicture from 'utils/profile-picture';
import { boxShadow } from 'styles';
import { LoadingIcon } from 'components/icons';

const BigImageContainer = styled.div`
  ${boxShadow}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 7rem;
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  text-align: center;
  font-size: 2rem;
`;

const SmallImageContainer = styled(BigImageContainer)`
  flex-basis: 4rem;
  width: 4rem;
  height: 4rem;
`;

const Image = styled.img`
  font-size: 0; /* To hide the alt text */
  width: 100%;
  border-radius: 50%;
`;

function ProfilePicture(props) {
  const [pictureUrl, setPictureUrl] = useState('');

  const ImageContainer = props.small ? SmallImageContainer : BigImageContainer;

  useEffect(() => {
    (async () => {
      const url = props.src || await profilePicture.get(props.cognitoId);

      setPictureUrl(url);
    })();
  }, [props.cognitoId, props.src]);

  return (
    <ImageContainer>
      {
        pictureUrl
          ? <Image alt="Profiilikuva" src={pictureUrl} />
          : <LoadingIcon />
      }
    </ImageContainer>
  );
}

ProfilePicture.propTypes = {
  cognitoId: PropTypes.string,
  small: PropTypes.bool,
  src: PropTypes.string,
};

ProfilePicture.defaultProps = {
  cognitoId: null,
  small: false,
  src: null,
};

export default ProfilePicture;
