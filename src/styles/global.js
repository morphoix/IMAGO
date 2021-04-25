import { createGlobalStyle } from 'styled-components'
import { animated } from 'react-spring'
import styled from 'styled-components'

const GlobalStyles = createGlobalStyle`
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
    text-rendering: optimizeLegibility;
    font-family: 'Ubuntu Condensed', sans-serif;
    border-radius: 2px;
  }
  #app {
    height: 100%;
    width: 100%;
  }
  iframe {
    width: 100%;
    height: 100%;
    margin: 0;
    border: none;
  }
  #logo {
    position: absolute;
    display: flex;
    height: 8rem;
    width: auto;
    padding: 18px;
    right: 0;
    bottom: 0;
  }
  h3 {
    display: table-cell;
    letter-spacing: 4px;
    box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.05);
    vertical-align: middle;
    line-height: 60px;
    height: 60px;
    padding: 0;
    width: 80px;
    border: 1px solid ${({ theme }) => theme.primaryHover};
    background-color: ${({ theme }) => theme.primaryDark};
    border-radius: 3px;
    text-align: center;
    @media (max-width: ${({ theme }) => theme.mobile}) {
      display: none;
    }
  }
  small {
    display: block;
    bottom: 1.4rem;
    position: absolute;
    right: 25px;
  }
  small a {
    text-transform: none;
    padding: 0;
    margin: 0;
    border-radius: none;
    background: none;
    color: ${({ theme }) => theme.primaryHover};
  }
  small a:hover {
    background-color: transparent;
  }
  a {
    font-size: 0.8rem;
    text-transform: uppercase;
    padding: 0.5rem;
    margin: 0.5rem;
    color: ${({ theme }) => theme.primaryLight};
    background-color: ${({ theme }) => theme.primaryDark};
    text-decoration: none;
    transition-property: color;
    transition-duration: 0.4s;
    border-radius: 3px;
    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 1rem;
    }
  }
  a:hover {
    color: ${({ theme }) => theme.primaryDark};
    background-color: ${({ theme }) => theme.primaryHover};
  }
  a.active {
    color: ${({ theme }) => theme.primaryHover};
    background-color: ${({ theme }) => theme.primaryLight};
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
    @media (max-width: ${({ theme }) => theme.mobile}) {
      background: rgba(0, 0, 0, .0);
    }
  }
  .hide:hover {
   background: rgba(0, 0, 0, .0);
  }
`
const Container = styled(animated.div)`
  position: absolute;
  right: 0;
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(300px, 1fr));
  grid-gap: 20px;
  padding: 20px;
  cursor: pointer;
  will-change: width, height;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    display: flex;
    padding: 0;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`

const Item = styled(animated.div)`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 3px;
  will-change: transform, opacity;
  background-size: cover;
  -moz-background-size: cover;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    height: 200px;
    padding: 20px;
    border-radius: none;
  }
`
export { GlobalStyles, Container, Item }