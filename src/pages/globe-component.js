
import React, {useRef, useEffect} from 'react';
import styled from 'styled-components';

import {WebGLRenderer, Scene} from 'three';
import {PerspectiveCamera, DirectionalLight, Color, PointLight, Vector2} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import countries from '../assets/countries.json';

let renderer; let scene; let controls; let composer;
let Globe;
let camera;
const mouseX = 0;
const mouseY = 0;

const params = {
  exposure: 0.5,
  bloomStrength: 0.4,
  bloomThreshold: 0,
  bloomRadius: 0.2,
};

const Wrapper = styled.div`
  display: flex;
  position: relative;
  padding: 70px;
`;

const CanvasWrapper = styled.div`
  position: absolute;
  margin-bottom: 50px;
`;

const Planet = () => {
  const ref = useRef();
  const windowHalfX = ref.innerWidth / 2;

  useEffect(async () => {
    const ThreeGlobe = (await import('three-globe')).default;

    function init() {
      renderer = new WebGLRenderer({antialias: true});
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      ref.current.appendChild(renderer.domElement);
      scene = new Scene();
      scene.background = new Color(0xfffae5);

      camera = new PerspectiveCamera();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      const dLight = new DirectionalLight(0xffff3f, 1);
      dLight.position.set(-800, 700, 400);

      const dLight1 = new DirectionalLight(0xffffff, 1);
      dLight1.position.set(-200, 500, 200);

      const dLight2 = new PointLight(0xffff3f, 1);
      dLight2.position.set(-200, 500, 200);
      camera.add(dLight, dLight1, dLight2);

      camera.position.z = 300;
      camera.position.x = 0;
      camera.position.y = 0;
      scene.add(camera);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dynamicDampingFactor = 0.01;
      controls.enablePan = false;
      controls.minDistance = 90;
      controls.maxDistance = 500;
      controls.rotateSpeed = 0.8;
      controls.zoomSpeed = 1;
      controls.autoRotate = false;
      controls.minPolarAngle = Math.PI / 3.5;
      controls.maxPolarAngle = Math.PI - Math.PI / 3;

      const renderScene = new RenderPass(scene, camera);
      const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.3, 0.4, 0.85);
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;

      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
    }

    function initGlobe() {
      Globe = new ThreeGlobe();
      Globe.hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.4)
          .hexPolygonColor((e) => {
            if (['KGZ', 'KOR', 'THA', 'RUS', 'UZB', 'IDN', 'KAZ', 'MYS'].includes(e.properties.ISO_A3)) {
              return '#08a045';
            } else return '#ffea00';
          })
          .showGlobe(false)
          .showAtmosphere(true)
          .atmosphereColor('#014737')
          .atmosphereAltitude(0.8)
          .rotateY(-Math.PI * (5 / 9))
          .rotateZ(-Math.PI / 6);
      scene.add(Globe);
      Globe.position.x = 90;
    }

    function animate() {
      Globe.rotation.y += 0.0005;
      camera.position.x += Math.abs(mouseX) <= windowHalfX / 2 ? (mouseX / 2 - camera.position.x) * 0.005 : 0;
      camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
      camera.lookAt(scene.position);
      controls.update();
      composer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    init();
    initGlobe();
    animate();

    return () => {};
  }, []);

  return (
    <Wrapper>
      <CanvasWrapper ref={ref} />
    </Wrapper>
  );
};

export default Planet;
