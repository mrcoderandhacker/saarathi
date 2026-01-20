import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', system-ui, sans-serif;
    background-color: #ffffff;
    color: #111827;
    line-height: 1.6;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;
