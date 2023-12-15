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
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

class LillyPad extends Group {
    constructor(initialPos, index) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        // Properties
        this.name = 'lilly-pad';
        this.index = index;
        // Pad types
        this.moving = false;
        this.disappearing = false;

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

        // Tween setup
        this.initTweens();

        if (Math.round(Math.random()) > 0.5 && this.index != 0) {
            this.moving = true;
            this.startMovement();
        }

        // this.material.transparent = true;
        // this.material.opacity = 0.5;
    }

    initTweens() {
        const moveDuration = 3000;
        this.moveRight = new TWEEN.Tween(this.position)
            .to(
                {
                    z: this.position.z + 5,
                },
                moveDuration
            )
            .easing(TWEEN.Easing.Exponential.InOut);

        this.moveLeft = new TWEEN.Tween(this.position)
            .to(
                {
                    z: this.position.z - 5,
                },
                moveDuration
            )
            .easing(TWEEN.Easing.Exponential.InOut);
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

    generateNextPad(scene) {
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
        this.moveRight.start();
        this.moveRight.onComplete(() => this.moveLeft.start());
        this.moveLeft.onComplete(() => this.moveRight.start());
    }

    stopMovement() {
        this.moveRight.stop();
        this.moveLeft.stop();
    }
}

export default LillyPad;
