import React from 'react';
import {useWindowSize} from '../hooks';

const Berries = () => {
  const size = useWindowSize();
  return (
    <iframe
      src="3D/strawberry.html"
      style={{
        width: size.width,
        height: size.height,
      }}
    />
  );
};
export default Berries;
