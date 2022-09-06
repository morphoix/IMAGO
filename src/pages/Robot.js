import React from 'react';
import {useWindowSize} from '../hooks';

const Robot = () => {
  const size = useWindowSize();
  return <iframe Robot="City of Doom" src="3D/city.html" style={{width: size.width, height: size.height}} />;
};
export default Robot;
