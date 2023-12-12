import {
    Group,
    Vector3,
    Sphere,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './lilly-pad.glb';
import SceneParams from '../../../params';

class LillyPad extends Group {
    constructor(initialPos, index) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        // Properties
        this.name = 'lilly-pad';
        this.index = index;
        if (initialPos) {
            this.position = initialPos;
        }
        // Lilly Pad by Jarlan Perez [CC-BY] via Poly Pizza
        loader.load(MODEL, (gltf) => {
            let scale = 15;
            gltf.scene.scale.set(scale, scale, scale);
            this.add(gltf.scene);
        });

        // collisions
        const radius = SceneParams.LILYPAD_RADIUS;
        const lilypadOffset = SceneParams.LILYPAD_BOUNDING_OFFSET;
        this.boundingSphere = new Sphere(
            this.position.clone().add(lilypadOffset),
            radius
        ); // Adjust radius as needed
        // For debugging: create a mesh to visualize the bounding sphere
        if (SceneParams.DEBUGGING) {
            const sphereGeom = new SphereGeometry(radius, 16, 16);
            const sphereMat = new MeshBasicMaterial({
                color: 'blue',
                wireframe: true,
            });
            this.boundingSphereMesh = new Mesh(sphereGeom, sphereMat);
            this.boundingSphereMesh.position
                .copy(this.position)
                .add(lilypadOffset);

            this.add(this.boundingSphereMesh);
        }
    }

    addToPosition(offset) {
        this.position.add(offset);
        // this.boundingSphere.center.add(offset);
        if (SceneParams.DEBUGGING) {
            // this.boundingSphereMesh.position.add(offset);
        }
    }

    getWorldBoundingSphere() {
        const worldPosition = new Vector3();
        this.getWorldPosition(worldPosition);
        worldPosition.add(SceneParams.LILYPAD_BOUNDING_OFFSET);
        const boundingSphereWorld = new Sphere(
            worldPosition,
            SceneParams.LILYPAD_RADIUS
        ); // Use the same radius as your local bounding sphere
        return boundingSphereWorld;
    }

    generateNextPad() {
        const radius = 15;
        const angle = Math.random() * (Math.PI / 2);

        const offset = new Vector3(radius, 0, 0).applyAxisAngle(
            new Vector3(0, 1, 0),
            angle
        );

        const newPad = this.clone();
        newPad.addToPosition(offset);
        newPad.index = this.index + 1;
        return newPad;
    }
}

export default LillyPad;
