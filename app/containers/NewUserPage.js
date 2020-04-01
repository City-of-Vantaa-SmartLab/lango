import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectSession, signOut } from 'store/session';
import { newUser } from 'store/user';
import { NavigationWithOnlyTitle } from 'components/Navigation';
import UserForm from 'components/forms/UserForm';

function NewUserPage(props) {
  const { cognitoId, federatedData } = props.session;

  if (!federatedData) {
    props.signOut();
    return null;
  }

  const initialUser = {
    cognitoId,
    pictureUrl: federatedData.picture.data.url,
    firstName: federatedData.first_name,
    email: federatedData.email,
    gender: '',
    description: '',
    location: '',
    isHidden: false,
    spoken: [],
    learning: [],
  };

  return (
    <>
      <NavigationWithOnlyTitle title="Luo profiili" />
      <UserForm initialUser={initialUser} saveUserAction={props.newUser} />
    </>
  );
}

NewUserPage.propTypes = {
  newUser: PropTypes.func.isRequired,
  session: PropTypes.shape({
    cognitoId: PropTypes.string.isRequired,
    federatedData: PropTypes.object,
  }).isRequired,
  signOut: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  session: selectSession,
});

const mapDispatchToProps = {
  newUser,
  signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewUserPage);
