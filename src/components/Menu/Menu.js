import React from 'react'
import { bool } from 'prop-types'
import { StyledMenu } from './Menu.styled'
import Ul from './Ul'

const iframes = [
  {id: 1, nav: './', title: "Home", img:"./assets/home.jpg"},
  {id: 2, nav: './Berries', title: "Berries", img:"./assets/berries.jpg"},
  {id: 3, nav: './Gyza', title: "Gyza"},
  {id: 4, nav: './Eternal Waiting', title: "Eternal Waiting"},
  {id: 5, nav: './Ocean', title: "Ocean"},
  {id: 6, nav: './Vanilla Flower', title: "Vanilla Flower"},
  {id: 7, nav: './Lost Planet', title: "Lost Planet"},
  {id: 8, nav: './Flow', title: "Flow"},
  {id: 9, nav: './Grid', title: "Grid"},
  {id: 10, nav: './Hope', title: "Hope"},
  {id: 11, nav: './Tank', title: "Tank"},
  {id: 12, nav: './FallsApart', title: "Falls Apart"},
  {id: 13, nav: './Physis', title: "Physis"},
]

const Menu = ({ open }) => {
  return (
      <StyledMenu open={ open }>
        <Ul iframes={ iframes } />
      </StyledMenu>
  )
}

Menu.propTypes = {
  open: bool.isRequired,
}

export default Menu;