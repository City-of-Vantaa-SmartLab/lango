import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { colors, boxShadow } from 'styles';
import { browseUserRecommendationsLeft, browseUserRecommendationsRight } from 'store/user-recommendations';
import { requestFriendship } from 'store/friendships';
import { LoadingIcon, HandshakeIcon, ChevronRightIcon, ChevronLeftIcon } from 'components/icons';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom : 1rem;
  left: 0;
  width: 100%;
  font-size: 3rem;
`;

const HandshakeButton = styled.div`
  ${boxShadow}
  align-items: center;
  display: flex;
  color: ${colors.light};
  justify-content: center;
  flex: 0 0 7rem;
  width: 7rem;
  height: 7rem;
  background-color: ${colors.primary};
  border-radius: 120%;
  padding: 1rem;
  cursor: pointer;
`;

const ArrowButton = styled.button`
  flex-grow: 1;
  height: 7rem;
  max-width: 7rem;
  color: ${colors.lightgrey};
  cursor: pointer;
  border: none;
  background: none;
  font-size: 3rem;

  &:focus, &:hover {
    outline: none;
    color: ${colors.grey};
  }
`;

class ProfilesFooter extends React.Component {
  constructor() {
    super();
    this.state = { clicked: false };
    this.handshake = this.handshake.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    if (nextProps.id !== this.props.id) {
      this.setState({ clicked: false });
    }
  }

  handshake(id) {
    this.setState({ clicked: true });
    this.props.requestFriendship(id);
  }

  render() {
    return (
      <Wrapper>
        <ArrowButton onClick={this.props.browseUserRecommendationsLeft}>
          <ChevronLeftIcon />
        </ArrowButton>
        <HandshakeButton onClick={() => this.handshake(this.props.id)}>
          {
            this.state.clicked
              ? <LoadingIcon />
              : <HandshakeIcon />
          }
        </HandshakeButton>
        <ArrowButton onClick={this.props.browseUserRecommendationsRight}>
          <ChevronRightIcon />
        </ArrowButton>
      </Wrapper>
    );
  }
}

ProfilesFooter.propTypes = {
  browseUserRecommendationsLeft: PropTypes.func.isRequired,
  browseUserRecommendationsRight: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  requestFriendship: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  browseUserRecommendationsLeft,
  browseUserRecommendationsRight,
  requestFriendship,
};

export default connect(null, mapDispatchToProps)(ProfilesFooter);
