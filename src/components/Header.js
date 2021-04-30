import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshWobbleMaterial } from '@react-three/drei'

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
      <ringGeometry args={[ 2, 8, 3, 1 ]} />
      <MeshWobbleMaterial
        attach="material"
        factor={ 1 } 
        speed={ 0.5 }
        color={ hovered ? '#fb8500' : '#3d5a80'  } 
        emissive={ hovered ? '#fb8500' : '#3d5a80' }
        wireframe={ active ? true : false }
        roughness={ 0.6 }
        transparent={ true }
        opacity={ 0.2 }
        metalness={ 0.9 }
        reflectivity={ 0.9 } 
      />
    </mesh>
  )
}

export default function Header() {
  return (
    <Canvas style={{ width: '70vw', height: 150, margin: 0 }}>
      <spotLight position={[-10, 10, 10]} angle={0.55} penumbra={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={5} />
      <pointLight position={[20, 10, 20]} />
      <Box position={[ -3, 0.5, -5 ]} />
      <Box position={[ 3, 1.5, -9 ]} />
      <Box position={[ -7, 1, 0 ]} />
      <Box position={[ 9, 3, -15 ]} />
      <Box position={[ 17, 7, -19 ]} />
      <Box position={[ 25, 12, -22 ]} />
    </Canvas>
  )
}
