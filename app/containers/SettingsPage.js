import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { createStructuredSelector } from 'reselect';

import { signOut } from 'store/session';
import { colors, boxShadow } from 'styles';
import { ChevronRightIcon, SignOutIcon } from 'components/icons';
import DefaultNavigation from 'containers/DefaultNavigation';
import { selectUserIsAdmin } from 'store/user';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-weight: bold;
`;

const menuStyle = css`
  ${boxShadow}
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;

  > svg {
    margin-left: auto;
    font-size: 1.5rem;
  }
`;

const MenuItem = styled(Link)`
  ${menuStyle}
  margin-bottom: 1rem;
  border: 2px solid ${colors.primary};
  color: ${colors.primary};
  text-decoration: none;
`;

const AdminMenuItem = styled(MenuItem)`
  ${menuStyle}
  border: 2px solid ${colors.danger};
  color: ${colors.danger}
`;

const SignOutItem = styled.div`
  ${menuStyle}
  border: 2px solid ${colors.dark};
  margin-top: auto;
`;

function SettingsPage(props) {
  return (
    <>
      <DefaultNavigation />

      <Wrapper>
        <MenuItem to="/edit-profile">
          Muokkaa profiilia <ChevronRightIcon />
        </MenuItem>

        <MenuItem to="/preferences">
          Hakuasetukset <ChevronRightIcon />
        </MenuItem>

        <MenuItem to="/faq">
          Usein kysyttyä (FAQ) <ChevronRightIcon />
        </MenuItem>

        {props.userIsAdmin && (
          <AdminMenuItem to="/admin">
            Admin <ChevronRightIcon />
          </AdminMenuItem>
        )}

        <SignOutItem onClick={props.signOut}>
          Kirjaudu ulos <SignOutIcon />
        </SignOutItem>
      </Wrapper>
    </>
  );
}

SettingsPage.propTypes = {
  signOut: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool,
};

SettingsPage.defaultProps = {
  userIsAdmin: false,
};

const mapStateToProps = createStructuredSelector({
  userIsAdmin: selectUserIsAdmin,
});

const mapDispatchToProps = {
  signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
