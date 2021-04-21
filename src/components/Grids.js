import React, { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useTransition, useSpring, useChain, config } from 'react-spring'
import { Container, Item } from '../styles/global'
import data from '../data'
import Burger from './Burger/Burger'
import Header from './Header'

const menuId = "main-menu"

export default function Grids () {
    const [open, setOpen] = useState(false)
  
    const springRef = useRef()
    const { size, opacity, ...rest } = useSpring({
      ref: springRef,
      config: config.stiff,
      from: { size: '20%', background: '#fb8500' },
      to: { size: open ? '100%' : '20%', background: open ? 'rgba(250, 250, 250, .6)' : 'rgba(250, 250, 250, .0)' }
    })
  
    const transRef = useRef()
    const transitions = useTransition(open ? data : [], item => item.name, {
      ref: transRef,
      unique: true,
      trail: 400 / data.length,
      from: { opacity: 0, transform: 'scale(0)' },
      enter: { opacity: 1, transform: 'scale(1)' },
      leave: { opacity: 0, transform: 'scale(0)' }
    })
    useChain(open ? [springRef, transRef] : [transRef, springRef], [0, open ? 0.1 : 0.6])
  
    return (
      <Container style={{ ...rest, width: size, height: size }} onClick={() => setOpen(open => !open)}>
        <Burger open={open} setOpen={setOpen} aria-controls={menuId} />
        <Header />
        {transitions.map(({ item, key, props }) => (
          <Item key={key} style={{ ...props, backgroundImage: item.css }} >
            <NavLink
              to={ item.nav || '/' }
              exact
                >
                { item.name }
            </NavLink>
            <div open={open} class='hide' style={{ height: '80%', background: 'rgba(250, 250, 250, .05)' }} />
          </Item>
        ))}
      </Container>
    )
  }
