import styled from 'styled-components'

export const StyledMenu = styled.nav`
  transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
  width: 20vw;
  height: 100vh;
  left: 0;
  overflow: hidden;
  -ms-overflow-style: none;  /* IE and Edge */
  text-align: right;
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 1s ease-in-out;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    padding-top: 3rem;
    width: 100vw;
    background: ${({ theme }) => theme.primaryDark};
  }
  ul {
    list-style: none;
    margin: 1rem;
    padding: 0;
    height: auto;
    width: auto;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    @media (max-width: ${({ theme }) => theme.mobile}) {
      flex-direction: column;
      width: 100vw;
      height: 95vh;
      top: 5vh;
      padding: 1rem 0 1rem 0;
      margin: 0;
      flex-wrap: nowrap;
    }
  }
  li {
    margin: 5px;
    border-radius: 5px;
    background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);
    &:hover {
      background-color: ${({ theme }) => theme.primaryLight};
    }
  }
  a {
    font-size: 0.8rem;
    text-transform: uppercase;
    padding: 1.5rem;
    margin: 1rem;
    color: ${({ theme }) => theme.primaryDark};
    text-decoration: none;
    transition-property: color, background-color, border;
    transition-duration: 0.4s;
    transition-timing-function: ease-out;
    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 1.2rem;
      transition: none;
      padding: 1rem;
      background: transparent;
    }
  }
  a.active {
      color: ${({ theme }) => theme.primaryHover};
    }
`