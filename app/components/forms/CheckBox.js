import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colors } from 'styles';
import { CheckboxCheckedIcon, CheckboxIcon } from 'components/icons';

// http://adrianroselli.com/2017/05/under-engineered-custom-radio-buttons-and-checkboxen.html
const CustomCheckBox = styled.input`
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  top: auto;
  width: 1px;
  white-space: nowrap;
`;

const DefaultBox = styled.div`
  box-sizing: border-box;
  color: ${colors.grey};
  cursor: pointer;
  height: 1.4rem;
  text-align: center;
  transition: all 0.1s ease-out;
  vertical-align: top;
  width: 1.4rem;
  padding-right: 1rem;
`;

const CheckedBox = styled(DefaultBox)`
  color: ${colors.success};
`;

const Label = styled.label`
  display: flex;
  padding: 0;
  width: 100%;
`;

function CheckBox({ name, onChange, checked, label }) {
  return (
    <div>
      <Label htmlFor={name}>
        {
          checked
            ? <CheckedBox><CheckboxCheckedIcon /></CheckedBox>
            : <DefaultBox><CheckboxIcon /></DefaultBox>
        }
        {label}
      </Label>
      <CustomCheckBox
        id={name}
        type="checkbox"
        name={name}
        onChange={onChange}
        checked={checked}
      />
    </div>
  );
}

CheckBox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

CheckBox.defaultProps = {
  checked: false,
};

export default CheckBox;
