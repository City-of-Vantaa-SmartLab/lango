import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import Title from 'components/forms/Title';
import SaveButton from 'components/forms/SaveButton';
import CheckBox from 'components/forms/CheckBox';
import { changeGenderPreference, selectUserPreferences, savePreferences } from 'store/user';
import { NavigationWithBackButton } from 'components/Navigation';

const checkboxes = [
  {
    name: 'female',
    key: 'checkBox1',
    label: 'Naiset',
  },
  {
    name: 'male',
    key: 'checkBox2',
    label: 'Miehet',
  },
  {
    name: 'other',
    key: 'checkBox3',
    label: 'Muut',
  },
];

const IconAndCheckBoxWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const CheckBoxWrapper = styled.div`
  flex: 1;
`;

class PreferencesPage extends React.Component {
  constructor(props) {
    super(props);

    const preferenceMap = new Map();
    preferenceMap.set('male', false).set('female', false).set('other', false);

    // Turn props into map for our purpose
    if (this.props.userPreferences.gender) {
      this.props.userPreferences.gender.map((item) => preferenceMap.set(item, true));
    }

    this.state = {
      checkedItems: preferenceMap,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;

    this.setState((prevState) => {
      // This is necessary because the backend only takes arrays so far
      const newCheckedItems = prevState.checkedItems.set(item, isChecked);
      const newArrayItems = [];
      checkboxes.map((gender) => {
        if (newCheckedItems.get(gender.name)) {
          newArrayItems.push(gender.name);
        }
        return null;
      });

      this.props.changeGenderPreference(newArrayItems);
      return { checkedItems: newCheckedItems };
    });
  }

  render() {
    return (
      <>
        <NavigationWithBackButton to="/settings" title="Hakuasetukset" />
        <Title> Näytä </Title>
        {
          checkboxes.map((item) => (
            <IconAndCheckBoxWrapper key={item.key}>
              <CheckBoxWrapper>
                <CheckBox
                  name={item.name}
                  checked={this.state.checkedItems.get(item.name)}
                  label={item.label}
                  onChange={this.handleChange}
                />
              </CheckBoxWrapper>
            </IconAndCheckBoxWrapper>
          ))
        }
        <p>
          Lango ehdottaa sinulle kielikavereita kielivalintojesi ja sijaintisi mukaan.
          Jos etsit tiettyyn sukupuoleen kuuluvaa kielikaveria,
          tee haluamasi rajaukset yllä olevien valintapainikkeiden avulla.
        </p>
        <SaveButton onClick={this.props.savePreferences} />
      </>
    );
  }
}

PreferencesPage.propTypes = {
  changeGenderPreference: PropTypes.func.isRequired,
  savePreferences: PropTypes.func.isRequired,
  userPreferences: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userPreferences: selectUserPreferences,
});

const mapDispatchToProps = {
  changeGenderPreference,
  savePreferences,
};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesPage);
