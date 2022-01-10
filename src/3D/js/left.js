import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import {OBJLoader} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js';
import {EffectComposer} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const views = [];
let scene;
let composer, renderer, camera, effectFocus;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let spheres = [];
let mouseX = 0;
let mouseY = 0;
let mesh;
let parent;
let meshes = [];
let clonemeshes = [];
let context;
let clock = new THREE.Clock();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000104);
  scene.fog = new THREE.FogExp2(0x000104, 0.0000675);
  const canvas = document.getElementById('canvas2');
  context = canvas.getContext('2d');

  let fullWidth = 300;
  let fullHeight = window.innerHeight;
  let viewWidth = 300;
  let viewHeight = window.innerHeight;

  canvas.width = viewWidth * window.devicePixelRatio;
  canvas.height = viewHeight * window.devicePixelRatio;

  camera = new THREE.PerspectiveCamera(45, viewWidth / viewHeight, 1, 10000);

  camera.position.set(-2000, 500, 200);
  camera.lookAt(scene.position);

  let loader = new OBJLoader();
  loader.load('/3D/files/Tree.obj', function (object) {
    const positions = combineBuffer(object, 'position');
    createMesh(positions, scene, -250, 100, 350, -700, 0x0f0c4f);
    createMesh(positions, scene, -250, 100, 400, -800, 0xf48b02);
  });

  parent = new THREE.Object3D();
  scene.add(parent);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(fullWidth, fullHeight);
  renderer.setViewport(0, fullHeight - viewHeight, viewWidth, viewHeight);

  let params = {
    exposure: 1,
    bloomStrength: 0.9,
    bloomThreshold: 0,
    bloomRadius: 0.8,
  };
  let renderScene = new RenderPass(scene, camera);
  let bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.8, 0.85);
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
}
function combineBuffer(model, bufferName) {
  let count = 0;
  model.traverse(function (child) {
    if (child.isMesh) {
      let buffer = child.geometry.attributes[bufferName];
      count += buffer.array.length;
    }
  });
  let combined = new Float32Array(count);
  let offset = 0;
  model.traverse(function (child) {
    if (child.isMesh) {
      let buffer = child.geometry.attributes[bufferName];
      combined.set(buffer.array, offset);
      offset += buffer.array.length;
    }
  });
  return new THREE.BufferAttribute(combined, 3);
}
function createMesh(positions, scene, scale, x, y, z, color) {
  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', positions.clone());
  geometry.setAttribute('initialPosition', positions.clone());
  geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  let clones = [[500, 0, -300]];
  for (let i = 0; i < clones.length; i++) {
    let c = i < clones.length - 1 ? 0x4500d1 : color;
    mesh = new THREE.Points(geometry, new THREE.PointsMaterial({size: 10, color: c}));
    mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
    mesh.position.x = x + clones[i][0];
    mesh.position.y = y + clones[i][1];
    mesh.position.z = z + clones[i][2];
    parent.add(mesh);
    clonemeshes.push({mesh: mesh, speed: 0.03 + Math.random()});
  }
  meshes.push({
    mesh: mesh,
    verticesDown: 0,
    verticesUp: 0,
    direction: 0,
    speed: 0.08,
    delay: Math.floor(200 + 200 * Math.random()),
    start: Math.floor(100 + 200 * Math.random()),
  });
}

function animate() {
  render();
  requestAnimationFrame(animate);
}
function render() {
  let delta = 20 * clock.getDelta();
  delta = delta < 2 ? delta : 2;

  for (let j = 0; j < meshes.length; j++) {
    let data = meshes[j];
    let positions = data.mesh.geometry.attributes.position;
    let initialPositions = data.mesh.geometry.attributes.initialPosition;
    let count = positions.count;
    if (data.start > 0) {
      data.start -= 1;
    } else {
      if (data.direction === 0) {
        data.direction = -1;
      }
    }
    for (let i = 0; i < count; i++) {
      let px = positions.getX(i);
      let py = positions.getY(i);
      let pz = positions.getZ(i);
      // falling down
      if (data.direction < 0) {
        if (py > 0) {
          positions.setXYZ(
            i,
            px + 1.5 * (0.8 - Math.random()) * data.speed * delta,
            py + 3.0 * (0.55 - Math.random()) * data.speed * delta,
            pz + 1.5 * (0.8 - Math.random()) * data.speed * delta
          );
        } else {
          data.verticesDown += 1;
        }
      }
      // rising up
      if (data.direction > 0) {
        let ix = initialPositions.getX(i);
        let iy = initialPositions.getY(i);
        let iz = initialPositions.getZ(i);
        let dx = Math.abs(px - ix);
        let dy = Math.abs(py - iy);
        let dz = Math.abs(pz - iz);
        let d = dx + dy + dx;
        if (d > 1) {
          positions.setXYZ(
            i,
            px - ((px - ix) / dx) * data.speed * delta * (0.99 - Math.random()),
            py - ((py - iy) / dy) * data.speed * delta * (1 + Math.random()),
            pz - ((pz - iz) / dz) * data.speed * delta * (0.99 - Math.random())
          );
        } else {
          data.verticesUp += 1;
        }
      }
    }
    // all vertices down
    if (data.verticesDown >= count) {
      if (data.delay <= 0) {
        data.direction = 1;
        data.speed = 0.01;
        data.verticesDown = 0;
        data.delay = 10;
      } else {
        data.delay -= 1;
      }
    }
    positions.needsUpdate = true;
  }
  composer.render(0.01);
  context.drawImage(renderer.domElement, 0, 0);
}
