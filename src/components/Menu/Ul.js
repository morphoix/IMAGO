import React from 'react'
import MenuItem from './MenuItem'

export default function Ul(props) {
    return (
        <ul>
            {
            props.iframes.map(( iframe, key, index, nav ) => {
                return <MenuItem iframe={iframe} key={iframe.id} nav={iframe.nav} img={iframe.img}/>
            })
            }
        </ul>
    )
}