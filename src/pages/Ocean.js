import React from 'react';
import {useWindowSize} from '../hooks';

const Ocean = () => {
  const size = useWindowSize();
  return <iframe title="Ocean" src="3D/ocean.html" style={{width: size.width, height: size.height}} />;
};
export default Ocean;
