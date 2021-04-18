import * as THREE from './libs/three.module.js';
import { OBJLoader } from './libs/OBJLoader.js';
import { TrackballControls } from './libs/trackBall.js';

let scene, renderer, container, camera;
let controls, sound, listener;
let spotLight1, spotLight2, strawberry, material, object;
let objects = [];
let group;
let line, lineMaterial;

function init() {
	//loading the objects
	let onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		let percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
		}
	};
	let onError = function () {};
	let manager = new THREE.LoadingManager();
	//background
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x94a89a );
	scene.fog = new THREE.Fog( 0x94a89a, -1000, 3000 );

	renderer = new THREE.WebGLRenderer({ antialias: true } );

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;

	container = document.getElementById( 'c' );
	container.appendChild( renderer.domElement );
	camera = new THREE.PerspectiveCamera( 
		45, 
		window.innerWidth / window.innerHeight, 
		0.1, 
		3000 );
	camera.position.set ( 200, 150, 200 );
	camera.lookAt ( 0, 0, 0 );
	//LIGHTS
	let light = new THREE.DirectionalLight( 0xedbbce, 0.2 );
	light.castShadow = true;

	spotLight1 = new THREE.SpotLight(0xedaf97, 0.8 );
	spotLight1.position.set( 5, 120, 0 );
	spotLight1.lookAt( 0, 0, 0 );
	spotLight1.castShadow = true;

	spotLight2 = new THREE.SpotLight(0xf6bdd1, 0.8 );
	spotLight2.position.set( 10, 50, -30 );
	spotLight2.castShadow = true;
	scene.add ( light, spotLight1, spotLight2 );


	let planeGeom = new THREE.PlaneGeometry( 2000, 2000, 30, 30 );
	let planeMaterial = new THREE.MeshPhongMaterial({
		color: 0xed71a1,
		emissive: 0xb48291,
		specular: 0xa3a3a3,
		shininess: 12
	});
	let plane = new THREE.Mesh(planeGeom, planeMaterial);
	plane.receiveShadow = true;
	plane.position.set(0, -65, -20);
	plane.rotation.x = -0.5 * Math.PI;

	let grid = new THREE.Points( 
		new THREE.PlaneBufferGeometry( 2000, 2000, 256, 256 ), 
		new THREE.PointsMaterial({ color: 0xed71a1, size: 2 }));
	grid.position.y = -64;
	grid.rotation.x = Math.PI / 2;
	scene.add ( plane, grid );

	material = new THREE.MeshPhysicalMaterial ({
		color: 0xef8dbe,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.9,
		emissive: 0x2b2b2b,
		roughness: 0.3,
		metalness: 0.99,
		reflectivity: 0.9 });

	lineMaterial = new THREE.MeshPhysicalMaterial ({
		color: 0x2b2b2b,
		side: THREE.DoubleSide,
		emissive: 0x57725d,
		roughness: 0.1,
		metalness: 0.99,
		reflectivity: 0.9 });

	let loader = new OBJLoader( manager );
	loader.setPath( '' );
	loader.load( '/3D/files/strawberry.obj', function ( object ) {
		let strawberry = object.children[ 0 ];
		strawberry.scale.multiplyScalar( 18 );
		strawberry.position.set( 0, 0, 0 );
		strawberry.castShadow = true;
		strawberry.receiveShadow = true;
		strawberry.rotation.x = -1.5;
		strawberry.material = material;

		let strawberry2 = strawberry.clone();
		strawberry2.position.set ( 0, 0, -55 );
		let strawberry3 = strawberry.clone();
		strawberry3.position.set ( 0, 0, 55 );
		let strawberry4 = strawberry.clone();
		strawberry4.position.set ( 0, 0, 110 );
		let strawberry5 = strawberry.clone();
		strawberry5.position.set ( 0, 0, 165 );

		scene.add( 
			strawberry,
			strawberry2, 
			strawberry3,
			strawberry4,
			strawberry5 );

		onProgress;
		onError() });

	let line1 = addLine( 10, 180, -10 );
	addLine( 10, 180, -65 );
	addLine( 10, 180, 45 );
	addLine( 10, 180, 100 );
	addLine( 10, 180, 155 );

	createControls( camera );
	window.addEventListener( 'resize', onWindowResize, false );
}
function createControls( camera ) {
	controls = new TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.1;
	controls.zoomSpeed = 0.1;
	controls.panSpeed = 0.1;
	controls.keys = [ 65, 83, 68 ];
	controls.maxDistance = 600;
	controls.maxPolarAngle = Math.PI * 0.295;
}
function addLine ( x, y, z ) {
	let geometry = new THREE.CylinderGeometry(
	3, 1.7, 230, 10, 2, true );
	line = new THREE.Mesh( geometry, lineMaterial );
	line.castShadow = true;
	line.receiveShadow = true;
	line.position.set( x, y, z );
	scene.add( line );
	return line;
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	camera.lookAt( scene.position );
	renderer.setSize( window.innerWidth, window.innerHeight );
	createControls( camera );
}
function animate() {
	requestAnimationFrame( animate );
	controls.update();
	render();
}
function render() {
	let lightTime = Date.now() * 0.0001;
	let d = 200;
	spotLight1.position.x = Math.sin( lightTime * 0.7 ) * d;
	spotLight2.position.z = Math.cos( lightTime * 0.3 ) * d;
	renderer.render( scene, camera );
}
init();
animate();