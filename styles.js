import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
  }

  body {
    margin: 0;
    font-family: system-ui;
    background: #e6fbff;
  }
`;
