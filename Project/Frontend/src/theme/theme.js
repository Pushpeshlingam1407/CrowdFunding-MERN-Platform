import { createGlobalStyle } from "styled-components";

export const theme = {
  colors: {
    primary: "#0077b6",
    background: "#ffffff",
    text: "#212529",
    accent: "#005f8a",
  },
  fonts: {
    main: `CohereText, "SF Pro Text", "Space Grotesk", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
    serif: `"Crimson Pro", Lora, "Tiempos Fine", Copernicus, Georgia, "Times New Roman", serif`,
    mono: `JetBrains Mono, SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace`,
  },
};

export const GlobalStyle = createGlobalStyle`
  :root {
    --font-sans: ${theme.fonts.main};
    --font-serif: ${theme.fonts.serif};
    --font-mono: ${theme.fonts.mono};
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: var(--font-sans);
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button, input, select, textarea {
    font-family: inherit;
  }
`;
