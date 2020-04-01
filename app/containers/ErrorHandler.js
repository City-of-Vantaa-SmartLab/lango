import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import { colors } from 'styles';
import { selectErrors } from 'store/errors';

const ErrorWrapper = styled.div`
  position: absolute;
  min-width: 300px;
  width: 30vw;
  height: 6rem;
  bottom: 0;
  right: 0;
  margin: 10px;
  background: ${colors.grey};
  z-index: 1000;
  border-left: 5px solid ${colors.danger};
  color: ${colors.light};
  padding: 10px;
`;

class ErrorHandler extends React.Component {
  constructor() {
    super();
    this.state = { shouldShow: false };
    this.close = this.close.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    if (nextProps.errors.length > 0) {
      console.error('Error, probably caused by GraphQL', ...nextProps.errors);
      this.setState({ shouldShow: true });
    }
  }

  close() {
    this.setState({ shouldShow: false });
  }

  render() {
    return (
      <>
        {
          this.state.shouldShow && (
            <ErrorWrapper onClick={this.close}>
              <b> Tapahtui odottamaton virhe! </b>
              <br />
              Voit sulkea tämän ilmoituksen klikkaamalla.
            </ErrorWrapper>
          )
        }
        {this.props.children}
      </>
    );
  }
}

ErrorHandler.propTypes = {
  children: PropTypes.node.isRequired,
  errors: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = createStructuredSelector({
  errors: selectErrors,
});

export default connect(mapStateToProps)(ErrorHandler);
