import React from 'react';
import {useWindowSize} from '../hooks';

const Home = () => {
  const size = useWindowSize();

  return <iframe src="3D/home.html" style={{width: size.width, height: size.height}} />;
};
export default Home;
