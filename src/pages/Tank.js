import React from 'react'
import {useWindowSize} from '../hooks'

const Tank = () => {
    const size = useWindowSize()
	return (
            <iframe src='3D/tank.html' 
            style={{ width: size.width, height: size.height }} />
    ) 	
}
export default Tank