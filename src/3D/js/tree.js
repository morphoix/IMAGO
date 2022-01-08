import * as THREE from './libs/three.module.js';
import {EffectComposer} from './libs/EffectComposer.js';
import {RenderPass} from './libs/RenderPass.js';
import {ShaderPass} from './libs/ShaderPass.js';
import {BloomPass} from './libs/BloomPass.js';
import {FilmPass} from './libs/FilmPass.js';
import {FocusShader} from './libs/FocusShader.js';
import {OBJLoader} from './libs/OBJLoader.js';

let scene, camera, composer, renderer, effectFocus;
let parent, mesh, meshLetter;
let meshes = [];
let clonemeshes = [];
let clock = new THREE.Clock();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000104);
  scene.fog = new THREE.FogExp2(0x000104, 0.0000675);

  camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 50000);
  camera.position.set(0, 700, 6500);
  camera.lookAt(scene.position);

  let container = document.querySelector('#scene');
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  container.appendChild(renderer.domElement);

  let loader = new OBJLoader();
  loader.load('/3D/files/Tree.obj', function (object) {
    const positions = combineBuffer(object, 'position');
    createMesh(positions, scene, 200, -500, -350, 0, 0xff790c);
    createMesh(positions, scene, 220, -500, -250, 0, 0xef3e79);
    createMesh(positions, scene, -300, -500, -250, 0, 0x574fef);
  });

  parent = new THREE.Object3D();
  scene.add(parent);
  //text
  const textLoader = new THREE.FontLoader();
  // promisify font loading
  function loadFont(url) {
    return new Promise((resolve, reject) => {
      textLoader.load(url, resolve, undefined, reject);
    });
  }
  async function createText(x, y) {
    const font = await loadFont('./files/helvetiker_regular.typeface.json');
    const geometryText = new THREE.TextBufferGeometry('everything falls apart', {
      font: font,
      size: 100,
      height: 20,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.3,
      bevelSegments: 5,
    });
    meshLetter = new THREE.Mesh(geometryText, new THREE.PointsMaterial({size: 10, color: 0x574fef}));
    meshLetter.position.x = x;
    meshLetter.position.y = y;
    scene.add(meshLetter);
    parent.add(meshLetter);
  }
  createText(-600, -300);

  // postprocessing
  let renderModel = new RenderPass(scene, camera);
  let effectBloom = new BloomPass(0.75);
  let effectFilm = new FilmPass(0.5, 0.5, 1448, false);
  effectFocus = new ShaderPass(FocusShader);
  effectFocus.uniforms['screenWidth'].value = window.innerWidth * window.devicePixelRatio;
  effectFocus.uniforms['screenHeight'].value = window.innerHeight * window.devicePixelRatio;
  composer = new EffectComposer(renderer);
  composer.addPass(renderModel);
  composer.addPass(effectBloom);
  composer.addPass(effectFilm);
  composer.addPass(effectFocus);

  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  camera.lookAt(scene.position);
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  effectFocus.uniforms['screenWidth'].value = window.innerWidth * window.devicePixelRatio;
  effectFocus.uniforms['screenHeight'].value = window.innerHeight * window.devicePixelRatio;
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
    clonemeshes.push({mesh: mesh, speed: 0.2 + Math.random()});
  }
  meshes.push({
    mesh: mesh,
    verticesDown: 0,
    verticesUp: 0,
    direction: 0,
    speed: 0.2,
    delay: Math.floor(200 + 200 * Math.random()),
    start: Math.floor(100 + 200 * Math.random()),
  });
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  let delta = 10 * clock.getDelta();
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
            px + 1.5 * (0.5 - Math.random()) * data.speed * delta,
            py + 3.0 * (0.25 - Math.random()) * data.speed * delta,
            pz + 1.5 * (0.5 - Math.random()) * data.speed * delta
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
  composer.render(0.005);
}
