import { OrbitControls } from './libs/OrbitControls.js';

function init() {
	let scene = new THREE.Scene();

	let camera = new THREE.PerspectiveCamera(
	65,
	window.innerWidth/ window.innerHeight,
	0.1,
	1000);
	camera.position.set(-110, 50, 40);
	camera.lookAt(scene.position);

	let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setClearColor(new THREE.Color( 0xd7bba8 ));
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById("scene").appendChild(renderer.domElement);

	let controls = new OrbitControls(camera, renderer.domElement);
	controls.maxPolarAngle = Math.PI * 0.495;
	controls.minDistance = 20.0;
	controls.maxDistance = 150.0;

	let light = new THREE.DirectionalLight( 0xe7eccb, 0.7 );
	light.castShadow = true;

	let spotLight = new THREE.SpotLight(0xedaf97, 0.3);
	spotLight.position.set( 5, 120, 0 );
	spotLight.castShadow = true;

	let spotLight2 = new THREE.SpotLight(0xf6bdd1, 0.3);
	spotLight2.position.set( 10, 50, -30 );
	spotLight2.castShadow = true;

	let planeGeom = new THREE.PlaneGeometry( 500, 500, 30, 30 );
	let planeMaterial = new THREE.MeshPhongMaterial({
		color: 0x443742,
		emissive: 0x846c5b,
		specular: 0x443742,
		shininess: 16
	});
	let plane = new THREE.Mesh(planeGeom, planeMaterial);
	plane.receiveShadow = true;
	plane.position.set(0, -65, -20);
	plane.rotation.x = -0.5 * Math.PI;


	let material = new THREE.MeshPhysicalMaterial({
		color: 0xFF4500});
	material.visible = false;

    let sphere1 = createMesh(new THREE.SphereGeometry(44, 20, 30));
    sphere1.position.set(10, 15, 0);
    let sphere2 = createMesh(new THREE.SphereGeometry(45, 20, 30));
    sphere2.position.set(10, 15, 0);
    let sphere3 = createMesh(new THREE.SphereGeometry(43, 20, 30));
    sphere3.position.set(10, 15, 0);
    let molecule = createMesh(new THREE.IcosahedronGeometry( 50, 0 ));
    molecule.position.set(11, 15, 0);

	let sphere1BSP = new ThreeBSP(sphere1);
	let sphere2BSP = new ThreeBSP(sphere2);
	let sphere3BSP = new ThreeBSP(sphere3);
    let moleculeBSP = new ThreeBSP(molecule);

    let result1BSP = sphere1BSP.subtract(sphere2BSP);
    let result2BSP = moleculeBSP.intersect(result1BSP);
    let result3BSP = result2BSP.subtract(sphere3BSP);
    let cell = result3BSP.toMesh();
    cell.material = new THREE.MeshPhysicalMaterial({
		color: 0xe4eac5,
		opacity: 0.6,
		transparent: true,
		side: THREE.DoubleSide,
		emissive: 0xcea07e,
		wireframe: false,
		roughness: 0.1,
		metalness: 0.93,
		reflectivity: 0.6});
    cell.castShadow = true;

    let sphere4 = createMesh(new THREE.SphereGeometry(9, 20, 30));
    sphere4.position.set(21, 30, 61);
    let sphere5 = createMesh(new THREE.SphereGeometry(10, 20, 30));
    sphere5.position.set(24, 30, 60);
    let sphere6 = createMesh(new THREE.SphereGeometry(9, 20, 30));
    sphere6.position.set(19, 30, 59);

    function addLeave(x, y, z, w) {
    	let sphere4BSP = new ThreeBSP(sphere4);
		let sphere5BSP = new ThreeBSP(sphere5);
		let sphere6BSP = new ThreeBSP(sphere6);
		let result4BSP = sphere4BSP.subtract(sphere5BSP);
		let result5BSP = result4BSP.subtract(sphere6BSP);
		let leave = result5BSP.toMesh();
		leave.position.set(x, y, z);
		let step = w;
		leave.rotation.x += step;
		leave.material = new THREE.MeshPhysicalMaterial({
				color: 0x7e4e60,
				opacity: 0.5,
				transparent: true,
				side: THREE.DoubleSide,
				emissive: 0xb287a3,
				roughness: 0.9,
				metalness: 0.7,
				reflectivity: 0.6});
		leave.castShadow = true;
		scene.add(leave);
	}
	addLeave(13, 34, -5, 0);
	addLeave(13, 34, 0, 1);
	addLeave(13, 34, 5, 2);
	addLeave(13, 32, 10, 3);
	addLeave(13, 20, -5, 0);
	addLeave(13, 20, 0, -1);
	addLeave(13, 20, 5, -2);
	addLeave(13, 19, 10, -3);

	function CustomSinCurve( scale ) {
		THREE.Curve.call( this );
		this.scale = ( scale === undefined ) ? 1 : scale;
	}

	CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
	CustomSinCurve.prototype.constructor = CustomSinCurve;
	CustomSinCurve.prototype.getPoint = function ( t ) {
		var tx = t * 3 - 1.5;
		var ty = Math.sin( 2 * Math.PI * t );
		var tz = 0;
		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );
	};

	let path = new CustomSinCurve( 94 );
	let stemGeometry = new THREE.TubeGeometry( path, 100, 0.5, 30, false );
	let stemMaterial = new THREE.MeshPhysicalMaterial({
				color: 0x525b76,
				opacity: 0.3,
				transparent: true,
				side: THREE.DoubleSide,
				emissive: 0xa2c3a4,
				roughness: 0.2,
				metalness: 0.9,
				reflectivity: 0.6});;

	let stem1 = new THREE.Mesh( stemGeometry, stemMaterial );
	stem1.position.set(24, 27, -220);
	stem1.rotation.z = -0.5 * Math.PI;
	stem1.castShadow = true;
	let stem2 = new THREE.Mesh( stemGeometry, stemMaterial );
	stem2.position.set(13, 20, -140);
	stem2.rotation.y = -0.5 * Math.PI;
	stem2.castShadow = true;
	let stem3 = new THREE.Mesh( stemGeometry, stemMaterial );
	stem3.position.set(-25, 30, -140);
	stem3.rotation.x = -0.5 * Math.PI;
	stem3.castShadow = true;

	scene.add(
			light,
			spotLight,
			spotLight2,
			plane,
			sphere1,
			sphere2,
			sphere3,
			sphere4, 
			sphere5,
			sphere6,
			molecule,
			cell,
			stem1,
			stem2,
			stem3
			);

	let step = 0.02;

	render();
	window.addEventListener( 'resize', onWindowResize, false );

	function createMesh(geom) {
		let mesh = new THREE.Mesh(geom, material);
		return mesh;
	}
	function render() {
		cell.rotation.y += 0.004;
		controls.update();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	function onWindowResize() {
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
}
window.onload = init;