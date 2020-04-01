import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colors, boxShadow } from 'styles';
import { LoadingIcon } from 'components/icons';

const Button = styled.button`
  ${boxShadow}
  height: 60px;
  background-color: ${colors.success};
  border: none;
  border-radius: 8px;
  color: ${colors.light};
  margin-bottom: 0.5em;
  width: 100%;
  cursor: pointer;
`;

function SaveButton({ isLoading, onClick }) {
  return (
    <Button onClick={onClick}>
      {isLoading ? <LoadingIcon /> : 'Tallenna'}
    </Button>
  );
}

SaveButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

SaveButton.defaultProps = {
  isLoading: false,
};

export default SaveButton;
