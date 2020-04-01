import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { selectIsLoggedIn } from 'store/session';
import DefaultNavigation from 'containers/DefaultNavigation';

import { content } from './content';

function FAQPage({ isLoggedIn }) {
  return (
    <>
      {isLoggedIn && <DefaultNavigation />}

      <div>
        <ReactMarkdown source={content} />
      </div>
    </>
  );
}

FAQPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isLoggedIn: selectIsLoggedIn,
});

export default connect(mapStateToProps)(FAQPage);
