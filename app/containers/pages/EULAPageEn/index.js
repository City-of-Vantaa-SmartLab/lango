import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { selectIsLoggedIn } from 'store/session';
import DefaultNavigation from 'containers/DefaultNavigation';

import { contentEn } from './content';

function EULAPageEn({ isLoggedIn }) {
  return (
    <>
      {isLoggedIn && <DefaultNavigation />}

      <div>
        <ReactMarkdown source={contentEn} />
      </div>
    </>
  );
}

EULAPageEn.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isLoggedIn: selectIsLoggedIn,
});

export default connect(mapStateToProps)(EULAPageEn);
