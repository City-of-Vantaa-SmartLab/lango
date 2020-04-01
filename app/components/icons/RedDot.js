import styled, { css } from 'styled-components';

import { colors } from 'styles';

export default styled.div`
  height: 1rem;
  width: 1rem;
  background-color: ${colors.danger};
  border-radius: 50%;
  position: relative;
  display: none;
  z-index: 99;
  border: 0.125rem solid ${colors.light};

  ${(props) => props.show && css`
    display: inline-block;
  `};
`;
