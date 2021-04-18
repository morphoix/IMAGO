import React from 'react'
import {useWindowSize} from '../hooks'

const Grid = () => {
    const size = useWindowSize()
	return (
            <iframe src='3D/grid.html' 
            style={{ width: size.width, height: size.height }} />
    ) 	
}
export default Grid