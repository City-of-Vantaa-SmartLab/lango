import React from 'react';
import PropTypes from 'prop-types';

import FormField from 'components/forms/UserForm/FormField';
import Input from 'components/forms/Input';
import RequiredAsterisk from 'components/forms/RequiredAsterisk';
import Title from 'components/forms/Title';

class EditProfileEmail extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
    this.setEmailElement = this.setEmailElement.bind(this);
  }

  componentDidMount() {
    this.validate();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }

  componentDidUpdate() {
    this.validate();
  }

  setEmailElement(element) {
    this.email = element;
  }

  handleChange = (event) => {
    this.props.onChange(event);
    this.validate();
  }

  validate = () => {
    if (this.email.validity.valueMissing) {
      this.email.setCustomValidity('Sähköposti on pakollinen kenttä');
    } else if (this.email.validity.typeMismatch) {
      this.email.setCustomValidity('Sähköposti on virheellisessä muodossa');
    } else {
      this.email.setCustomValidity('');
    }
  }

  render() {
    return (
      <FormField>
        <Title> Sähköposti <RequiredAsterisk /> </Title>
        <Input
          ref={this.setEmailElement}
          id="email"
          type="email"
          required
          placeholder="..."
          value={this.props.value || ''}
          onChange={this.handleChange}
        />
      </FormField>
    );
  }
}

EditProfileEmail.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default EditProfileEmail;
