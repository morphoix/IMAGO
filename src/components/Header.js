import React, {useRef} from 'react';
import {Canvas} from '@react-three/fiber';
import {MeshWobbleMaterial} from '@react-three/drei';

function Triangle(props) {
  const mesh = useRef();
  return (
    <mesh {...props} ref={mesh}>
      <ringGeometry args={[2, 20, 3, 24]} />
      <MeshWobbleMaterial
        attach="material"
        factor={1}
        speed={0.1}
        color={'#053c5e'}
        emissive={'#010C13'}
        roughness={0.3}
        metalness={0.9}
        reflectivity={0.9}
      />
    </mesh>
  );
}

function Frame(props) {
  const mesh = useRef();
  return (
    <mesh {...props} ref={mesh}>
      <ringGeometry args={[19, 22, 3, 24]} />
      <MeshWobbleMaterial
        attach="material"
        factor={1}
        speed={0.01}
        color={'#053c5e'}
        emissive={'#010C13'}
        roughness={0.5}
        metalness={0.5}
        wireframe={true}
        wireframeLinewidth={2}
        reflectivity={1}
      />
    </mesh>
  );
}

function Sphere(props) {
  const mesh = useRef();
  return (
    <mesh {...props} ref={mesh}>
      <sphereBufferGeometry attach="geometry" args={[9, 4, 120]} />
      <MeshWobbleMaterial
        attach="material"
        factor={1}
        speed={0.1}
        color={'#db222a'}
        emissive={'#010C13'}
        roughness={0.5}
        wireframe={true}
        wireframeLinewidth={10}
        metalness={0.9}
      />
    </mesh>
  );
}

export default function Header({open, touch}) {
  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        left: '0',
        display: touch ? 'none' : 'inherit',
      }}
      id="frame"
    >
      <spotLight position={[-10, 10, 10]} angle={0.55} penumbra={2} />
      <spotLight position={[10, 10, 10]} angle={0.55} penumbra={2} />
      <pointLight position={[20, 10, 20]} />
      {open && <Triangle position={[-3, 1, -7]} />}
      {open && <Sphere position={[-5, 0, -13]} />}
      {!open && <Frame position={[-2, 1, -3]} />}
    </Canvas>
  );
}
