import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 100,
    heightSegments: 200,
  },
};

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  // vertice position randomization
  const {array} = planeMesh.geometry.attributes.position;
  const randomValues = [];
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i + 1];
      const y = array[i + 2];
      const z = array[i + 1];

      array[i] = x + (Math.random() - 0.5) * 3;
      array[i + 1] = y + (Math.random() - 0.5) * 3;
      array[i + 2] = z + (Math.random() - 0.5) * 3;
    }

    randomValues.push(Math.random() * Math.PI * 2);
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues;
  planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;

  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0.6, 0.37, 0.3);
  }

  planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
}

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x272640);
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

camera.position.x = -8;
camera.position.z = 0;

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);

const planeMaterial = new THREE.MeshPhysicalMaterial({
  side: THREE.FontSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
  emissive: 0x6d23b6,
  metalness: 0.9,
  roughness: 0.5,
  transparent: true,
  opacity: 0.7,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
generatePlane();

const light = new THREE.DirectionalLight(0xff9e00, 4);
light.position.set(0, -1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);

  frame += 0.01;

  const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.001;
    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.001;
  }

  planeMesh.geometry.attributes.position.needsUpdate = true;

  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const {color} = intersects[0].object.geometry.attributes;
    // vertice 1
    color.setX(intersects[0].face.a, 0.3);
    color.setY(intersects[0].face.a, 0.3);
    color.setZ(intersects[0].face.a, 1);
    // vertice 2
    color.setX(intersects[0].face.b, 0.9);
    color.setY(intersects[0].face.b, 0.9);
    color.setZ(intersects[0].face.b, 1);
    // vertice 3
    color.setX(intersects[0].face.c, 0.9);
    color.setY(intersects[0].face.c, 0.9);
    color.setZ(intersects[0].face.c, 1);

    intersects[0].object.geometry.attributes.color.needsUpdate = true;
  }
}

animate();

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
