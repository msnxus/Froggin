import {
    Group,
    Vector3,
    Sphere,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './fly.glb';
import SceneParams from '../../../params';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

class Fly extends Group {
    constructor(initialPos) {
        // Call parent Group() constructor
        super();

        // Properties
        this.name = 'fly';

        // Pad types
        this.moving = false;
        this.disappearing = false;

        this.rotation.y = Math.random() * Math.PI * 2;
        if (initialPos) {
            this.addToPosition(initialPos);
        }

        const loader = new GLTFLoader();
        // Fly by jeremy [CC-BY] via Poly Pizza
        loader.load(MODEL, (gltf) => {
            let scale = 0.15;
            gltf.scene.scale.set(scale, scale, scale);
            this.add(gltf.scene);
        });

        // collisions
        const radius = SceneParams.FLY_RADIUS;
        const flyOffset = SceneParams.FLY_BOUNDING_OFFSET;
        this.boundingSphere = new Sphere(
            initialPos.clone().add(flyOffset),
            radius
        ); // Adjust radius as needed
    // For debugging: create a mesh to visualize the bounding sphere
        const sphereGeom = new SphereGeometry(radius, 16, 16);
        const sphereMat = new MeshBasicMaterial({
            color: 'green',
            wireframe: true,
        });
        this.boundingSphereMesh = new Mesh(sphereGeom, sphereMat);
        this.boundingSphereMesh.position.add(flyOffset);

        this.add(this.boundingSphereMesh);
        this.boundingSphereMesh.visible = SceneParams.BOUNDING_BOXES;

        // this.moving = true;
        this.startMovement();

        // this.material.transparent = true;
        // this.material.opacity = 0.5;
    }

    addToPosition(offset) {
        this.position.add(offset);
    }

    getWorldBoundingSphere() {
        const worldPosition = new Vector3();
        this.getWorldPosition(worldPosition);
        const boundingSphereWorld = new Sphere(
            worldPosition,
            SceneParams.FLY_RADIUS
        ); // Use the same radius as your local bounding sphere
        return boundingSphereWorld;
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
        const radius =
            SceneParams.LILYPAD_MAX_JUMP_RADIUS -
            Math.random() * (SceneParams.LILYPAD_MAX_JUMP_RADIUS / 4);
        const angle = Math.random() * (Math.PI / 2) - Math.PI / 4;

        const offset = new Vector3(radius, 0, 0).applyAxisAngle(
            new Vector3(0, 1, 0),
            angle
        );
        offset.add(
            new Vector3(0, Math.random() * SceneParams.LILYPAD_MAX_Y_OFF, 0)
        );

        const newPad = this.clone();
        newPad.addToPosition(offset);
        newPad.index = this.index + 1;
        newPad.disappearing =
            Math.round(Math.random()) > 0.5 && this.index != 0 ? false : true;
        return newPad;
    }

    startMovement() {
        const moveDuration = () => Math.random() * 500 + 500; // Duration of each movement

        // Randomize the movement within a certain range
        const randomX = () => Math.random() * 6 - 3; // Random X between -3 and 3
        const randomY = () => Math.random() * 4 - 2; // Random Y between -2 and 2
        const randomZ = () => Math.random() * 6 - 3; // Random Y between -2 and 2
        const randomRotation = () =>
            Math.random() * Math.PI * 0.5 - Math.PI * 0.25; // Limit the rotation

        const moveAndRotate = () => {
            new TWEEN.Tween(this.position)
                .to(
                    {
                        x: this.position.x + randomX(),
                        y: this.position.y + randomY(),
                        z: this.position.z + randomZ(),
                    },
                    moveDuration()
                )
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(moveAndRotate)
                .start();
        };

        // Start the first movement
        moveAndRotate();
    }

    stopMovement() {
        this.moveRight.stop();
        this.moveLeft.stop();
        this.moveUp.stop();
        this.moveDown.stop();
    }
}

export default Fly;
