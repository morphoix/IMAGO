import styled from 'styled-components'

export const StyledBurger = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  padding: 0;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    display: flex;
  }
  span {
    width: 2rem;
    height: 0.12rem;
    background: ${({ theme, open }) => open ? theme.primaryLight : theme.primaryHover};
    border-radius: 10px;
    transition: all 0.8s linear;
    position: relative;
    transform-origin: 1px;
    :first-child {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }
    :nth-child(2) {
      transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'};
      opacity: ${({ open }) => open ? '0' : '1'};
    }
    :nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`