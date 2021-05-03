import React, { useRef, useEffect, useState, Suspense } from "react";
import "./darkness.scss";
//components
import Header from "./components/header"
import state from "./components/state"
import { Canvas, useFrame } from '@react-three/fiber'
import { Section } from './components/section'
import { Html, useGLTF } from '@react-three/drei'
import { useInView } from "react-intersection-observer"

const Model = ({ url }) => {
  const gltf = useGLTF(url, true)
  return <primitive object={gltf.scene} dispose={null} />
}
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
    </>
  )
}

const HTMLContent = ({
  domContent,
  children,
  bgColor,
  modelPath,
  position,
}) => {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.001))

  const [refItem, inView] = useInView({ threshold: 0,})
  useEffect(() => {inView && (document.body.style.background = bgColor)
  }, [inView])

  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, position, 0]}>
        <mesh ref={ref} position={[0, 0, 0]} scale={[12, 12, 12]}>
          <Model url={modelPath}/>
        </mesh>
        <Html fullscreen portal={domContent}>
          <div ref={refItem} className='container'>
            <h1 className='title'>{children}</h1>
          </div>
        </Html>
      </group>
    </Section>
  )
}

export default function Darkness() {
  const [events, setEvents] = useState();
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  return (
    <>
      <Header />
      <Canvas
        concurrent
        colorManagement
        camera={{ position: [0, 0, 120], fov: 70 }}>
        <Lights />
        <Suspense fallback={null}>
          <HTMLContent
            domContent={domContent}
            bgColor='#52b788'
            modelPath='/assets/scene.gltf'
            position={250}>
            <span>Upon you</span>
          </HTMLContent>
          <HTMLContent
            domContent={domContent}
            bgColor='#2d6a4f'
            modelPath='/assets/scene.gltf'
            position={0}>
            <span>There is</span>
          </HTMLContent>
          <HTMLContent
            domContent={domContent}
            bgColor='#081c15'
            modelPath='/assets/scene.gltf'
            position={-250}>
            <span>Darkness</span>
          </HTMLContent>
        </Suspense>  
      </Canvas>
      <div
        className='scrollArea'
        ref={scrollArea}
        onScroll={onScroll}
        {...events}>
        <div style={{ position: "sticky", top: 0 }} ref={domContent} />
        <div style={{ height: `${state.pages * 100}vh` }} />
      </div>
    </>
  );
}