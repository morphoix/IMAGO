import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import {OBJLoader} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js';
import {DragControls} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/DragControls.js';
import {Water} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/objects/Water.js';

import {EffectComposer} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js';

let startButton = document.getElementById('startButton');
startButton.addEventListener('click', hide);
function hide() {
  document.getElementById('overlay').style.display = 'none';
}

let scene, renderer, container, camera, composer;
let controls, sound, listener;
let pointLight, pointLight2, textureCube, hall, heart, chest;
let objects = [];
let mesh, bones, skeletonHelper, segmentCount;
let artery;
let params = {
  exposure: 1,
  bloomStrength: 0.005,
  bloomThreshold: 0,
  bloomRadius: 0.3,
};

function init() {
  //loading the objects
  let onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      let percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };
  let onError = function () {};
  let manager = new THREE.LoadingManager();
  //background
  let urls = [
    '/3D/files/texture/px(2).jpg',
    '/3D/files/texture/nx(2).jpg',
    '/3D/files/texture/py(2).jpg',
    '/3D/files/texture/ny(2).jpg',
    '/3D/files/texture/pz(2).jpg',
    '/3D/files/texture/nz(2).jpg',
  ];

  textureCube = new THREE.CubeTextureLoader(manager).load(urls);
  textureCube.mapping = THREE.CubeRefractionMapping;
  textureCube.minFilter = THREE.NearestFilter;
  scene = new THREE.Scene();
  scene.background = textureCube;

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(new THREE.Color(0xffffff));
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;

  container = document.getElementById('c');
  container.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 7000);
  camera.position.set(750, 250, 300);
  camera.lookAt(160, -100, -110);
  //LIGHTS
  let shining = new THREE.DirectionalLight(0xe0a34e, 6);
  shining.lookAt(350, 100, -500);

  pointLight = new THREE.PointLight(0xe07700, 3);
  pointLight.castShadow = true;

  pointLight2 = new THREE.PointLight(0x6800e0, 3);
  pointLight2.castShadow = true;

  scene.add(shining, pointLight, pointLight2);
  //HALL
  let hallGeometry = new THREE.SphereBufferGeometry(3000, 100, 2, 2, 8, 3, 3);
  hall = new Water(hallGeometry, {
    flowDirection: new THREE.Vector2(1, 1),
    textureWidth: 1024,
    textureHeight: 1024,
  });
  hall.position.y = -2050;
  hall.receiveShadow = true;
  scene.add(hall);
  //Hope
  let textureHope = new THREE.TextureLoader().load('/3D/files/hope.png');
  textureHope.wrapS = THREE.RepeatWrapping;
  textureHope.wrapT = THREE.RepeatWrapping;
  textureHope.repeat.set(4, 1);

  let cube = new THREE.SphereBufferGeometry(60, 20, 20);
  let cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    refractionRatio: 0.95,
    reflectivity: 0.3,
    map: textureHope,
  });
  let hope = new THREE.Mesh(cube, cubeMaterial);
  hope.position.set(350, 100, -500);
  hope.castShadow = true;
  objects.push(hope);
  scene.add(hope);
  //HEART
  let heartMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    refractionRatio: 0.95,
    reflectivity: 0.99,
    skinning: true,
    envMap: textureCube,
  });

  let objLoader = new OBJLoader(manager);
  objLoader.setPath('');
  objLoader.load('/3D/files/heart.obj', function (object) {
    heart = object.children[0];
    heart.scale.multiplyScalar(22);
    heart.material = heartMaterial;
    heart.position.set(160, -100, -60);
    heart.rotation.y = 2;
    heart.castShadow = true;
    scene.add(heart);
  });
  //CHEST
  let chestMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    refractionRatio: 0.95,
    reflectivity: 0.85,
    combine: THREE.MixOperation,
    skinning: true,
    envMap: textureCube,
  });
  let objLoader2 = new OBJLoader(manager);
  objLoader2.setPath('');
  objLoader2.load('/3D/files/chest.obj', function (object) {
    chest = object.children[0];
    chest.scale.multiplyScalar(23);
    chest.material = chestMaterial;
    chest.position.y = -200;
    chest.rotation.x = -Math.PI * 0.5;
    chest.rotation.z = 2;
    chest.castShadow = true;
    scene.add(chest);
  });
  //VEINS
  let artery1 = createArtery(41, 260, -30);
  artery1.rotation.x = -6;
  let artery2 = createArtery(82, 260, -61);
  let artery3 = createArtery(125, 260, -78);
  artery3.rotation.x = -0.2;
  let artery4 = createArtery(76, -23, -308);
  artery4.rotation.x = 4.7;
  let artery5 = createArtery(68, -52, -297);
  artery5.rotation.x = 4.73;
  let artery6 = createBigArtery(135, 262, 72);
  artery6.rotation.x = -6;
  let artery7 = createBigArtery(79, 40, 215);
  artery7.rotation.x = -4.7;
  let artery8 = createBigArtery(47, 5, -313);
  artery8.rotation.x = 4.5;
  //beat
  let audioLoader = new THREE.AudioLoader();
  listener = new THREE.AudioListener();
  sound = new THREE.Audio(listener);

  audioLoader.load('/3D/files/beat.ogg', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(1);
  });
  camera.add(listener);
  //poostprocessing
  let renderScene = new RenderPass(scene, camera);

  let bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  //Dragging
  let dragControls = new DragControls(objects, camera, renderer.domElement);

  dragControls.addEventListener('dragstart', function (event) {
    event.object.material.color.set(0xe08200);
  });
  dragControls.addEventListener('dragend', function (event) {
    sound.play();
    heart.material.color.set(0xe08200);
    heart.scale.multiplyScalar(1.1);
    bloomPass.strength = 0.32;
  });

  initBones();
  window.addEventListener('resize', onWindowResize, false);
}
function createArtery(x, y, z) {
  let vein = new THREE.CylinderGeometry(8, 8, 300, 10, 2, true);
  let veinMaterial = new THREE.MeshLambertMaterial({
    color: 0xfcac0c,
    refractionRatio: 0.95,
    reflectivity: 0.99,
    skinning: true,
    wireframe: true,
    envMap: textureCube,
  });
  let artery = new THREE.Mesh(vein, veinMaterial);
  artery.position.set(x, y, z);
  scene.add(artery);
  return artery;
}
function createBigArtery(x, y, z) {
  let vein2 = new THREE.CylinderGeometry(16, 18, 400, 20, 2, true);
  let arteryMaterial = new THREE.MeshLambertMaterial({
    color: 0x400cfc,
    refractionRatio: 0.95,
    reflectivity: 0.99,
    skinning: true,
    wireframe: true,
    envMap: textureCube,
  });
  let bigArtery = new THREE.Mesh(vein2, arteryMaterial);
  bigArtery.position.set(x, y, z);
  scene.add(bigArtery);
  return bigArtery;
}
function createGeometry(sizing) {
  let geometry = new THREE.CylinderBufferGeometry(
    4, //radiusTop
    4, //radiusBottom
    sizing.height, //height
    50, //radiusSegments
    sizing.segmentCount * 3, //heightSegments
    false //openEnded
  );
  let position = geometry.attributes.position;
  let vertex = new THREE.Vector3();

  let skinIndices = [];
  let skinWeights = [];

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    let y = vertex.y + sizing.halfHeight;
    let skinIndex = Math.floor(y / sizing.segmentHeight);
    let skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;
    skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
  return geometry;
}
function createBones(sizing) {
  bones = [];
  let prevBone = new THREE.Bone();
  bones.push(prevBone);
  prevBone.position.y = -sizing.halfHeight;

  for (let i = 0; i < segmentCount; i++) {
    let bone = new THREE.Bone();
    bone.position.y = sizing.segmentHeight + 5;
    bones.push(bone);
    prevBone.add(bone);
    prevBone = bone;
  }
  return bones;
}
function initBones() {
  let segmentHeight = 200;
  let segmentCount = 5;
  let height = segmentCount * segmentHeight;
  let halfHeight = height * 0.5;

  let sizing = {
    segmentHeight: segmentHeight,
    segmentCount: segmentCount,
    height: height,
    halfHeight: halfHeight,
  };
  let geometry = createGeometry(sizing);
  let bones = createBones(sizing);
  let material = new THREE.MeshPhongMaterial({
    skinning: true,
    color: 0xfcac0c,
    emissive: 0x6b485b,
    envMap: textureCube,
    reflectivity: 0.9,
    shininess: 2,
    specular: 0x14a3e5,
    side: THREE.DoubleSide,
    flatShading: true,
  });

  for (let i = 0; i < 85; i++) {
    let mesh = new THREE.SkinnedMesh(geometry, material);
    let skeleton = new THREE.Skeleton(bones);
    mesh.add(bones[0]);
    mesh.bind(skeleton);
    mesh.position.x = 300;
    mesh.position.y = 100;
    mesh.position.z = Math.random() * 5000 - 1000;
    mesh.scale.multiplyScalar(2);
    mesh.castShadow = true;
    scene.add(mesh);
  }
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  camera.lookAt(scene.position);
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  let time = Date.now() * 0.0001;
  for (let i = 0; i < bones.length; i++) {
    bones[i].rotation.x = (Math.sin(time) * 2) / bones.length;
    bones[i].rotation.y = (Math.sin(time) * 2) / bones.length;
    bones[i].rotation.z = (Math.sin(time) * 2) / bones.length;
  }
  let lightTime = Date.now() * 0.0002;
  let d = 600;
  pointLight.position.x = Math.sin(lightTime * 0.7) * d;
  pointLight.position.z = Math.cos(lightTime * 0.3) * d;

  hall.rotation.y += 0.001;

  composer.render();
}
init();
animate();
