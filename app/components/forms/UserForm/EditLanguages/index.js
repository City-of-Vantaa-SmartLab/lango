import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';

import { colors } from 'styles';
import Title from 'components/forms/Title';
import RequiredAsterisk from 'components/forms/RequiredAsterisk';
import MyAutosuggest from './MyAutoSuggest';

const AutoSuggestStyle = createGlobalStyle`
  .react-autosuggest__container {
    position: relative;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .react-autosuggest__input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${colors.lightgrey};
    border-radius: 4px;
  }

  .react-autosuggest__input--focused {
    outline: none;
  }

  .react-autosuggest__suggestions-container--open {
    position: absolute;
    width: 100%;
    top: 2rem;
    border: 1px solid ${colors.lightgrey};
    background-color: ${colors.light};
    border-radius: 0 0 0.25rem 0.25rem;
    z-index: 2;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: 0.5rem;
  }

  .react-autosuggest__suggestion--highlighted {
    background-color: ${colors.lightgrey};
  }
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  justify-content: center;
  margin-bottom: 2rem;

  &:first-child {
    margin-right: 0.5rem;
  }

  &:last-child {
    margin-left: 0.5rem;
  }
`;

const ValidateErrorHolder = styled.input`
  display: inline;
  border: none;
  :focus {
    outline: 0 none;
  }
`;

const Subtitle = styled.span`
  margin-bottom: 0.5rem;

  #error-message-holder {
    /* Hack to make the holder not screw up the layout;
       the actual error message will pop up in its own tooltip-ish container so this doesn't break it */
    width: 1px;
  }
`;

const isNotEmpty = (str) => !!str && str.length > 0;

class EditLanguages extends React.Component {
  constructor() {
    super();

    this.state = {
      spoken0: null,
      spoken1: null,
      spoken2: null,
      learning0: null,
      learning1: null,
      learning2: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.setErrorHolder = this.setErrorHolder.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    this.handleUpdate();
    this.validate();
  }

  componentDidUpdate(prevProps) {
    const languagesChanged = (
      this.props.spoken[0] !== prevProps.spoken[0]
      || this.props.spoken[1] !== prevProps.spoken[1]
      || this.props.spoken[2] !== prevProps.spoken[2]
      || this.props.learning[0] !== prevProps.learning[0]
      || this.props.learning[1] !== prevProps.learning[1]
      || this.props.learning[2] !== prevProps.learning[2]
    );
    if (languagesChanged) {
      this.handleUpdate();
    }

    this.validate();
  }

  setErrorHolder(element) {
    this.errorHolder = element;
  }

  validate() {
    const hasSpoken = isNotEmpty(this.state.spoken0)
      || isNotEmpty(this.state.spoken1)
      || isNotEmpty(this.state.spoken2);

    if (hasSpoken) {
      this.errorHolder.setCustomValidity('');
    } else {
      this.errorHolder.setCustomValidity('Valitse ainakin yksi kieli, jota osaat puhua.');
    }
  }

  handleUpdate() {
    if (this.props.forNewUser) {
      return;
    }

    this.setState({
      spoken0: this.props.spoken[0] || null,
      spoken1: this.props.spoken[1] || null,
      spoken2: this.props.spoken[2] || null,
      learning0: this.props.learning[0] || null,
      learning1: this.props.learning[1] || null,
      learning2: this.props.learning[2] || null,
    });
  }

  handleChange(id, value) {
    const languagesState = { ...this.state, [id]: value };

    this.setState(languagesState);

    const languagesObject = {
      spoken: [
        languagesState.spoken0,
        languagesState.spoken1,
        languagesState.spoken2,
      ].filter((x) => x !== null),
      learning: [
        languagesState.learning0,
        languagesState.learning1,
        languagesState.learning2,
      ].filter((x) => x !== null),
    };

    // saves state to the store
    this.props.onChange(languagesObject);
  }

  render() {
    return (
      <div>
        <AutoSuggestStyle />
        <Title>Omat kielet</Title>
        <RowWrapper>
          <ColumnWrapper>
            <Subtitle>
              Osaan puhua <RequiredAsterisk />
              <ValidateErrorHolder type="text" id="error-message-holder" ref={this.setErrorHolder} />
            </Subtitle>
            <MyAutosuggest id="spoken0" placeholder="..." onChange={this.handleChange} value={this.state.spoken0} />
            <MyAutosuggest id="spoken1" placeholder="..." onChange={this.handleChange} value={this.state.spoken1} />
            <MyAutosuggest id="spoken2" placeholder="..." onChange={this.handleChange} value={this.state.spoken2} />
          </ColumnWrapper>
          <ColumnWrapper>
            <Subtitle>Haluan oppia</Subtitle>
            <MyAutosuggest id="learning0" placeholder="..." onChange={this.handleChange} value={this.state.learning0} />
            <MyAutosuggest id="learning1" placeholder="..." onChange={this.handleChange} value={this.state.learning1} />
            <MyAutosuggest id="learning2" placeholder="..." onChange={this.handleChange} value={this.state.learning2} />
          </ColumnWrapper>
        </RowWrapper>
      </div>
    );
  }
}

EditLanguages.propTypes = {
  forNewUser: PropTypes.bool,
  learning: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  spoken: PropTypes.array.isRequired,
};

EditLanguages.defaultProps = {
  forNewUser: false,
};

export default EditLanguages;
