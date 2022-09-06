import React from 'react';
import {useWindowSize} from '../hooks';

const Gyza = () => {
  const size = useWindowSize();
  return <iframe title="Gyza" src="3D/pyramids.html" style={{width: size.width, height: size.height}} />;
};
export default Gyza;
