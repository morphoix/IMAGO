import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

const views = [];
let scene;
let renderer;

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let spheres = [];

init();
animate();

function View(canvas, fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight) {
  canvas.width = viewWidth * window.devicePixelRatio;
  canvas.height = viewHeight * window.devicePixelRatio;

  const context = canvas.getContext('2d');

  const camera = new THREE.PerspectiveCamera(45, viewWidth / viewHeight, 1, 10000);
  camera.setViewOffset(fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight);
  camera.position.z = 200;

  this.render = function () {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.setViewport(0, fullHeight - viewHeight, viewWidth, viewHeight);
    renderer.render(scene, camera);
    context.drawImage(renderer.domElement, 0, 0);
  };
}

function init() {
  const canvas1 = document.getElementById('canvas1');
  const canvas2 = document.getElementById('canvas2');
  const canvas3 = document.getElementById('canvas3');
  const canvas4 = document.getElementById('canvas4');
  const canvas5 = document.getElementById('canvas5');

  let fullWidth = 300;
  let fullHeight = 675;

  views.push(new View(canvas1, fullWidth, fullHeight, 0, 0, canvas1.clientWidth, canvas1.clientHeight));
  views.push(new View(canvas2, fullWidth, fullHeight, 70, 150, canvas2.clientWidth, canvas2.clientHeight));
  views.push(new View(canvas3, fullWidth, fullHeight, 50, 230, canvas3.clientWidth, canvas3.clientHeight));
  views.push(new View(canvas4, fullWidth, fullHeight, 100, 275, canvas4.clientWidth, canvas4.clientHeight));
  views.push(new View(canvas5, fullWidth, fullHeight, 50, 375, canvas5.clientWidth, canvas5.clientHeight));

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5cac3);

  let light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 0, 1).normalize();

  let spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 400, 0);

  scene.add(light, spotLight);

  let radius = 20;

  const geometry = new THREE.TetrahedronGeometry(radius, 32);

  for (let i = 0; i < 35; i++) {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xdb222a,
      transparent: true,
      opacity: 0.85,
      emissive: 0x053c5e,
      roughness: 0.8,
      clearcoat: 0.1,
      metalness: 0.7,
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 200 - 50;
    mesh.position.y = Math.random() * 240 - 30;
    mesh.position.z = Math.random() * 160 - 40;
    scene.add(mesh);
    spheres.push(mesh);
  }

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(fullWidth, fullHeight);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
}
function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}
function animate() {
  for (var i = 0; i < views.length; ++i) {
    views[i].render();
  }
  requestAnimationFrame(animate);
}
