import * as THREE from './libs/three.module.js';
import { TrackballControls } from './libs/trackBall.js';

//var-s declaration 
let canvas,
	turretPivot,
	renderer,
	camera,
	controls,
	material,
	scene,
	light,
	aspect, near, far,
	tank,
	body,
	curve,
	splineObject,
	time,
	targetMesh,
	targetOrbit, 
	targetBob, 
	targetElevation,
	target, 
	targetCamera,
	targetCameraPivot,
	points,
	targetPosition,
	tankPosition,
	tankTarget,
	tankCamera,
	turretCamera,
	wheelMeshes;
let cameras = [];

let width = window.innerWidth;
let height = window.innerHeight;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xadb5bd );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xAAAAAA );
    renderer.shadowMap.enabled = true;
    renderer.autoClear = false;
    renderer.setSize( width, height );
    renderer.setPixelRatio( window.devicePixelRatio );

    canvas = document.querySelector('#c');
    canvas.appendChild( renderer.domElement );
	//light
    { 
	    light = new THREE.DirectionalLight( 0xffffff, 1 );
	    light.position.set(1, 2, 4);
	    scene.add( light );
	}
	{
		let light = new THREE.DirectionalLight( 0xffffff, 1 );
	    light.position.set(0, 20, 0);
	    scene.add( light );
	    light.castShadow = true;
	    light.shadow.mapSize.width = 2048;
	    light.shadow.mapSize.height = 2048;

	    let d = 50;
	    light.shadow.camera.left = -d;
	    light.shadow.camera.right = d;
	    light.shadow.camera.top = d;
	    light.shadow.camera.bottom = -d;
	    light.shadow.camera.near = 1;
	    light.shadow.camera.far = 50;
	    light.shadow.bias = 0.001
	}
	//ground
    let groundGeometry = new THREE.PlaneBufferGeometry( 50, 50 );
    let groundMaterial = new THREE.MeshPhongMaterial( {color: 0xeddcd2} );
    let ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.rotation.x = Math.PI * -.5;
    ground.receiveShadow = true;
    scene.add( ground );
	//tank
    let carWidth = 4;
  	let carHeight = 1;
  	let carLength = 8;
    tank = new THREE.Object3D();
    scene.add ( tank );

    let bodyGeom = new THREE.BoxBufferGeometry( carWidth, carHeight, carLength );
    material = new THREE.MeshPhongMaterial( {
    	color: 0x6c757d, 
    	wireframe: true,
    	wireframeLinewidth: 2
    } );
    body = new THREE.Mesh( bodyGeom, material );
    body.position.y = 1.6;
    body.castShadow = true;
    tank.add( body );

	//wheels
    let wheelRadius = 1;
    let wheelThickness = .5;
    let wheelSegments = 8;
    let wheelGeom = new THREE.CylinderBufferGeometry(
    	wheelRadius,
    	wheelRadius,
    	wheelThickness,
    	wheelSegments);

    let wheelPositions = [
	    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2,  carLength / 3],
	    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2,  carLength / 3],
	    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
	    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
	    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
	    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
    ];
    wheelMeshes = wheelPositions.map((position) => {
    	let mesh = new THREE.Mesh( wheelGeom, material );
    	mesh.position.set(...position);
    	mesh.rotation.z = Math.PI * .5;
    	mesh.castShadow = true;
    	body.add( mesh );
    	return mesh;
    });

    let domeRadius = 1.9;
	let domeW = 4;
	let domeH = 4;
	let domePhiStart = 0;
	let domePhiEnd = Math.PI * 2;
	let domeThetaStart = 0;
	let domeThetaEnd = Math.PI * .5;
	let domeGeometry = new THREE.SphereBufferGeometry(
		domeRadius,
		domeW, 
		domeH,
		domePhiStart, 
		domePhiEnd, 
		domeThetaStart, 
		domeThetaEnd);
	let domeMesh = new THREE.Mesh( domeGeometry, material );
	domeMesh.castShadow = true;
	body.add( domeMesh );
	domeMesh.position.y = .5;

	let turretA = .03;
	let turretB = .1;
	let turretLength = carLength * .55 * .24;
	let turretGeometry = new THREE.CylinderBufferGeometry( turretA, turretB, turretLength );
	let turret = new THREE.Mesh( turretGeometry, material );
	turret.castShadow = true;
	turretPivot = new THREE.Object3D();
	turretPivot.scale.set( 5, 5, 5 );
	turretPivot.position.y = 1.4;
	turret.rotation.x = Math.PI * .5;
	turret.position.z = turretLength * .5;
	turretPivot.add( turret );
	body.add( turretPivot );

	targetPosition = new THREE.Vector3();
  	tankPosition = new THREE.Vector2();
 	tankTarget = new THREE.Vector2();

	let targetGeometry = new THREE.SphereBufferGeometry( 1, 12, 12 );
	let targetMat = new THREE.MeshPhongMaterial( {
    	color: 0xe63946, 
    	wireframe: true,
    	wireframeLinewidth: 2
    } );
	targetMesh = new THREE.Mesh( targetGeometry, targetMat );
	targetMesh.castShadow = true;

	targetOrbit = new THREE.Object3D();
	targetElevation = new THREE.Object3D();
	targetBob = new THREE.Object3D();
	scene.add( targetOrbit );

	targetOrbit.add( targetElevation );
	targetElevation.position.z = carLength * 2;
	targetElevation.position.y = 12;
	targetElevation.add( targetBob );
	targetBob.add( targetMesh );
	//cameras
	camera = makeCamera();
    camera.position.set( 8, 4, 10 ).multiplyScalar( 2 );
    camera.lookAt( 0, 0, 0 );

    let tankCameraFov = 75;
    tankCamera = makeCamera( tankCameraFov );
    tankCamera.position.y = 3;
    tankCamera.position.z = -6;
    tankCamera.rotation.y = Math.PI;
    body.add( tankCamera );

	turretCamera = makeCamera();
  	turretCamera.position.y = .75 * .2;
  	turret.add( turretCamera );

	targetCamera = makeCamera();
	targetCameraPivot = new THREE.Object3D();
	targetCamera.position.y = 1;
	targetCamera.position.z = -2;
	targetCamera.rotation.y = Math.PI;
	targetBob.add( targetCameraPivot );
	targetCameraPivot.add( targetCamera );
	cameras.push( camera, turretCamera, tankCamera, targetCamera );
	 // Create the wave
  	curve = new THREE.SplineCurve( [
	    new THREE.Vector2( -10, 0 ),
	    new THREE.Vector2( -5, 5 ),
	    new THREE.Vector2( 0, 0 ),
	    new THREE.Vector2( 5, -5 ),
	    new THREE.Vector2( 10, 0 ),
	    new THREE.Vector2( 5, 10 ),
	    new THREE.Vector2( -5, 10 ),
	    new THREE.Vector2( -10, -10 ),
	    new THREE.Vector2( -15, -8 ),
	    new THREE.Vector2( -10, 0 ) 
	] );
	points = curve.getPoints( 50 );

	const geometry = new THREE.BufferGeometry().setFromPoints( points );
	const pointsMaterial = new THREE.LineBasicMaterial( { color : 0xe63946, linewidth: 5 } );
	const splineObject = new THREE.Line( geometry, pointsMaterial );
	splineObject.rotation.x = Math.PI * .5;
	splineObject.position.y = 0.05;
	scene.add( splineObject );

	createControls( camera );
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
function makeCamera( fov = 40 ) {
	aspect = 2;
    near = 0.1;
    far = 1000;
    return new THREE.PerspectiveCamera( fov, aspect, near, far );
}
function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
}
function render() {
	time = 0.0005 * Date.now();

	wheelMeshes.forEach((obj) => {
      obj.rotation.x = time * 1;
    });

	targetOrbit.rotation.y = time * .3;
    targetBob.position.y = Math.sin(time * 2) * 4;
	targetMesh.rotation.x = time * 0.3;
    targetMesh.rotation.y = time * 0.5;

    let tankTime = time * .05;
    curve.getPointAt( tankTime % 1, tankPosition );
    curve.getPointAt( (tankTime + 0.01) % 1, tankTarget );
    tank.position.set( tankPosition.x, 0, tankPosition.y );
    tank.lookAt( tankTarget.x, 0, tankTarget.y );

    targetMesh.getWorldPosition( targetPosition );
    turretPivot.lookAt( targetPosition );
    turretCamera.lookAt( targetPosition );

	let camera = cameras[time * .25 % cameras.length | 0];
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.render( scene, camera );
}

init();
animate();
