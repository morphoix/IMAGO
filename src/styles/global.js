import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  *, *::after, *::before {
    box-sizing: border-box;
  }
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    background: ${({ theme }) => theme.primaryDark};;
    color: ${({ theme }) => theme.primaryLight};
    height: 100vh;
    text-rendering: optimizeLegibility;
    font-family: 'Ubuntu Condensed', sans-serif;
    border-radius: 2px;
  }
  #logo {
    position: absolute;
    display: flex;
    height: 6rem;
    width: auto;
    right: 0;
    bottom: 1vh;
    @media (max-width: ${({ theme }) => theme.mobile}) {
      display: none;
    }
  }
  div {
    text-align: center;
  }
  iframe {
    width: 100%;
    height: 100%;
    margin: 0;
    border: none;
  }
  small {
    display: block;
    bottom: 2vh;
    position: absolute;
    right: 2.5rem;
  }
  #app {
    height: 100%;
    width: 100%;
  }
  #box {
    @media (max-width: ${({ theme }) => theme.mobile}) {
      display: none;
    }
  }
  a {
    color: ${({ theme }) => theme.primaryHover};
    text-decoration: none;
  }
  button:active, button:focus, a:active, a:focus {
    outline: none !important;
    -webkit-appearance: none;
      -moz-appearance: none;
            appearance: none;
    border: none;
    border-radius: none;
  }
  button::-moz-focus-inner {
    border: 0 !important;
  }
`