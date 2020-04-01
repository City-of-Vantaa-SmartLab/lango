import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import { fetchUserRecommendations, selectCurrentUserRecommendation, selectIsLoadingUserRecommendations } from 'store/user-recommendations';
import DefaultNavigation from 'containers/DefaultNavigation';
import CenteredSpinner from 'components/icons/CenteredSpinner';
import ProfileCard from 'components/profile/ProfileCard';
import ProfilesFooter from 'containers/ProfilesFooter';
import Info from 'components/Info';

const ProfileContainer = styled.div`
  padding-bottom: 7rem;
`;

class ProfilesPage extends React.Component {
  componentDidMount() {
    if (!this.props.isLoadingUserRecommendations && this.props.currentUserRecommendation === null) {
      this.props.fetchUserRecommendations();
    }
  }

  render() {
    const { currentUserRecommendation, isLoadingUserRecommendations } = this.props;

    const profileView = currentUserRecommendation
      ? (
        <ProfileContainer>
          <ProfileCard user={currentUserRecommendation} />
          <ProfilesFooter id={currentUserRecommendation.id} />
        </ProfileContainer>
      )
      : <Info>Emme löytäneet yhtään sinulle sopivaa käyttäjää. Tarkista myöhemmin uudelleen!</Info>;

    const loadingView = <CenteredSpinner />;
    const currentView = isLoadingUserRecommendations ? loadingView : profileView;

    return (
      <>
        <DefaultNavigation />
        {currentView}
      </>
    );
  }
}

ProfilesPage.propTypes = {
  currentUserRecommendation: PropTypes.object,
  fetchUserRecommendations: PropTypes.func.isRequired,
  isLoadingUserRecommendations: PropTypes.bool.isRequired,
};

ProfilesPage.defaultProps = {
  currentUserRecommendation: null,
};

const mapStateToProps = createStructuredSelector({
  currentUserRecommendation: selectCurrentUserRecommendation,
  isLoadingUserRecommendations: selectIsLoadingUserRecommendations,
});

const mapDispatchToProps = {
  fetchUserRecommendations,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilesPage);
