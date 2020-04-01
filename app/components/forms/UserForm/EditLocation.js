import React from 'react';
import PropTypes from 'prop-types';

import FormField from 'components/forms/UserForm/FormField';
import RequiredAsterisk from 'components/forms/RequiredAsterisk';
import Title from 'components/forms/Title';
import Select from 'components/forms/Select';

class EditLocation extends React.Component {
  constructor() {
    super();
    this.state = {
      location: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.setLocationElement = this.setLocationElement.bind(this);
    this.validate = this.validate.bind(this);
  }

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    this.setState({ location: this.props.location });
  }

  componentDidMount() {
    this.validate();
  }

  UNSAFE_componentWillReceiveProps(newProps) { // eslint-disable-line camelcase
    this.setState({ location: newProps.location });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.location !== nextProps.location;
  }

  componentDidUpdate() {
    this.validate();
  }

  setLocationElement(element) {
    this.location = element;
  }

  validate = () => {
    if (this.location.validity.valueMissing) {
      this.location.setCustomValidity('Sijainti on pakollinen kenttä');
    } else {
      this.location.setCustomValidity('');
    }
  }

  handleChange(event) {
    this.props.onSelect(event);
    this.setState({ location: event.target.value });
  }

  render() {
    return (
      <FormField>
        <Title>Sijainti <RequiredAsterisk /> </Title>
        <Select
          name="location"
          id="location"
          required
          inputRef={this.setLocationElement}
          value={this.state.location}
          onChange={this.handleChange}
          options={[
            { value: '', label: '-', key: 'not-selected' },
            { value: 'Pääkaupunkiseutu', label: 'Pääkaupunkiseutu', key: 'paakaupunkiseutu' },
            { value: 'Tampereen seutu', label: 'Tampereen seutu', key: 'tampere' },
            { value: 'Turun seutu', label: 'Turun seutu', key: 'turku' },
            { value: 'Oulun seutu', label: 'Oulun seutu', key: 'oulu' },
            { value: 'Muu Suomi', label: 'Muu Suomi', key: 'muu' },
          ]}
        />
      </FormField>
    );
  }
}

EditLocation.propTypes = {
  location: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

EditLocation.defaultProps = {
  location: '',
};

export default EditLocation;
