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
    z-index: 888;
  }
  small {
    display: block;
    top: 5.3rem;
    position: absolute;
    left: 3.3rem;
    z-index: 8889;
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
    padding: 0.8rem;
    margin: 0.5rem;
    color: ${({ theme }) => theme.primaryLight};
    background-color: ${({ theme }) => theme.primaryDark};
    text-decoration: none;
    transition-property: color;
    transition-duration: 0.4s;
    border-radius: 3px;
    @media (max-width: ${({ theme }) => theme.mobile}) {
      background: none;
      color: ${({ theme }) => theme.primaryDark};
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
  .hide:hover {
    transform: ${({ open }) => open ? 'translateY(0)' : 'translateY(-100%)'};
    transition: transform 1s ease-in-out;
    @media (max-width: ${({ theme }) => theme.mobile}) {
      display: none;
    }
  }
`
const Container = styled(animated.div)`
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  padding: 25px;
  display: grid;
  grid-template-columns: repeat(4, minmax(200px, 1fr));
  grid-gap: 25px;
  cursor: pointer;
  box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.05);
  will-change: width, height;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    display: flex;
    padding-top: 140px;
    grid-gap: 15px;
    overflow-x: auto;
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
`
export { GlobalStyles, Container, Item }