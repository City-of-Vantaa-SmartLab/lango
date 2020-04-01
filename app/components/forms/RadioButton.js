import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colors } from 'styles';
import { RadioCheckedIcon, RadioIcon } from 'components/icons';

const RadioButtonInput = styled.input`
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  top: auto;
  width: 1px;
  white-space: nowrap;
`;

const DefaultRadioButton = styled.div`
  box-sizing: border-box;
  color: ${colors.grey};
  cursor: pointer;
  float: left;
  height: 2rem;
  margin-right: 0.4rem;
  text-align: center;
  transition: all 0.1s ease-out;
  vertical-align: top;
  width: 1.4rem;
`;

const CheckedRadioButton = styled(DefaultRadioButton)`
  color: ${colors.success};
`;

const RadioButtonLabel = styled.label`
  display: block;
  overflow: hidden;
`;

const RadioButton = ({ id, value, name, onChange, checked, label, inputRef }) => (
  <div>
    <RadioButtonLabel htmlFor={id}>{label}
      {
        checked
          ? <CheckedRadioButton><RadioCheckedIcon /></CheckedRadioButton>
          : <DefaultRadioButton><RadioIcon /></DefaultRadioButton>
      }
    </RadioButtonLabel>
    <RadioButtonInput
      ref={inputRef}
      type="radio"
      id={id}
      value={value}
      name={name}
      onChange={onChange}
      checked={checked}
    />
  </div>
);

RadioButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  inputRef: PropTypes.func,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

RadioButton.defaultProps = {
  inputRef: null,
};

export default RadioButton;
