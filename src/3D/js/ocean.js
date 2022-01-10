import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import {Water} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/objects/Water.js';
import {Sky} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/objects/Sky.js';

let renderer;
let scene;
let camera;
let controls;
let water;
let objects = [];

init();
animate();

function init() {
  let container = document.getElementById('c');
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(80, 15, 150);

  let light = new THREE.DirectionalLight(0xffffff, 0.8);

  let spotLight = new THREE.SpotLight(0xfffb3d, 0.7);
  spotLight.position.set(-50, 200, 30);
  spotLight.castShadow = true;
  scene.add(light, spotLight);
  //water
  let sun = new THREE.Vector3();
  // Water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('/3D/files/waternormals.jpg', function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    alpha: 1.0,
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI / 2;
  scene.add(water);
  // Skybox
  const sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;

  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;

  const parameters = {
    inclination: 0.49,
    azimuth: 0.205,
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  function updateSun() {
    const theta = Math.PI * (parameters.inclination - 0.5);
    const phi = 2 * Math.PI * (parameters.azimuth - 0.5);

    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();

    scene.environment = pmremGenerator.fromScene(sky).texture;
  }
  updateSun();

  function addObject(x, y, obj) {
    scene.add(obj);
    objects.push(obj);
  }
  function addCubeGeometryA(x, y, geometry) {
    let material = new THREE.MeshPhysicalMaterial({
      color: 0xff5e14,
      opacity: 0.3,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: 0x333030,
      wireframe: false,
      roughness: 0.5,
      metalness: 0.93,
      reflectivity: 0.7,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    addObject(x, y, mesh);
  }
  function addCubeGeometryB(x, y, geometry) {
    let material = new THREE.MeshPhysicalMaterial({
      color: 0xffc23f,
      opacity: 0.3,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: 0x332332,
      wireframe: false,
      roughness: 0.1,
      metalness: 0.93,
      reflectivity: 0.9,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    addObject(x, y, mesh);
  }

  function Cube(width, height, depth) {
    const i = this.width;
    const k = this.height;
    const j = this.depth;
    addCubeGeometryA(1, -2, new THREE.IcosahedronGeometry((width, height, depth)));
    addCubeGeometryB(1, -2, new THREE.IcosahedronGeometry((width, height, depth)));
  }
  let cubeA = new Cube(1, 1, 1, addCubeGeometryA);
  let cubeC = new Cube(4, 4, 4, addCubeGeometryB);
  let cubeD = new Cube(7, 7, 7, addCubeGeometryA);
  let cubeE = new Cube(10, 10, 10, addCubeGeometryB);
  let cubeG = new Cube(16, 16, 16, addCubeGeometryA);
  let cubeK = new Cube(20, 20, 20, addCubeGeometryB);
  let cubeL = new Cube(25, 25, 25, addCubeGeometryA);
  let cubeN = new Cube(32, 32, 32, addCubeGeometryB);
  let cubeO = new Cube(37, 37, 37, addCubeGeometryA);
  let cubeP = new Cube(45, 45, 45, addCubeGeometryB);
  let cubeJ = new Cube(55, 55, 55, addCubeGeometryA);
  let cubeW = new Cube(75, 75, 75, addCubeGeometryB);
  let cubeV = new Cube(85, 85, 85, addCubeGeometryA);
  let cubeS = new Cube(100, 100, 100, addCubeGeometryB);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 10, 0);
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.update();

  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  let time = performance.now() * 0.0001;
  objects.forEach((obj, ndx) => {
    const speed = 0.1 + ndx * 0.05;
    const rot = time * speed;
    obj.rotation.x = rot;
    obj.rotation.y = rot;
  });
  water.material.uniforms['time'].value += 1.0 / 60.0;
  renderer.render(scene, camera);
}
