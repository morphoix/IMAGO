import React from 'react'
import {useWindowSize} from '../hooks'

const Physis = () => {
    const size = useWindowSize()
	return (
            <iframe src='3D/physis.html' 
            style={{ width: size.width, height: size.height }} />
    ) 	
}
export default Physis