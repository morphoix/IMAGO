import React from 'react'
import { bool, func } from 'prop-types'
import { StyledBurger } from './Burger.styled'

const Burger = ({ open, setOpen, ...props }) => {
  return (
    <StyledBurger aria-label="Toggle menu" open={open} {...props}>
      <span />
      <span />
      <span />
    </StyledBurger>
  )
}

Burger.propTypes = {
  open: bool.isRequired,
  setOpen: func.isRequired,
}

export default Burger;