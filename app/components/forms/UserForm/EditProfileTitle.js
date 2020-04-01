import React from 'react';
import PropTypes from 'prop-types';

import FormField from 'components/forms/UserForm/FormField';
import Input from 'components/forms/Input';
import RequiredAsterisk from 'components/forms/RequiredAsterisk';
import Title from 'components/forms/Title';

class EditProfileTitle extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
    this.setNameElement = this.setNameElement.bind(this);
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

  setNameElement(element) {
    this.name = element;
  }

  handleChange = (event) => {
    this.props.onChange(event);
  }

  validate = () => {
    if (this.name.validity.valueMissing) {
      this.name.setCustomValidity('Nimi on pakollinen kenttä');
    } else {
      this.name.setCustomValidity('');
    }
  }

  render() {
    return (
      <FormField>
        <Title> Nimi <RequiredAsterisk /> </Title>
        <Input
          ref={this.setNameElement}
          id="firstName"
          type="text"
          required
          placeholder="..."
          value={this.props.value}
          onChange={this.handleChange}
        />
      </FormField>
    );
  }
}

EditProfileTitle.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default EditProfileTitle;
