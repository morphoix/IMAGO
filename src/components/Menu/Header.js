import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { useWindowSize } from '../../hooks'

function Box(props) {
  const mesh = useRef()
  const [ hovered, setHover ] = useState(false)
  const [ active, setActive ] = useState(false)
  useFrame(() => {
    mesh.current.rotation.z += 0.01
  })
  return (
    <mesh
      {...props}
      ref={ mesh }
      onClick={ (e) => setActive(!active) }
      onPointerOver={ (e) => setHover(true) }
      onPointerOut={ (e) => setHover(false) }>
      <ringGeometry args={[ 1, 4, 3, 1 ]} />
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
    <Canvas style={{ width: 170, height: 65, margin: 0 }}>
      <spotLight position={[-10, 10, 10]} angle={0.55} penumbra={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[20, 10, 20]} />
      <Box position={[ 0, 0.5, 1 ]} />
      <Box position={[ -5, 1.5, 0 ]} />
      <Box position={[ 13, -0.5, -5 ]} />
    </Canvas>
  )
}
