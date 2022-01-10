import {createGlobalStyle} from 'styled-components';

const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  *, *::after, *::before {
    box-sizing: border-box;
  }
  body {
    display: flex;
    user-select: none;
    background: #010C13;
    color: ${({theme}) => theme.primaryDark};
    text-rendering: optimizeLegibility;
    font-family: 'Ubuntu Condensed', sans-serif;
  }
  #app {
    height: 100%;
    width: 100%;
  }
  iframe {
    margin: 0;
    border: none;
    padding: 70px;
    z-index: 8888;
  }
  small {
    display: flex;
    align-items: center;
    bottom: 1rem;
    position: absolute;
    left: 10px;
    padding: 10px;
    color: white;
  }
  small a {
    text-transform: none;
    font-size: 1rem;
    margin: 0 10px;
    text-shadow: none;
  }
  a {
    font-size: 20px;
    word-wrap: break-word;
    text-transform: uppercase;
    text-decoration: none;
    text-shadow: 1px 5px 4px #353652;
    text-align: center;
    color: #db222a;
    transition: all 0.5s;
    z-index: 9999;
  }
  a:hover {
    text-shadow: 1px 2px 2px #fff;
    color: transparent;
  }
  a.active {
    text-shadow: 1px 5px 4px #942b3b;
    color: white;
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
  .hide {
    background: rgba(0, 0, 0, .4);
    @media (max-width: ${({theme}) => theme.mobile}) {
      background: rgba(0, 0, 0, .0);
    }
  }
  .hide:hover {
   background: rgba(0, 0, 0, .0);
  }
`;

export {GlobalStyles};
