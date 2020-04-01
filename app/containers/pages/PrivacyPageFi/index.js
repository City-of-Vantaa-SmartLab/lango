import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { selectIsLoggedIn } from 'store/session';
import DefaultNavigation from 'containers/DefaultNavigation';

import { contentFi } from './content';

function PrivacyPageFi({ isLoggedIn }) {
  return (
    <>
      {isLoggedIn && <DefaultNavigation />}

      <div>
        <ReactMarkdown source={contentFi} />
      </div>
    </>
  );
}

PrivacyPageFi.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isLoggedIn: selectIsLoggedIn,
});

export default connect(mapStateToProps)(PrivacyPageFi);
