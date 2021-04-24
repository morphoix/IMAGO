import React from 'react'
import {useWindowSize} from '../hooks'

const ThreeDMenu = () => {
    const size = useWindowSize()
	return (
            <iframe src='3D/canvases.html' 
                style={{ 
                width: size.width, 
                height: size.height }} 
            />
    ) 	
}
export default ThreeDMenu