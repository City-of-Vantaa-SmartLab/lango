import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { colors } from 'styles';
import FormField from 'components/forms/UserForm/FormField';
import Title from 'components/forms/Title';

const Textarea = styled.textarea`
    border: 1px solid ${colors.lightgrey};
    border-radius: 0.25rem;
    line-height: 1.5;
    outline: none;
    padding: 0.5rem;
    width: 100%;
`;

function EditBio({ description, onChange }) {
  return (
    <FormField>
      <Title>Esittelyteksti</Title>
      <Textarea
        name="introduction"
        id="description"
        rows="4"
        maxLength="300"
        onChange={onChange}
        value={description}
      />
    </FormField>
  );
}

EditBio.propTypes = {
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EditBio;
