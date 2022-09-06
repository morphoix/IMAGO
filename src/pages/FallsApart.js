import React from 'react';
import {useWindowSize} from '../hooks';

const FallsApart = () => {
  const size = useWindowSize();
  return (
    <iframe
      title="Falls apart"
      src="3D/fallsApart.html"
      style={{
        width: size.width,
        height: size.height,
      }}
    />
  );
};
export default FallsApart;
