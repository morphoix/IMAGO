import React from 'react'
import {useWindowSize} from '../hooks'

const Fox = () => {
    const size = useWindowSize()
	return (
            <iframe src='3D/fox.html' style={{ width: size.width, height: size.height }} />
    ) 	
}
export default Fox