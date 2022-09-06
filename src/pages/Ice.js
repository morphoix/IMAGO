import React from 'react';
import {useWindowSize} from '../hooks';

const Ice = () => {
  const size = useWindowSize();
  return (
    <iframe
      title="Ice"
      src="3D/ice.html"
      style={{
        width: size.width,
        height: size.height,
      }}
    />
  );
};
export default Ice;
