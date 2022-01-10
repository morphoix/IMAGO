import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import {RectAreaLightUniformsLib} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {Lensflare, LensflareElement} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/objects/Lensflare.js';

window.onload = init();

function init() {
  let scene = new THREE.Scene();
  let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

  RectAreaLightUniformsLib.init();

  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  let controlsOrbit = new OrbitControls(camera, renderer.domElement);
  camera.position.set(40, 20, 70);
  controlsOrbit.maxPolarAngle = Math.PI * 0.395;
  controlsOrbit.minDistance = 100.0;
  controlsOrbit.maxDistance = 120.0;

  let textureLoader = new THREE.TextureLoader();
  let textureFlare0 = textureLoader.load('/3D/files/lensflare0.png');
  let textureFlare3 = textureLoader.load('/3D/files/lensflare3.png');
  addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
  addLight(0.08, 0.8, 0.5, 0, 0, -1000);
  addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

  const textLoader = new THREE.FontLoader();

  let parent = new THREE.Object3D();
  scene.add(parent);
  // promisify font loading
  function loadFont(url) {
    return new Promise((resolve, reject) => {
      textLoader.load(url, resolve, undefined, reject);
    });
  }

  function addObject(x, y, obj) {
    obj.position.x = x;
    obj.position.y = y;
    scene.add(obj);
  }
  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });
  }
  function addLight(h, s, l, x, y, z) {
    let light = new THREE.PointLight(0xffffff, 1.5, 6000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);
    let lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    light.add(lensflare);
  }

  let plane = new THREE.PlaneGeometry(1000, 1000, 1, 1);
  let planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e1229,
    side: THREE.DoubleSide,
  });
  let ground = new THREE.Mesh(plane, planeMaterial);
  ground.rotation.x = -0.5 * Math.PI;
  ground.position.set(15, 0, 0);

  let grid = new THREE.Points(
    new THREE.PlaneBufferGeometry(1000, 1000, 300, 120),
    new THREE.PointsMaterial({color: 0xa05411, size: 0.1})
  );
  grid.position.set(15, 1, 0);
  grid.rotation.x = Math.PI / 2;

  let ambientLight = new THREE.AmbientLight(0xffffff);

  let width = 40;
  let height = 40;
  let intensity = 10;
  let areaLight1 = new THREE.RectAreaLight(0xffff00, intensity, width, height);
  areaLight1.position.set(2, 9, -5);
  areaLight1.rotation.set(-Math.PI / 2, 0, 0);
  let areaLight2 = new THREE.RectAreaLight(0xff4500, intensity, width, height);
  areaLight2.position.set(-17, 9, 20);
  areaLight2.rotation.set(-Math.PI / 2, 0, 0);
  let areaLight3 = new THREE.RectAreaLight(0xc71585, intensity, width, height);
  areaLight3.position.set(30, 9, -29);
  areaLight3.rotation.set(-Math.PI / 2, 0, 0);

  let target = new THREE.Object3D();
  let pointColor = '#0335b1';
  let spotLight = new THREE.SpotLight(pointColor);
  spotLight.position.set(-40, 120, -10);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 2;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.camera.fov = 30;
  spotLight.target = ground;
  spotLight.distance = 0;
  spotLight.angle = 1.77;

  let textureMoon = new THREE.TextureLoader().load('/3D/files/moon.jpg');
  textureMoon.wrapS = THREE.RepeatWrapping;
  textureMoon.wrapT = THREE.RepeatWrapping;
  textureMoon.repeat.set(1, 1);

  let sphereLight = new THREE.SphereGeometry(2, 20, 20);
  let laghtM = new THREE.MeshBasicMaterial({color: 0xfe083c, map: textureMoon});
  let sphereLightMesh = new THREE.Mesh(sphereLight, laghtM);
  sphereLightMesh.receiveShadow = true;

  scene.add(ground, grid, ambientLight, areaLight1, areaLight2, areaLight3, spotLight, sphereLightMesh);

  let step = 0;
  let phase = 2;
  let invert = 1;

  let texturePyramid = new THREE.TextureLoader().load('/3D/files/stone1.png');
  texturePyramid.wrapS = THREE.RepeatWrapping;
  texturePyramid.wrapT = THREE.RepeatWrapping;
  texturePyramid.repeat.set(4, 4);
  let material = new THREE.MeshBasicMaterial({map: texturePyramid, transparent: true});

  let geom1 = new THREE.OctahedronGeometry(7);
  let pyramid1 = new THREE.Mesh(geom1, material);
  pyramid1.castShadow = true;
  pyramid1.rotation.y = -4;
  pyramid1.position.set(-17, 0, 20);

  let geom2 = new THREE.OctahedronGeometry(12);
  let pyramid2 = new THREE.Mesh(geom2, material);
  pyramid2.castShadow = true;
  pyramid2.rotation.y = -4;
  pyramid2.position.set(2, 0, -5);

  let geom3 = new THREE.OctahedronGeometry(15);
  let pyramid3 = new THREE.Mesh(geom3, material);
  pyramid3.castShadow = true;
  pyramid3.rotation.y = -4;
  pyramid3.position.set(32, 0, -29);

  let geom4 = new THREE.OctahedronGeometry(3);
  let pyramid4 = new THREE.Mesh(geom4, material);
  pyramid4.castShadow = true;
  pyramid4.rotation.y = -4;
  pyramid4.position.set(-18, 0, 29);

  let geom5 = new THREE.OctahedronGeometry(2);
  let pyramid5 = new THREE.Mesh(geom5, material);
  pyramid5.castShadow = true;
  pyramid5.rotation.y = -4;
  pyramid5.position.set(-23, 0, 29);

  let pyramid6 = new THREE.Mesh(geom5, material);
  pyramid6.castShadows = true;
  pyramid6.rotation.y = -4;
  pyramid6.position.set(-27, 0, 29);

  let geom7 = new THREE.OctahedronGeometry(4);
  let pyramid7 = new THREE.Mesh(geom7, material);
  pyramid7.castShadow = true;
  pyramid7.rotation.y = -4;
  pyramid7.position.set(48, 0, -27);

  let pyramid8 = new THREE.Mesh(geom7, material);
  pyramid8.castShadow = true;
  pyramid8.rotation.y = -4;
  pyramid8.position.set(48, 0, -21);

  let pyramid9 = new THREE.Mesh(geom7, material);
  pyramid9.castShadow = true;
  pyramid9.rotation.y = -4;
  pyramid9.position.set(48, 0, -15);

  scene.add(pyramid1, pyramid2, pyramid3, pyramid4, pyramid5, pyramid6, pyramid7, pyramid8, pyramid9);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x0));
  renderer.shadowMap.enabled = true;
  document.getElementById('threeOutput').appendChild(renderer.domElement);

  function render() {
    requestAnimationFrame(render);
    if (phase > 2 * Math.PI) {
      invert = invert * -1;
      phase -= 2 * Math.PI;
    } else {
      phase += 0.005;
    }
    sphereLightMesh.position.z = +(14 * Math.sin(phase));
    sphereLightMesh.position.x = +(14 * Math.cos(phase));
    sphereLightMesh.position.y = 20;

    if (invert < 0) {
      let pivot = 14;
      sphereLightMesh.position.x = invert * (sphereLightMesh.position.x - pivot) + pivot;
    }
    spotLight.position.copy(sphereLightMesh.position);
    controlsOrbit.update();
    renderer.render(scene, camera);
  }
  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onWindowResize, false);
  render();
}
