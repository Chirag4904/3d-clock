import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DoubleSide } from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// new RGBELoader().load("./assets/cannon_1k_blurred.hdr", function (texture) {
// 	texture.mapping = THREE.EquirectangularReflectionMapping;
// 	scene.background = texture;
// 	scene.environment = texture;
// });

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("gray");
//Mouse position
let mousePos = new THREE.Vector2(0, 0);
window.addEventListener("mousemove", (e) => {
	let x = e.clientX - innerWidth * 0.5;
	let y = e.clientY - innerHeight * 0.5;
	mousePos.x = x * 0.001;
	mousePos.y = y * 0.001;
});

// Objects
// const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

function customHandle(height, width, depth, color) {
	const box = new THREE.Mesh(
		new THREE.BoxBufferGeometry(width, height, depth),
		new THREE.MeshStandardMaterial({
			roughness: 0,
			metalness: 1,
			side: DoubleSide,
			color,
		})
	);
	box.position.set(0, 0, 0);

	const topCap = new THREE.Mesh(
		new THREE.CylinderBufferGeometry(width * 0.5, width * 0.5, depth),
		new THREE.MeshStandardMaterial({
			roughness: 0,
			metalness: 1,
			side: DoubleSide,
			color,
		})
	);
	topCap.rotation.x = Math.PI * 0.5;
	topCap.position.set(0, height * 0.5, 0);

	const bottomCap = new THREE.Mesh(
		new THREE.CylinderBufferGeometry(width * 0.5, width * 0.5, depth),
		new THREE.MeshStandardMaterial({
			roughness: 0,
			metalness: 1,
			side: DoubleSide,
			color,
		})
	);
	bottomCap.rotation.x = Math.PI * 0.5;
	bottomCap.position.set(0, -height * 0.5, 0);

	let group = new THREE.Group();
	group.add(box, bottomCap, topCap);
	return group;
}

function customRing(thickness, color) {
	const ring = new THREE.Mesh(
		new THREE.RingBufferGeometry(2, 2 + thickness, 70),
		new THREE.MeshStandardMaterial({
			roughness: 0.5,
			metalness: 1,
			side: DoubleSide,
			color,
		})
	);
	ring.position.set(0, 0, 0.25 * 0.5);

	const outerCylinder = new THREE.Mesh(
		new THREE.CylinderBufferGeometry(
			2 + thickness,
			2 + thickness,
			0.25,
			70,
			1,
			true
		),
		new THREE.MeshStandardMaterial({
			roughness: 0,
			metalness: 1,
			side: DoubleSide,
			color,
		})
	);
	outerCylinder.rotation.x = Math.PI * 0.5;

	const innerCylinder = new THREE.Mesh(
		new THREE.CylinderBufferGeometry(2, 2, 0.25, 140, 1, true),
		new THREE.MeshStandardMaterial({
			roughness: 0,
			metalness: 1,
			side: DoubleSide,
			color,
		})
	);
	innerCylinder.rotation.x = Math.PI * 0.5;

	let group = new THREE.Group();
	group.add(ring, outerCylinder, innerCylinder);

	return group;
}

const ring1 = customRing(0.65, "darkgray");
ring1.scale.set(0.75, 0.75);
scene.add(ring1);

const ring2 = customRing(0.35, new THREE.Color(0.25, 0.225, 0.215));
ring2.scale.set(1.05, 1.05);
scene.add(ring2);

const ring3 = customRing(0.15, "white");
ring3.scale.set(1.3, 1.3);
scene.add(ring3);

const hourHand = customHandle(0.4, 0.135, 0.07, "white");
scene.add(hourHand);
const minuteHand = customHandle(0.8, 0.135, 0.07, "gray");
scene.add(minuteHand);
const secondsHand = customHandle(1, 0.135, 0.07, "black");
scene.add(secondsHand);
// // Materials

// const material = new THREE.MeshStandardMaterial({
// 	roughness: 0.2,
// 	metalness: 1,
// });

// // Mesh
// const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

// Lights

// const pointLight = new THREE.PointLight(0xffffff, 0.1);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
directionalLight.position.set(0, 3, 10);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	ring1.rotation.x = ring1.rotation.x * 0.95 + mousePos.y * 0.2 * 0.5;
	ring1.rotation.y = ring1.rotation.y * 0.95 + mousePos.x * 0.2 * 0.5;

	ring2.rotation.x = ring2.rotation.x * 0.8 + mousePos.y * 0.38 * 0.2;
	ring2.rotation.y = ring2.rotation.y * 0.8 + mousePos.x * 0.38 * 0.2;

	ring3.rotation.x = -(ring3.rotation.x * 0.7 + mousePos.y * 0.25 * 0.3);
	ring3.rotation.y = -(ring3.rotation.y * 0.7 + mousePos.x * 0.25 * 0.3);

	//Time logic
	let date = new Date();

	let hourAngle = (date.getHours() / 12) * Math.PI * 2;

	hourHand.rotation.z = -hourAngle;
	hourHand.position.set(Math.sin(hourAngle), Math.cos(hourAngle));

	let minuteAngle = (date.getMinutes() / 60) * Math.PI * 2;

	minuteHand.rotation.z = -minuteAngle;
	minuteHand.position.set(Math.sin(minuteAngle), Math.cos(minuteAngle));

	let secondsAngle = (date.getSeconds() / 60) * Math.PI * 2;

	secondsHand.rotation.z = -secondsAngle;
	secondsHand.position.set(Math.sin(secondsAngle), Math.cos(secondsAngle));
	//Update controls
	controls.update();
	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
