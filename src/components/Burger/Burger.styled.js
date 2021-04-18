import styled from 'styled-components'

export const StyledBurger = styled.button`
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 1.3rem;
  height: 1.3rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 9999;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    top: 1rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    
  };
  span {
    width: 1.3rem;
    height: 0.13rem;
    background: ${({ theme, open }) => open ? theme.primaryHover : theme.primaryLight};
    border-radius: 10px;
    transition: all 0.8s linear;
    position: relative;
    transform-origin: 1px;
    @media (max-width: ${({ theme }) => theme.mobile}) {
      width: 2rem;
      height: 0.17rem;
    };
    :first-child {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }
    :nth-child(2) {
      opacity: ${({ open }) => open ? '0' : '1'};
      transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'};
    }
    :nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`