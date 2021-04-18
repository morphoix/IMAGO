import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import Header from './Header'

export default function MenuItem({ iframe }) {
    return (  
        <li>
            <Header />
            <NavLink
                    to={ iframe.nav }
                    exact
                >
                { iframe.title }
            </NavLink>
            <img src={ iframe.img } style={imgStyle} />
        </li>
    )
}
const imgStyle = {
    height: 'auto', 
    width: '100%', 
    padding: '1rem', 
    borderRadius: '5px'
}
MenuItem.propTypes = {
    iframe: PropTypes.object.isRequired
}