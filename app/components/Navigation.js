import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { colors } from 'styles';
import { ArrowLeftIcon, CogIcon, UsersIcon, CommentIcon } from 'components/icons';
import RedDot from 'components/icons/RedDot';

const navigationItemStyle = css`
  position: relative;
  display: flex;
  flex-basis: 0;
  height: 30px;
  text-decoration: none;
  justify-content: center;
  align-items: center;
  color: ${colors.light};
  font-weight: bold;

  & svg {
    font-size: 2rem;
  }
`;

const OverlappingRedDot = styled(RedDot)`
  position: absolute;
  right: -2px;
  top: -2px;
`;

const NavigationLink = styled(Link)`
  ${navigationItemStyle}
  user-select: none;
  cursor: pointer;

  &:active {
    color: ${colors.lightgrey};
  }

  ${(props) => props.grow && css`
    flex-grow: 1;
  `}

  ${(props) => props.hide && css`
    opacity: 0;
  `}
`;

const NavigationText = styled.div`
  ${navigationItemStyle}

  ${(props) => props.grow && css`
    flex-grow: 1;
  `}

  ${(props) => props.hide && css`
    opacity: 0;
  `}
`;

const Navigation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  background-color: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 60px;
  width: 100%;
  max-width: 1024px;
  padding: 0 1rem; /* The page content is padded 1rem so that must be matched here for nice alignment */
  z-index: 1000;
`;

export function MainNavigation(props) {
  return (
    <Navigation>
      <NavigationLink to="/settings">
        <CogIcon />
      </NavigationLink>
      <NavigationLink to="/profiles">
        <UsersIcon />
      </NavigationLink>
      <NavigationLink to="/friendships">
        <CommentIcon />
        <OverlappingRedDot show={props.friendshipsWithUnreadMessages.length > 0 || props.unseenFriendRequests.length > 0} />
      </NavigationLink>
    </Navigation>
  );
}

MainNavigation.propTypes = {
  friendshipsWithUnreadMessages: PropTypes.array.isRequired,
  unseenFriendRequests: PropTypes.array.isRequired,
};

export function NavigationWithBackButton({ to, title }) {
  return (
    <Navigation>
      <NavigationLink to={to}><ArrowLeftIcon /></NavigationLink>
      <NavigationText grow={1}>{title}</NavigationText>
      <NavigationText hide={1}><ArrowLeftIcon /></NavigationText>
    </Navigation>
  );
}

NavigationWithBackButton.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export function NavigationWithTitleLinkAndBackButton({ to, title, titleTo }) {
  return (
    <Navigation>
      <NavigationLink to={to}><ArrowLeftIcon /></NavigationLink>
      <NavigationLink to={titleTo} grow={1}>{title}</NavigationLink>
      <NavigationText hide={1}><ArrowLeftIcon /></NavigationText>
    </Navigation>
  );
}

NavigationWithTitleLinkAndBackButton.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleTo: PropTypes.string.isRequired,
};

export function NavigationWithOnlyTitle({ title }) {
  return (
    <Navigation>
      <NavigationText>{title}</NavigationText>
    </Navigation>
  );
}

NavigationWithOnlyTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
