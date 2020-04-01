import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import FormField from 'components/forms/UserForm/FormField';
import RequiredAsterisk from 'components/forms/RequiredAsterisk';
import RadioButton from 'components/forms/RadioButton';
import Title from 'components/forms/Title';

const GenderRadioButtons = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin-right: 1rem;
  }
`;

class GenderCheckbox extends React.Component {
  constructor() {
    super();
    this.state = {
      gender: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
    this.setGenderElement = this.setGenderElement.bind(this);
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate() {
    this.validate();
  }

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    this.setState({ gender: this.props.gender });
  }

  UNSAFE_componentWillReceiveProps(newProps) { // eslint-disable-line camelcase
    this.setState({ gender: newProps.gender });
  }

  handleChange(event) {
    this.props.onClick(event);
    this.setState({ gender: event.target.value });
  }

  setGenderElement(element) {
    this.gender = element;
  }

  validate = () => {
    if (this.state.gender === '') {
      this.gender.setCustomValidity('Sukupuoli on pakollinen kenttä');
    } else {
      this.gender.setCustomValidity('');
    }
  }

  render() {
    return (
      <FormField>
        <Title> Sukupuoli <RequiredAsterisk /> </Title>
        <GenderRadioButtons>
          <RadioButton
            inputRef={this.setGenderElement}
            id="male"
            value="male"
            name="gender"
            onChange={this.handleChange}
            checked={this.state.gender === 'male'}
            label="Mies"
          />
          <RadioButton
            id="female"
            value="female"
            name="gender"
            onChange={this.handleChange}
            checked={this.state.gender === 'female'}
            label="Nainen"
          />
          <RadioButton
            id="other"
            value="other"
            name="gender"
            onChange={this.handleChange}
            checked={this.state.gender === 'other'}
            label="Muu"
          />
        </GenderRadioButtons>
      </FormField>
    );
  }
}

GenderCheckbox.propTypes = {
  gender: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

GenderCheckbox.defaultProps = {
  gender: '',
};

export default (GenderCheckbox);
