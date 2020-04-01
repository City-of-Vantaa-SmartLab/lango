import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colors } from 'styles';
import { ChevronDownIcon } from 'components/icons';

const SelectContainer = styled.div`
  border: 1px solid ${colors.lightgrey};
  border-radius: 0.25rem;
  position: relative;
`;

const CustomSelect = styled.select`
  background: transparent;
  border: none;
  padding: 0.5rem;
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;

  &:focus {
    background: transparent;
    outline: 0 none;
  }
`;

const IconContainer = styled.div`
  color: ${colors.grey};
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translate(-50%, -50%);
`;

function Select({ id, value, name, onChange, options, inputRef, required }) {
  return (
    <SelectContainer>
      <IconContainer><ChevronDownIcon /></IconContainer>
      <CustomSelect
        id={id}
        ref={inputRef}
        value={value}
        name={name}
        onChange={(e) => onChange(e)}
        required={required}
      >
        {
          options.map((option) => (
            <option key={option.key || option.value} value={option.value}>
              {option.label}
            </option>
          ))
        }
      </CustomSelect>
    </SelectContainer>
  );
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

Select.defaultProps = {
  required: false,
};

export default Select;
