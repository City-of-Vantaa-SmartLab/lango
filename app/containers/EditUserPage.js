import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { putUser, deleteUser, selectUser } from 'store/user';
import DeleteProfile from 'components/DeleteProfile';
import UserForm from 'components/forms/UserForm';
import { NavigationWithBackButton } from 'components/Navigation';

function EditUserPage(props) {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteUser = () => {
    setDeleting(true);
    props.deleteUser();
  };

  const deletionDescription = 'Poistat kaikki profiilitietosi mukaan lukien yhteydet ja kavereidesi lähettämät viestit.';

  return (
    <>
      <NavigationWithBackButton to="/settings" title="Muokkaa profiilia" />
      <UserForm initialUser={props.user} saveUserAction={props.putUser} />
      <DeleteProfile description={deletionDescription} deletingInProgress={deleting} onDeleteUser={handleDeleteUser} />
    </>
  );
}

EditUserPage.propTypes = {
  deleteUser: PropTypes.func.isRequired,
  putUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

const mapDispatchToProps = {
  deleteUser,
  putUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditUserPage);
