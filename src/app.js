/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, MenuScene } from 'scenes';
import SceneParams from './params';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as pages from './pages/';
import * as dat from 'dat.gui';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// reload feature
let reload = {New_Game: function(){window.location.reload()}};

// gui
const gui = new dat.GUI();
gui.add(SceneParams, 'BOUNDING_BOXES', false, true).onChange((value) => {  
    SceneParams.BOUNDING_BOXES = value;
    scene.toggleBounding(value)
});
gui.add(SceneParams, 'HACKS_l_k', false, true).onChange((value) => {
    SceneParams.HACKS_l_k = value;
});
gui.add(SceneParams, 'TERRAIN', false, true).onChange((value) => {
    SceneParams.TERRAIN = value;
    scene.toggleTerrain(value)
});
gui.add(reload, 'New_Game');

// Set up camera
// ------------------------------ CHANGE CAMERA SETTINGS HERE ------------------------------
// camera.position.set(0, 5, -10);
// camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    controls.enabled = SceneParams.ENABLEPANNING;
    scene.frog.updateCamera(camera);
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp, camera);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
pages.init_fonts(document);
pages.init_pages(window, document);
