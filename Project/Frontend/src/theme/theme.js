import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#0077b6',
    background: '#ffffff',
    text: '#212529',
    accent: '#005f8a',
  },
  fonts: {
    main: `'Inter', sans-serif`,
  },
};

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: ${theme.fonts.main};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.5;
  }
`;
