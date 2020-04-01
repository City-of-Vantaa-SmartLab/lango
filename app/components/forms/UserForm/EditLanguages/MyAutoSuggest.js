import React from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';

import { languages, languageCodeByName, languageNameByCode } from 'languages';

function getLanguageNameSuggestions(value) {
  const escapedValue = value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp(`^${escapedValue}`, 'i');

  return languages.filter((language) => regex.test(language.name));
}

class MyAutosuggest extends React.Component {
  constructor() {
    super();

    this.state = {
      languageName: '',
      suggestions: [],
    };
  }

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    this.setState({ languageName: this.props.value ? languageNameByCode.get(this.props.value) : '' });
  }

  UNSAFE_componentWillReceiveProps(newProps) { // eslint-disable-line camelcase
    this.setState({ languageName: newProps.value ? languageNameByCode.get(newProps.value) : '' });
  }

  onChange = (_, { newValue: name }) => {
    this.setState({ languageName: name });

    const suggestions = getLanguageNameSuggestions(name);

    if (name.length >= 1 && suggestions.length === 0) {
      this.props.onChange(this.props.id, null);
    } else if (languageCodeByName.has(name)) {
      this.props.onChange(this.props.id, languageCodeByName.get(name));
    }
  };

  // Use case : User leaving an incomplete value on the input
  onBlur = () => {
    if (!languageCodeByName.has(this.state.languageName)) {
      this.props.onChange(this.props.id, null);
      this.setState({ languageName: '' });
    }
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: getLanguageNameSuggestions(value) });
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  renderInputComponent = (inputProps) => (
    <div>
      <input {...inputProps} maxLength={14} />
    </div>
  );

  renderSuggestion = (suggestion) => (
    <span>{suggestion.name}</span>
  );

  render() {
    const { id, placeholder } = this.props;
    const { languageName, suggestions } = this.state;

    const inputProps = {
      placeholder,
      value: languageName,
      onChange: this.onChange,
      onBlur: this.onBlur,
    };

    return (
      <Autosuggest
        id={id}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion.name}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={this.renderInputComponent}
        highlightFirstSuggestion
      />
    );
  }
}

MyAutosuggest.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

MyAutosuggest.defaultProps = {
  placeholder: '...',
  value: '',
};

export default MyAutosuggest;
