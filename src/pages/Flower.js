import React from 'react'
import {useWindowSize} from '../hooks'

const Flower = () => {
    const size = useWindowSize()
	return (
            <iframe src='3D/flower.html' style={{ width: size.width, height: size.height }} />
    ) 	
}
export default Flower