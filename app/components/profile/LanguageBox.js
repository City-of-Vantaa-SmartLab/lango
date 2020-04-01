import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { colors } from 'styles';
import { languageNameByCode } from 'languages';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: inherit;
`;

const LanguageList = styled.div`
  width: 50%;
  max-width: 12rem;
  margin: 1rem 0;

  &:first-child {
    margin-right: 1rem;
  }

  &:last-child {
    margin-left: 1rem;
  }
`;

const HorizontalDivider = styled.div`
  height: 2px;
  width: 100%;
  background: linear-gradient(
    to right,
    ${colors.light} 0%,
    ${colors.lightgrey} 50%,
    ${colors.light} 100%
  );
`;

const Ul = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  margin: 0.5rem 0 0 0;
  padding: 0;
`;

function LanguageBox({ learning, spoken }) {
  const listLanguages = (languages) => {
    const languageList = languages.map((language) => <li key={language}>{languageNameByCode.get(language)}</li>);

    return (
      <Ul>
        {languageList.length > 0 ? languageList : <li>&mdash;</li>}
      </Ul>
    );
  };

  return (
    <Container>
      <HorizontalDivider />

      <Row>
        <LanguageList>
          <strong>Osaan puhua</strong>
          {listLanguages(spoken)}
        </LanguageList>

        <LanguageList>
          <strong>Haluan oppia</strong>
          {listLanguages(learning)}
        </LanguageList>
      </Row>
    </Container>
  );
}

LanguageBox.propTypes = {
  learning: PropTypes.arrayOf(PropTypes.string),
  spoken: PropTypes.arrayOf(PropTypes.string),
};

LanguageBox.defaultProps = {
  learning: null,
  spoken: null,
};

export default LanguageBox;
