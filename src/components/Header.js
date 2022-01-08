import React, {useRef} from 'react';
import {Canvas} from '@react-three/fiber';
import {MeshWobbleMaterial} from '@react-three/drei';

function Box(props) {
  const mesh = useRef();
  return (
    <mesh {...props} ref={mesh}>
      <ringGeometry args={[4, 12, 3, 1]} />
      <MeshWobbleMaterial
        attach="material"
        factor={1}
        speed={0.3}
        color={'#053c5e'}
        emissive={'#010C13'}
        roughness={0.4}
        transparent={true}
        opacity={0.5}
        metalness={0.9}
        reflectivity={1}
      />
    </mesh>
  );
}

function Triangle(props) {
  const mesh = useRef();
  return (
    <mesh {...props} ref={mesh}>
      <sphereBufferGeometry attach="geometry" args={[9, 4, 16]} />
      <MeshWobbleMaterial
        attach="material"
        factor={1}
        speed={0.2}
        color={'#DB222A'}
        emissive={'#010C13'}
        roughness={0.5}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function Header({open}) {
  return (
    <Canvas
      style={{
        width: open ? '100vw' : '20vw',
        height: open ? '100vh' : '20vh',
        position: 'absolute',
        left: '0',
        transition: 'all 0.5s',
      }}
    >
      <spotLight position={[-15, 10, 10]} angle={0.55} penumbra={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[20, 10, 20]} />
      <Box position={[-3, 0.5, -5]} />
      <Box position={[3, 1.5, -9]} />
      <Box position={[-5, 1, -4]} />
      <Box position={[9, 3, -15]} />
      <Box position={[17, 7, -19]} />
      <Box position={[25, 12, -22]} />
      <Triangle position={[-5, 0, -9]} />
    </Canvas>
  );
}
