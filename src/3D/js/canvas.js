import * as THREE from './libs/three.module';
import { OBJLoader } from './libs/OBJLoader.js';

let box = document.createElement( 'div' );
box.id = 'box';
document.body.appendChild( box );
box.style.margin = '0px';

let canvas1 = document.createElement( 'canvas' );
canvas1.id = 'canvas1';
box.appendChild( canvas1 );
canvas1.style.width = '12%';
canvas1.style.top = '35%';
canvas1.style.height = '55%';
canvas1.style.left = '0px';
canvas1.style.borderBottom = 'none';

let canvas2= document.createElement( 'canvas' );
canvas2.id = 'canvas2';
box.appendChild( canvas2 );
canvas2.style.width = '50%';
canvas2.style.height = '15%';
canvas2.style.left = '22%';
canvas2.style.bottom = '0px';
canvas2.style.borderRight = 'none';

let canvas3 = document.createElement( 'canvas' );
canvas3.id = 'canvas3';
box.appendChild( canvas3 );
canvas3.style.width = '7%';
canvas3.style.height = '40%';
canvas3.style.right = '1rem';
canvas3.style.top = '5rem';
canvas3.style.borderBottom = 'none';

const views = [];
let scene,
	renderer;

let mouseX = 0; 
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

function View( canvas, fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight ) {
	canvas.width = viewWidth * window.devicePixelRatio;
	canvas.height = viewHeight * window.devicePixelRatio;

	const context = canvas.getContext( '2d' );

	const camera = new THREE.PerspectiveCamera( 45, viewWidth / viewHeight, 1, 10000 );
	camera.setViewOffset( fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight );
	camera.position.x = 100;

	this.render = function () {
		camera.position.x += ( mouseX - camera.position.x ) * 0.005;
		camera.position.y += ( - mouseY - camera.position.y ) * 0.005;
		camera.lookAt( scene.position );

		renderer.setViewport( 0, fullHeight - viewHeight, viewWidth, viewHeight );
		renderer.render( scene, camera );
		context.drawImage( renderer.domElement, 0, 0 );
	};
}

function init() {

	let fullWidth = window.innerWidth;
	let fullHeight = 550;

	views.push( new View( canvas1, fullWidth, fullHeight, 50, 50, canvas1.clientWidth, canvas1.clientHeight ) );
	views.push( new View( canvas2, fullWidth, fullHeight, 250, 0, canvas2.clientWidth, canvas2.clientHeight ) );
	views.push( new View( canvas3, fullWidth, fullHeight, 300, 150, canvas3.clientWidth, canvas3.clientHeight ) );

	scene = new THREE.Scene();

	let light = new THREE.DirectionalLight( 0xffffff, 6 );
	light.position.set( 0, 10, 1 ).normalize();
	scene.add( light );

	let onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		let percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
		}
	};
	let onError = function () {};
	let manager = new THREE.LoadingManager();
	let material = new THREE.MeshPhysicalMaterial({
			color: 0x0,
			emissive: 0x014f86,
			roughness: 0.01,
			metalness: 0.99,
			transparent: true,
			opacity: 0.03 });
	let loader = new OBJLoader( manager );
	loader.setPath( '' );
	loader.load( './3D/files/DNA.obj', function ( object ) {
		let cell = object.children[ 0 ];
		cell.scale.multiplyScalar( 10 );
		cell.position.set( 0, 0, 0 );
		cell.material = material;
		let cell2 = cell.clone();
		cell2.position.set( 10, 20, 10 );
		scene.add( cell, cell2 );

		onProgress;
		onError() });

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( fullWidth, fullHeight );
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}
function animate() {
	for ( let i = 0; i < views.length; ++ i ) {
		views[ i ].render();
	}
	requestAnimationFrame( animate );
}

