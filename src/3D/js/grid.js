import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js';

var container, controls;
var textureCube, camera, scene, raycaster, renderer;
let treeMaterial, tree, sun;

var mouse = new THREE.Vector2(),
  INTERSECTED;
let ww = window / innerWidth;
let wh = window / innerHeight;

let boxes = [];

function init() {
  let manager = new THREE.LoadingManager();

  scene = new THREE.Scene();
  container = document.createElement('c');
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

  camera.lookAt(0, 0, 0);
  camera.position.set(70, 0, 0);

  sun = new THREE.DirectionalLight(0xffb627, 1);
  sun.position.set(0, 90, 0);
  sun.lookAt(-20, -37, -35);

  let light = new THREE.HemisphereLight(0xf6fff8, 0xcce3de, 0.95);
  light.position.set(0.5, 1, 0.75);
  scene.add(sun, light);

  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setClearColor(new THREE.Color(0xffffff));
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  treeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x70ae6e,
    emissive: 0x4280b,
    roughness: 0.5,
    metalness: 1,
    clearcoat: 0.03,
    clearcoatRoughness: 0.03,
  });

  let objLoader = new OBJLoader(manager);
  objLoader.setPath('');
  objLoader.load('/3D/files/tree.obj', function (object) {
    tree = object.children[0];
    tree.material = treeMaterial;
    tree.scale.multiplyScalar(6);
    tree.position.set(-20, -37, -35);
    tree.rotation.x = 0.1;
    tree.rotation.y = 0.5;
    tree.castShadow = true;
    tree.receiveShadow = true;
    scene.add(tree);
  });

  controls.update();
  createObj();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}
function createObj() {
  let geometry = new THREE.BoxBufferGeometry(0.75, 0.75, 0.75);
  for (let i = 0; i < 2000; i++) {
    let mosaic = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
      })
    );
    mosaic.position.x = 0;
    mosaic.position.y = Math.floor(Math.random() * 28 - 10);
    mosaic.position.z = Math.floor(Math.random() * 48 - 10);
    mosaic.castShadow = true;
    scene.add(mosaic);
    boxes.push(mosaic);
  }
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  controls.update();

  let lightTime = Date.now() * 0.0002;
  let d = 600;
  sun.position.x = Math.sin(lightTime * 0.3) * d;
  sun.position.z = Math.cos(lightTime * 0.7) * d;
  tree.rotation.y += 0.001;

  // find intersections
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(boxes);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.color.set(0xbce784);
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.color.set(INTERSECTED.currentColor);
    INTERSECTED = null;
  }
  renderer.render(scene, camera);
}
init();
animate();
