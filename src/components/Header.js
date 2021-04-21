import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'

function Box(props) {
  const mesh = useRef()
  const [ hovered, setHover ] = useState(false)
  const [ active, setActive ] = useState(false)
  useFrame(() => {
    mesh.current.rotation.z += 0.005
  })
  return (
    <mesh
      {...props}
      ref={ mesh }
      onClick={ (e) => setActive(!active) }
      onPointerOver={ (e) => setHover(true) }
      onPointerOut={ (e) => setHover(false) }>
      <ringGeometry args={[ 2, 6, 3, 1 ]} />
      <meshPhysicalMaterial 
        color={ hovered ? '#3d5a80' : '#fb8500' } 
        emissive={ hovered ? '#3d5a80' : '#fb8500' }
        wireframe={ active ? false : true }
        roughness={ 0.4 }
        transparent={ true }
        opacity={ 0.9 }
        metalness={ 0.9 }
        reflectivity={ 0.9 } 
      />
    </mesh>
  )
}

export default function Header() {
  return (
    <Canvas style={{ width: 400, height: 150, margin: 0 }}>
      <spotLight position={[-10, 10, 10]} angle={0.55} penumbra={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[20, 10, 20]} />
      <Box position={[ -3, 0.5, -5 ]} />
      <Box position={[ 3, 1.5, -9 ]} />
      <Box position={[ -7, 1, 0 ]} />
      <Box position={[ 9, 3, -11 ]} />
    </Canvas>
  )
}
