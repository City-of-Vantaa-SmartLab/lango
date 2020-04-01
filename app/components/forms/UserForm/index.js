import React, { createRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import EditBio from 'components/forms/UserForm/EditBio';
import EditLanguages from 'components/forms/UserForm/EditLanguages';
import EditLocation from 'components/forms/UserForm/EditLocation';
import EditProfileEmail from 'components/forms/UserForm/EditProfileEmail';
import EditProfileTitle from 'components/forms/UserForm/EditProfileTitle';
import GenderCheckbox from 'components/forms/UserForm/GenderCheckbox';
import FormField from 'components/forms/UserForm/FormField';
import CheckBox from 'components/forms/CheckBox';
import RequiredAsterisk from 'components/forms/RequiredAsterisk';
import SaveButton from 'components/forms/SaveButton';
import ProfilePicture from 'components/profile/ProfilePicture';

const PictureWrapper = styled.div`
  margin-right: 1rem;
  margin-bottom: 1rem;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 1rem;
`;

const NameBox = styled.div`
  flex: 1;
`;

function UserForm({ initialUser, saveUserAction }) {
  const fromRef = createRef();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    firstName: initialUser.firstName,
    email: initialUser.email,
    gender: initialUser.gender,
    location: initialUser.location,
    description: initialUser.description,
    spoken: initialUser.spoken,
    learning: initialUser.learning,
    isHidden: initialUser.isHidden,
  });

  const handleChange = (event) => {
    event.persist();
    setUser({ ...user, [event.target.id]: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    event.persist();
    setUser({ ...user, [event.target.id]: event.target.checked });
  };

  const handleGenderChange = (event) => {
    setUser({ ...user, gender: event.target.value });
  };

  const handleLanguageChange = (event) => {
    setUser({ ...user, learning: event.learning, spoken: event.spoken });
  };

  const saveProfile = (event) => {
    event.preventDefault();
    fromRef.current.reportValidity();

    if (fromRef.current.checkValidity()) {
      setLoading(true);

      saveUserAction({
        ...user,
        cognitoId: initialUser.cognitoId,
        pictureUrl: initialUser.pictureUrl,
      });
    }
  };

  const picture = initialUser.pictureUrl
    ? <ProfilePicture src={initialUser.pictureUrl} />
    : <ProfilePicture cognitoId={initialUser.cognitoId} />;

  return (
    <form ref={fromRef}>
      <RowWrapper>
        <PictureWrapper>
          {picture}
        </PictureWrapper>

        <NameBox>
          <EditProfileTitle
            value={user.firstName}
            onChange={handleChange}
          />
        </NameBox>
      </RowWrapper>

      <EditProfileEmail
        value={user.email}
        onChange={handleChange}
      />

      <GenderCheckbox
        gender={user.gender}
        onClick={handleGenderChange}
      />

      <EditLocation
        location={user.location}
        onSelect={handleChange}
      />

      <EditLanguages
        spoken={user.spoken}
        learning={user.learning}
        onChange={handleLanguageChange}
      />

      <EditBio
        description={user.description}
        onChange={handleChange}
      />

      <FormField>
        <CheckBox
          checked={user.isHidden}
          label="Piilota profiilini muilta kuin nykyisiltä kielikavereiltani."
          name="isHidden"
          onChange={handleCheckboxChange}
        />
      </FormField>

      <p>
        <RequiredAsterisk /> merkityt kentät ovat pakollisia.
      </p>

      <SaveButton
        id="SaveButton"
        type="submit"
        onClick={saveProfile}
        isLoading={loading}
      />
    </form>
  );
}

UserForm.propTypes = {
  initialUser: PropTypes.object.isRequired,
  saveUserAction: PropTypes.func.isRequired,
};

export default UserForm;
