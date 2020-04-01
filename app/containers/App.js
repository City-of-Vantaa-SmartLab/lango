import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { createSession, selectSession } from 'store/session';
import { selectAreFriendshipsLoading, selectFriendshipsById } from 'store/friendships';
import { selectUserId, selectUserIsAdmin } from 'store/user';
import CenteredSpinner from 'components/icons/CenteredSpinner';
import SettingsPage from 'containers/SettingsPage';
import ProfilesPage from 'containers/ProfilesPage';
import EditUserPage from 'containers/EditUserPage';
import PreferencesPage from 'containers/PreferencesPage';
import LandingPage from 'containers/LandingPage';
import NewUserPage from 'containers/NewUserPage';
import EULAPageEn from 'containers/pages/EULAPageEn';
import EULAPageFi from 'containers/pages/EULAPageFi';
import FAQPage from 'containers/pages/FAQPage';
import PrivacyPageFi from 'containers/pages/PrivacyPageFi';
import PrivacyPageEn from 'containers/pages/PrivacyPageEn';
import Chat from 'containers/Chat';
import FriendshipPage from 'containers/FriendshipPage';
import FriendshipsPage from 'containers/FriendshipsPage';
import AdminPage from 'containers/AdminPage';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1024px;
  min-height: 100vh;
  margin: 0 auto;
`;

const PageWrapper = styled.div`
  margin-top: 60px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  componentDidMount() {
    this.props.createSession();
  }

  componentDidUpdate(_, prevState) {
    const { areFriendshipsLoading, session, userId } = this.props;
    const cognitoLoginFailed = session.cognitoLoginFinished && session.cognitoId === null;
    const userDataFetchSucceeded = session.cognitoLoginFinished && (!!userId || session.userIsNew);
    const friendshipsFetchSucceeded = session.cognitoLoginFinished && !areFriendshipsLoading;

    if (prevState.loading && (cognitoLoginFailed || userDataFetchSucceeded) && friendshipsFetchSucceeded) {
      // eslint-disable-next-line
      this.setState({ loading: false }); // Contrary to what eslint says, this is fine
    }
  }

  render() {
    if (this.state.loading) {
      return <CenteredSpinner />;
    }

    const isLoggedIn = this.props.session.cognitoId;
    const isNewUser = this.props.session.userIsNew;
    const hasUserProfile = this.props.userId;

    const userIsNew = isLoggedIn && isNewUser && !hasUserProfile;
    const userIsRegistered = isLoggedIn && hasUserProfile;

    const renderRootElement = () => {
      if (userIsRegistered) {
        return <ProfilesPage />;
      }

      if (userIsNew) {
        return <NewUserPage />;
      }

      return <LandingPage />;
    };

    const redirectIfNotRegistered = (renderComponent) => ({ match }) => (
      userIsRegistered
        ? renderComponent(match)
        : <Redirect to="/" />
    );

    const redirectIfNotRegisteredAndAdmin = (renderComponent) => ({ match }) => (
      userIsRegistered && this.props.userIsAdmin
        ? renderComponent(match)
        : <Redirect to="/" />
    );

    const matchToFriendship = (match) => this.props.friendshipsById[match.params.id];

    return (
      <Router>
        <AppWrapper>
          <PageWrapper>
            <Switch>
              <Route exact path="/" render={renderRootElement} />

              <Route path="/faq" render={() => <FAQPage />} />
              <Route path="/eula" render={() => <EULAPageFi />} />
              <Route path="/privacy" render={() => <PrivacyPageFi />} />
              <Route path="/eula-en" render={() => <EULAPageEn />} />
              <Route path="/privacy-en" render={() => <PrivacyPageEn />} />

              <Route path="/admin" render={redirectIfNotRegisteredAndAdmin(() => <AdminPage />)} />
              <Route path="/profiles" render={redirectIfNotRegistered(() => <ProfilesPage />)} />
              <Route path="/settings" render={redirectIfNotRegistered(() => <SettingsPage />)} />
              <Route path="/edit-profile" render={redirectIfNotRegistered(() => <EditUserPage />)} />
              <Route path="/preferences" render={redirectIfNotRegistered(() => <PreferencesPage />)} />
              <Route exact path="/friendships" render={redirectIfNotRegistered(() => <FriendshipsPage />)} />
              <Route exact path="/friendships/:id" render={redirectIfNotRegistered((match) => <FriendshipPage friendship={matchToFriendship(match)} />)} />
              <Route exact path="/friendships/:id/chat" render={redirectIfNotRegistered((match) => <Chat friendship={matchToFriendship(match)} />)} />

              <Redirect to="/" />
            </Switch>
          </PageWrapper>
        </AppWrapper>
      </Router>
    );
  }
}

App.propTypes = {
  areFriendshipsLoading: PropTypes.bool.isRequired,
  createSession: PropTypes.func.isRequired,
  friendshipsById: PropTypes.object.isRequired,
  session: PropTypes.shape({
    cognitoId: PropTypes.string,
    cognitoLoginFinished: PropTypes.bool.isRequired,
    userIsNew: PropTypes.bool.isRequired,
  }).isRequired,
  userId: PropTypes.string,
  userIsAdmin: PropTypes.bool,
};

App.defaultProps = {
  userId: null,
  userIsAdmin: false,
};

const mapStateToProps = createStructuredSelector({
  areFriendshipsLoading: selectAreFriendshipsLoading,
  friendshipsById: selectFriendshipsById,
  session: selectSession,
  userId: selectUserId,
  userIsAdmin: selectUserIsAdmin,
});

const mapDispatchToProps = {
  createSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
