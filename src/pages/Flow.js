import React from 'react';
import {useWindowSize} from '../hooks';

const Flow = () => {
  const size = useWindowSize();
  return <iframe src="3D/flow.html" style={{width: size.width, height: size.height}} />;
};
export default Flow;
