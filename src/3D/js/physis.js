import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import {OutlineEffect} from './libs/OutlineEffect.js';

let physicsWorld;
let container, scene, dirLight, textureCube, camera, controls, clock, renderer, effect, root;
let rigidBodies = [],
  tmpTrans;
let pointLight, pointLight2;
let ball3;
let colGroupPlane = 1,
  colGroupRedBall = 2,
  colGroupGreenBall = 4;

Ammo().then(start);

function start() {
  tmpTrans = new Ammo.btTransform();
  setupPhysicsWorld();

  init();
  createBlock();
  createBall();
  createMaskBall();
  createJointObjects();

  render();
}
function setupPhysicsWorld() {
  let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
    overlappingPairCache = new Ammo.btDbvtBroadphase(),
    solver = new Ammo.btSequentialImpulseConstraintSolver();

  physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);

  physicsWorld.setGravity(new Ammo.btVector3(0, -40, 0));
}
function init() {
  //create clock for timing
  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9ceaef);
  scene.fog = new THREE.Fog(0xedeec9, 150, 250);
  //create camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.2, 100000);
  camera.position.set(180, 75, 0);
  camera.lookAt(new THREE.Vector3(0, 30, 0));
  //Add directional light
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-10, 150, 30);
  scene.add(dirLight);

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  let d = 50;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 9500;

  let geometry = new THREE.SphereBufferGeometry(2.98, 32, 32);
  let material = new THREE.MeshToonMaterial({
    color: 0xff9f1c,
    emissive: 0xff6700,
    vertexColors: true,
    reflectivity: 0.9,
  });

  let count = geometry.attributes.position.count;
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

  let color = new THREE.Color();
  let positions = geometry.attributes.position;
  let colors = geometry.attributes.color;

  for (let i = 0; i < count; i++) {
    color.setHSL((positions.getY(i) / 3 + 1) / 2, 1.0, 0.5);
    colors.setXYZ(i, color.r, color.g, color.b);
  }

  root = new THREE.Mesh(geometry, material);
  root.position.x = -10;
  root.position.y = -10;
  root.castShadow = true;
  root.receiveShadow = true;
  scene.add(root);

  let amount = 200,
    object,
    parent = root;

  for (var i = 0; i < amount; i++) {
    object = new THREE.Mesh(geometry, material);
    object.position.x = 6;
    parent.add(object);
    parent = object;
  }
  parent = root;

  for (var i = 0; i < amount; i++) {
    object = new THREE.Mesh(geometry, material);
    object.position.x = -6;
    parent.add(object);
    parent = object;
  }
  parent = root;

  for (var i = 0; i < amount; i++) {
    object = new THREE.Mesh(geometry, material);
    object.position.y = 6;
    parent.add(object);
    parent = object;
  }
  parent = root;

  for (var i = 0; i < amount; i++) {
    object = new THREE.Mesh(geometry, material);
    object.position.y = -6;
    parent.add(object);
    parent = object;
  }
  parent = root;

  for (var i = 0; i < amount; i++) {
    object = new THREE.Mesh(geometry, material);
    object.position.z = -6;
    parent.add(object);
    parent = object;
  }
  parent = root;

  for (var i = 0; i < amount; i++) {
    object = new THREE.Mesh(geometry, material);
    object.position.z = 6;
    parent.add(object);
    parent = object;
  }

  //Setup the renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x2b2d42);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;

  effect = new OutlineEffect(renderer);
  material.userData.outlineParameters = {
    thickness: 0.0007,
  };

  window.addEventListener('resize', onWindowResize, false);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function render() {
  controls.update();
  let deltaTime = clock.getDelta();

  let time = Date.now() * 0.0001 + 100;
  let rx = Math.sin(time * 0.7) * 0.2;
  let ry = Math.sin(time * 0.3) * 0.1;
  let rz = Math.sin(time * 0.2) * 0.1;
  root.traverse(function (object) {
    object.rotation.x = rx;
    object.rotation.y = ry;
    object.rotation.z = rz;
  });

  updatePhysics(deltaTime);
  effect.render(scene, camera);
  requestAnimationFrame(render);
}
function createBlock() {
  let pos = {x: 0, y: 0, z: 0};
  let scale = {x: 150, y: 4, z: 150};
  let quat = {x: 0, y: 0, z: 0, w: 1};
  let mass = 0;
  //three mesh
  let planeGeom = new THREE.PlaneGeometry(130, 90, 30, 30);
  let planeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xb1cf5f,
    emissive: 0x1b512d,
    reflectivity: 0.9,
  });
  let blockPlane = new THREE.Mesh(planeGeom, planeMaterial);
  blockPlane.receiveShadow = true;
  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.rotation.x = -0.5 * Math.PI;
  blockPlane.castShadow = true;
  blockPlane.receiveShadow = true;
  scene.add(blockPlane);
  //ammo section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  let motionState = new Ammo.btDefaultMotionState(transform);

  let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
  colShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  colShape.calculateLocalInertia(mass, localInertia);

  let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
  let body = new Ammo.btRigidBody(rbInfo);

  physicsWorld.addRigidBody(body, colGroupPlane, colGroupRedBall);
}
function createBall() {
  let pos = {x: 0, y: 20, z: 0};
  let radius = 25;
  let quat = {x: 0, y: 0, z: 0, w: 1};
  let mass = 1;
  //threeJS section
  let material = new THREE.MeshToonMaterial({
    color: 0xf7b538,
    emissive: 0xdf2935,
    metalness: 0.8,
    vertexColors: true,
    flatShading: true,
    reflectivity: 0.9,
    roughness: 0.2,
  });
  let geom = new THREE.SphereBufferGeometry(radius, 100, 150);
  let ball = new THREE.Mesh(geom, material);

  let count = geom.attributes.position.count;
  geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

  let color = new THREE.Color();
  let positions = geom.attributes.position;
  let colors = geom.attributes.color;

  for (let i = 0; i < count; i++) {
    color.setHSL((positions.getY(i) / radius + 1) / 2, 1.0, 0.5);
    colors.setXYZ(i, color.r, color.g, color.b);
  }

  ball.position.set(pos.x, pos.y, pos.z);
  ball.castShadow = true;
  ball.receiveShadow = true;
  scene.add(ball);
  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  let motionState = new Ammo.btDefaultMotionState(transform);

  let colShape = new Ammo.btSphereShape(radius);
  colShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  colShape.calculateLocalInertia(mass, localInertia);

  let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
  let body = new Ammo.btRigidBody(rbInfo);

  physicsWorld.addRigidBody(body, colGroupRedBall, colGroupPlane | colGroupGreenBall);

  ball.userData.physicsBody = body;
  rigidBodies.push(ball);
}
function createMaskBall() {
  let pos = {x: 1, y: 30, z: 0};
  let radius = 145;
  let quat = {x: 0, y: 0, z: 0, w: 1};
  let mass = 0.5;
  let geom = new THREE.SphereBufferGeometry(radius, 100, 150);
  //threeJS Section
  let ball = new THREE.Mesh(
    geom,
    new THREE.MeshToonMaterial({
      color: 0xeeef20,
      emissive: 0xeb5e28,
      vertexColors: true,
      flatShading: true,
    })
  );
  let count = geom.attributes.position.count;
  geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

  let color = new THREE.Color();
  let positions = geom.attributes.position;
  let colors = geom.attributes.color;

  for (let i = 0; i < count; i++) {
    color.setHSL((positions.getY(i) / radius + 1) / 2, 1.0, 0.5);
    colors.setXYZ(i, color.r, color.g, color.b);
  }
  ball.position.set(pos.x, pos.y, pos.z);
  ball.castShadow = true;
  ball.receiveShadow = true;
  scene.add(ball);
  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  let motionState = new Ammo.btDefaultMotionState(transform);

  let colShape = new Ammo.btSphereShape(radius);
  colShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  colShape.calculateLocalInertia(mass, localInertia);

  let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
  let body = new Ammo.btRigidBody(rbInfo);

  physicsWorld.addRigidBody(body, colGroupGreenBall, colGroupRedBall);

  ball.userData.physicsBody = body;
  rigidBodies.push(ball);
}
function updatePhysics(deltaTime) {
  // Step world
  physicsWorld.stepSimulation(deltaTime, 5);
  // Update rigid bodies
  for (let i = 0; i < rigidBodies.length; i++) {
    let objThree = rigidBodies[i];
    let objAmmo = objThree.userData.physicsBody;
    let ms = objAmmo.getMotionState();
    if (ms) {
      ms.getWorldTransform(tmpTrans);
      let p = tmpTrans.getOrigin();
      let q = tmpTrans.getRotation();
      objThree.position.set(p.x(), p.y(), p.z());
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
  }
}
function createJointObjects() {
  let pos1 = {x: -1, y: 15, z: 0};
  let pos2 = {x: -1, y: 10, z: 0};
  let radius = 15;
  let scale = {x: 2, y: 2, z: 2};
  let quat = {x: 1, y: 0, z: 0, w: 0};
  let mass1 = 0;
  let mass2 = 0.2;

  let transform = new Ammo.btTransform();
  //Sphere Graphics
  let ballGeometry = new THREE.IcosahedronBufferGeometry(14, 1);
  let ballMaterial = new THREE.MeshToonMaterial({
    color: 0x8ac926,
    emissive: 0x8ac926,
    flatShadig: true,
  });
  let ball = new THREE.Mesh(ballGeometry, ballMaterial);

  ball.position.set(pos1.x, pos1.y, pos1.z);
  ball.castShadow = true;
  ball.receiveShadow = true;

  let ball2 = ball.clone();
  ball2.position.y = pos1.y + radius;

  ball3 = ball.clone();
  ball3.position.z = pos1.z + radius + 5;

  let ball4 = ball.clone();
  ball4.position.y = pos1.y + radius;
  ball4.position.z = ball3.position.z + radius;

  let ball5 = ball.clone();
  ball5.position.z = ball4.position.z + radius;

  let ball6 = ball.clone();
  ball6.position.y = pos1.y - radius;
  ball6.position.z = ball5.position.z + radius;

  let ball7 = ball.clone();
  ball7.position.x = pos1.x + radius;
  ball7.position.z = pos1.z - radius;
  scene.add(ball2, ball3, ball4, ball5, ball6, ball7);
  //Sphere Physics
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos1.x, pos1.y, pos1.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  let motionState = new Ammo.btDefaultMotionState(transform);

  let sphereColShape = new Ammo.btSphereShape(radius);
  sphereColShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  sphereColShape.calculateLocalInertia(mass1, localInertia);

  let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass1, motionState, sphereColShape, localInertia);
  let sphereBody = new Ammo.btRigidBody(rbInfo);

  physicsWorld.addRigidBody(sphereBody, colGroupGreenBall, colGroupRedBall);

  ball.userData.physicsBody = sphereBody;
  rigidBodies.push(ball);
  //Block Graphics
  let geom2 = new THREE.IcosahedronBufferGeometry(14, 2);
  let block = new THREE.Mesh(
    geom2,
    new THREE.MeshToonMaterial({
      color: 0xffd23f,
      emissive: 0xfb5607,
      flatShading: true,
      refractionRatio: 0.7,
      reflectivity: 0.7,
      vertexColors: true,
    })
  );

  let count2 = geom2.attributes.position.count;
  geom2.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count2 * 3), 3));

  let color2 = new THREE.Color();
  let positions2 = geom2.attributes.position;
  let colors2 = geom2.attributes.color;

  for (var i = 0; i < count2; i++) {
    color2.setHSL((positions2.getY(i) / radius + 1) / 2, 1.0, 0.5);
    colors2.setXYZ(i, color2.r, color2.g, color2.b);
  }

  block.position.set(pos2.x, pos2.y, pos2.z);
  block.scale.set(scale.x, scale.y, scale.z);
  block.castShadow = true;
  block.receiveShadow = true;
  scene.add(block);
  //Block Physics
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos2.x, pos2.y, pos2.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  motionState = new Ammo.btDefaultMotionState(transform);

  let blockColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
  blockColShape.setMargin(0.05);

  localInertia = new Ammo.btVector3(0, 0, 0);
  blockColShape.calculateLocalInertia(mass2, localInertia);

  rbInfo = new Ammo.btRigidBodyConstructionInfo(mass2, motionState, blockColShape, localInertia);
  let blockBody = new Ammo.btRigidBody(rbInfo);

  physicsWorld.addRigidBody(blockBody, colGroupGreenBall, colGroupRedBall);

  block.userData.physicsBody = blockBody;
  rigidBodies.push(block);

  //Create Joints
  let spherePivot = new Ammo.btVector3(0, -radius, 0);
  let blockPivot = new Ammo.btVector3(-scale.x * 0.5, 1, 1);

  let p2p = new Ammo.btPoint2PointConstraint(sphereBody, blockBody, spherePivot, blockPivot);
  physicsWorld.addConstraint(p2p, false);
}
