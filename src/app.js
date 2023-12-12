/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, SphereGeometry,
    MeshBasicMaterial,
    Mesh, } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import SceneParams from './params';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
const thirdPersonPOV = new Vector3(0, 3, -10);
const thirdPersonLook = new Vector3();
const firstPersonPOV = new Vector3(0, 1, 0);
const firstPersonLook = new Vector3()

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
controls.enabled = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();

    // change camera settings
    const frog = scene.getFrog();
    
    const frogPosition = new Vector3();
    const cameraOffsetPOV = new Vector3();
    const cameraOffsetLook = new Vector3();
    if (SceneParams.FIRSTPERSON) {
        frog.getWorldPosition(frogPosition);
        // toggle either to change the jump pov works
        cameraOffsetPOV.copy(firstPersonPOV.clone().add(new Vector3(0, frog.rotation.z, 0)));
        // cameraOffsetPOV.copy(firstPersonPOV.clone().add(new Vector3(0, 0, -frog.rotation.z / 2)));
        
        const lookPosition = frogPosition.clone().add(new Vector3(0, 2 + frog.rotation.z * 2, 5));
        cameraOffsetLook.copy(lookPosition);
    } else {
        frog.getWorldPosition(frogPosition);
        cameraOffsetPOV.copy(thirdPersonPOV);
        
        const lookPosition = frogPosition.clone().add(new Vector3(0, frog.rotation.z, 0));
        cameraOffsetLook.copy(lookPosition);
    }

    camera.position.copy(frogPosition).add(cameraOffsetPOV);
    camera.lookAt(cameraOffsetLook);    

    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
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
