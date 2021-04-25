import * as THREE from './libs/three.module.js';
import { TessellateModifier } from './libs/TessellateModifier.js';
import { EffectComposer } from './libs/EffectComposer.js';
import { RenderPass } from './libs/RenderPass.js';
import { UnrealBloomPass } from './libs/UnrealBloomPass.js';
import { AfterimagePass } from './libs/AfterimagePass.js'
import { TrackballControls } from './libs/trackBall.js';

let header = document.createElement( 'div' );
header.id = 'header';
document.body.appendChild( header );
header.style.padding = '0px';

let renderer, 
	container,
	scene, 
	camera, 
	composer, 
	controls,
	geometry,
	mesh,
	sound,
	letter1,
	letter2,
	letter3,
	letter4,
	letter5;
let letters = [];
let meshes = [];
let positions = [];
let buttons = [];

let params = {
	exposure: 0.9,
	bloomStrength: 0.7,
	bloomThreshold: 0,
	bloomRadius: 0.8 };

let uniforms = {
	amplitude: { value: 0.0 }
};

const WIDTH = window.innerWidth * window.devicePixelRatio;
const HEIGHT = window.innerHeight * window.devicePixelRatio;

let loader = new THREE.FontLoader();
loader.load( './files/helvetiker_regular.typeface.json', function ( font ) {
	init( font );
	animate();
} );

let minButton = document.createElement( 'button' );
minButton.className = "push";
document.body.append( minButton );
minButton.style.display = "none";
minButton.innerHTML = '<img src="./files/min.png" />';
minButton.style.left = "2.5rem";

let maxButton = document.createElement( 'button' );
maxButton.className = "push";
document.body.append( maxButton );
maxButton.innerHTML = '<img src="./files/max.png" />';
maxButton.style.left = "2.5rem";

let playButton = document.createElement( 'button' );
playButton.className = "push";
document.body.append( playButton );
playButton.innerHTML = '<img src="./files/mute.png" />';
playButton.style.left = "4.5rem";
playButton.style.paddingBottom = "3px";

let muteButton = document.createElement( 'button' );
muteButton.className = "push";
document.body.append( muteButton );
muteButton.innerHTML = '<img src="./files/volume.png" />';
muteButton.style.display = "none";
muteButton.style.left = "4.5rem";
muteButton.style.paddingBottom = "3px";

buttons = [ minButton, maxButton, playButton, muteButton ];
buttons.forEach(function(item, i, buttons) {
  i = buttons[ i ];
    i.style.position = "absolute";
	i.style.bottom = "1rem";
	i.style.background = "transparent";
	i.style.cursor = "pointer";
	i.style.zIndex = '999';
	i.style.border = "none";
});

function init( font ) {
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	camera = new THREE.PerspectiveCamera( 55, WIDTH / HEIGHT, 1, 1000 );
	camera.position.set( 0, 10, 190 );
	camera.lookAt( 0, 0, 0 );

	letters = [ "I", "M" , "A", "G", "O" ];
	letter1 = createLetter( -95, -15, -55, 0 );
	letter2 = createLetter( -60, 5, -55, 1 );
	letter4 = createLetter( 55, 5, -55 , 3 );
	letter5 = createLetter( 109, -15, -55, 4 );
	letter3 = createLetter( 0, 25, -55, 2 );

	let audioLoader = new THREE.AudioLoader();
	let listener = new THREE.AudioListener();
	sound = new THREE.Audio( listener );

	audioLoader.load( './files/imago.ogg', function( buffer ) {
		sound.setBuffer( buffer );
		sound.setLoop( true );
		sound.setVolume( 1 );
		sound.play()
	});
	camera.add( listener );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor( 0x2b2d42 );
	renderer.setSize( WIDTH, HEIGHT );
	//postprocessing
	let bloomPass = new UnrealBloomPass( new THREE.Vector2( 
		WIDTH,
		HEIGHT ), 
		1.2, 
		0.4, 
		0.85 );
	bloomPass.threshold = params.bloomThreshold;
	bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;
	let afterimagePass = new AfterimagePass();
	let renderScene = new RenderPass( scene, camera );
	composer = new EffectComposer( renderer );
	composer.addPass( renderScene );
	composer.addPass( bloomPass );
	composer.addPass( afterimagePass );
	composer.setSize ( WIDTH, HEIGHT );

	header.appendChild( renderer.domElement );
	createControls( camera );
	window.addEventListener( 'resize', onWindowResize, false );

	function createLetter( x, y, z, k ) {
		let letterForm = {
			font: font,
			size: 55,
			height: 10,
			curveSegments: 1,
			bevelThickness: 2,
			bevelSize: 2,
			bevelEnabled: true
		};
		let letter = letters[ k ];
		geometry = new THREE.TextGeometry( letter, letterForm );
		geometry.center();
	
		let tessellateModifier = new TessellateModifier( 0.1, 0.1 );
		geometry = tessellateModifier.modify( geometry );
		
		let numFaces = geometry.attributes.position.count / 3;
		let colors = new Float32Array( numFaces * 3 * 3 );
		let displacement = new Float32Array( numFaces * 3 * 3 );
		let color = new THREE.Color();

		for ( let f = 0; f < numFaces; f ++ ) {
			let index = 30 * f;
			let h = 0.8 + Math.random();
			let s = 0.2 + 0.2 * Math.random();
			let l = 0.2 + 0.3 * Math.random();
			color.setHSL( h, s, l );

			let d = 120 * ( 0.5 - Math.random() );
			for ( let i = 0; i < 3; i ++ ) {
				colors[ index + ( 2 * i ) ] = color.r;
				colors[ index + ( 1 * i ) + 5 ] = color.g;
				colors[ index + ( 2 * i ) + 5 ] = color.b;
				displacement[ index + ( 3 * i ) + 1 ] = d;
				displacement[ index + ( 3 * i ) ] = d;
			}
		}
		geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
		geometry.setAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );
		
		const shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent
		} );

		mesh = new THREE.Mesh( geometry, shaderMaterial );
		scene.add( mesh );
		mesh.position.set( x, y, z );
		positions.push( x, y, z );
		meshes.push ( mesh );
		return mesh;
	}
}
function max() {
	maxButton.style.display = "none";
	minButton.style.display = "block";
	meshes.forEach(function(item, i, letters) {
		i = meshes[ i ];
	  i.translateZ( 80 );
	  });
}
function min() {
	minButton.style.display = "none";
	maxButton.style.display = "block";
	meshes.forEach(function(item, i, letters) {
		i = meshes[ i ];
	  i.translateZ( -80 );
	});
}
function play() {
	sound.stop();
	muteButton.style.display = "block";
	playButton.style.display = "none";
}
function mute() {
	sound.play();
	muteButton.style.display = "none";
	playButton.style.display = "block";
}
function createControls( camera ) {
	controls = new TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.1;
	controls.zoomSpeed = 0.1;
	controls.panSpeed = 0.1;
	controls.keys = [ 65, 83, 68 ];
	controls.maxDistance = 300;
	controls.maxPolarAngle = Math.PI * 0.295;
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	composer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	controls.update();
	render();
}
function render() {
	let time = Date.now() * 0.001;
	maxButton.addEventListener( 'click', max );
	minButton.addEventListener( 'click', min );
	playButton.addEventListener( 'click', play );
	muteButton.addEventListener( 'click', mute );

	uniforms.amplitude.value = 5 + Math.sin( time * 0.2 );
	composer.render( 0.01 );
}
