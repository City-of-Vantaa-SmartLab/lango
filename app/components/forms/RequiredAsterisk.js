import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

const Required = styled.span`
  color: ${colors.danger};
`;

const RequiredAsterisk = () => <Required>*</Required>;

export default RequiredAsterisk;
