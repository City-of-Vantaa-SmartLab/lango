import { createGlobalStyle, css } from 'styled-components';

export const colors = {
  primary: '#3C8FDE',
  success: '#6BB84A',
  danger: '#FA423B',
  dark: '#000000',
  light: '#FFFFFF',
  grey: '#888888',
  lightgrey: '#D9D9D6',
  messagePrimary: '#DDF3DB',
  messageSecondary: '#D8E9F8',
  facebook: '#3B5998',
};

export const boxShadow = css`
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.15);
`;

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');

  html {
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  html, body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
    font-size: 1rem;
  }

  #app {
    min-height: 100%;
    min-width: 100%;
  }
`;
