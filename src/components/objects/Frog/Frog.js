import {
    Group,
    Vector3,
    Sphere,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    Quaternion,
    Scene,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Frog.glb';
import SceneParams from '../../../params';
import { AudioLoader, Audio, AudioListener } from 'three';
import Tongue from '../Tongue/Tongue';

class Frog extends Group {
    constructor(parent, lillyPadGenerator) {
        // Call parent Group() constructor
        super();

        // TiltUp animation
        this.tiltUp = new TWEEN.Tween(this.rotation).to(
            { z: 1 },
            SceneParams.MAX_JUMP_TIME
        );

        // Tongue
        this.tongue = new Tongue();
        this.add(this.tongue);

        // Init state
        this.state = {
            bob: true,
            holdingTurn: false,
            jump: (power) => this.jump(power), // or this.jump.bind(this)
            twirl: 0,
            turn: (degrees) => this.turn(degrees),
            move: (distance) => this.move(distance),
            reset: () => {
                this.tweens.forEach((tween) => tween.stop());
                this.tweens = [];
                this.velocity = new Vector3();
                this.onGround = true;
                this.position.x = 0;
                this.position.y = 0;
                this.position.z = 0;
                this.dead = false;
                // Reset or remove the dot
                if (this.dot) {
                    this.remove(this.dot);
                    this.dot = undefined;
                    this.orignalDotPos = new Vector3();
                }
                this.lillyPadGenerator.reset();
                this.frozen = false;
            },

            freeze: () => {
                this.tweens.forEach((tween) => tween.stop());
                this.tweens = [];
                this.velocity = new Vector3();
                this.onGround = true;
                this.frozen = true;
            },
        };

        this.dead = false;
        this.frozen = false;
        // tweens
        this.tweens = [];

        // connecting lilly pad generator
        this.lillyPadGenerator = lillyPadGenerator;

        // for jumping
        this.velocity = new Vector3(0, 0, 0);
        this.onGround = true;

        // collisions
        const radius = SceneParams.FROG_RADIUS;
        const boundingPos = this.position
            .clone()
            .add(SceneParams.FROG_BOUNDING_OFFSET);
        this.boundingSphere = new Sphere(boundingPos, radius); // Adjust radius as needed

        // For debugging: create a mesh to visualize the bounding sphere
        const sphereGeom = new SphereGeometry(radius, 16, 16);
        const sphereMat = new MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
        });
        this.boundingSphereMesh = new Mesh(sphereGeom, sphereMat);
        this.add(this.boundingSphereMesh);
        this.boundingSphereMesh.position
            .copy(this.position)
            .add(SceneParams.FROG_BOUNDING_OFFSET);
        this.boundingSphereMesh.visible = SceneParams.BOUNDING_BOXES;
        
        // Load object
        // Frog by Poly by Google [CC-BY] via Poly Pizza
        const loader = new GLTFLoader();

        this.name = 'frog';
        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(0.01, 0.01, 0.01);
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // dot properties
        this.orignalDotPos = new Vector3();
        this.camera;

        // first terrain
        this.first = true;
    }

    jump(power) {
        if (this.onGround && !this.frozen) {
            const listener = new AudioListener();
            const sound = new Audio(listener);
            const audioLoader = new AudioLoader();
            audioLoader.load(
                'https://raw.githubusercontent.com/msnxus/Froggin/main/src/sounds/jump.wav',
                function (buffer) {
                    sound.setBuffer(buffer);
                    sound.setLoop(false);
                    sound.setVolume(1);
                    sound.play();
                }
            );
            this.tweens.forEach((tween) => tween.stop());
            this.tweens = [];
            let totalRotation = this.rotation.y - Math.PI / 2;
            let pow = power * SceneParams.JUMP_POWER;
            this.velocity.add(
                new Vector3(
                    -Math.sin(totalRotation) * pow,
                    pow,
                    -Math.cos(totalRotation) * pow
                )
            );
            this.onGround = false;
        }
    }

    turn(degrees) {
        if (this.frozen) {
            return;
        }
        const turnDuration = 500; // milliseconds to turn
        const turning = new TWEEN.Tween(this.rotation)
            .to({ y: this.rotation.y + degrees }, turnDuration)
            .easing(TWEEN.Easing.Exponential.Out)
            .start();

        // add a little hop to the movement
        if (this.onGround) {
            this.onGround = false;
            const hopHeight = 0.5;
            const hopDuration = 100;
            const upMovement = new TWEEN.Tween(this.position)
                .to({ y: this.position.y + hopHeight }, hopDuration)
                .easing(TWEEN.Easing.Quadratic.Out);
            const downMovement = new TWEEN.Tween(this.position)
                .to({ y: this.position.y }, hopDuration)
                .easing(TWEEN.Easing.Quadratic.In);
            // Fall down after little hop
            upMovement.onComplete(() => downMovement.start());
            //upMovement.start();
        }
    }

    generateNewTerrain(scenes) {
        let gen = false;
        for (const terrain of scenes) {
            const dist = Math.sqrt(
                Math.pow(this.position.x - terrain.offset.x, 2) +
                    Math.pow(this.position.z - terrain.offset.z, 2)
            );
            if (this.first) {
                if (dist >= 80) {
                    this.first = false;
                    gen = true;
                } else {
                    return false;
                }
            } else {
                if (dist >= 150) {
                    gen = true;
                } else return false;
            }
            
        }
        return gen;
    }

    move(distance, totalRotation) {
        if (this.onGround && !this.frozen) {
            this.onGround = false;
            const moveDuration = 1000;
            totalRotation -= Math.PI / 2;
            const moveXTween = new TWEEN.Tween(this.position)
                .to(
                    {
                        x:
                            this.position.x +
                            distance * -Math.sin(totalRotation),
                    },
                    moveDuration
                )
                .easing(TWEEN.Easing.Exponential.Out)
                .start();

            const moveYTween = new TWEEN.Tween(this.position)
                .to(
                    {
                        z:
                            this.position.z +
                            distance * -Math.cos(totalRotation),
                    },
                    moveDuration
                )
                .easing(TWEEN.Easing.Exponential.Out)
                .start();

            // add a little hop to the movement
            const hopHeight = 0.5;
            const hopDuration = 100;
            const upMovement = new TWEEN.Tween(this.position)
                .to({ y: this.position.y + hopHeight }, hopDuration)
                .easing(TWEEN.Easing.Quadratic.Out);
            const downMovement = new TWEEN.Tween(this.position)
                .to({ y: this.position.y }, hopDuration)
                .easing(TWEEN.Easing.Quadratic.In);

            // Fall down after little hop
            upMovement.onComplete(() => downMovement.start());
            upMovement.start();
            this.tweens.push(moveXTween, moveYTween, upMovement, downMovement);
        }
    }

    collide(pad) {
        this.position.y = pad.position.y;
        this.velocity = new Vector3(0, 0, 0);
        this.onGround = true;
    }

    getWorldBoundingSphere() {
        const worldPosition = new Vector3();
        this.getWorldPosition(worldPosition);
        const boundingSphereWorld = new Sphere(
            worldPosition,
            SceneParams.FROG_RADIUS
        ); // Use the same radius as your local bounding sphere
        return boundingSphereWorld;
    }

    updateCamera(camera) {
        this.camera = camera;
        const frogPosition = new Vector3();
        const cameraOffsetPOV = new Vector3();
        const cameraOffsetLook = new Vector3();

        if (SceneParams.FIRSTPERSON) {
            this.getWorldPosition(frogPosition);

            cameraOffsetPOV.copy(SceneParams.FIRSTPERSONPOV);

            const distance = 5;
            const dotDirection = new Vector3(0, 2, 5);
            const dotDistance = dotDirection
                .clone()
                .normalize()
                .multiplyScalar(distance);

            // Create a quaternion representing a 90-degree rotation around the Y-axis
            const quaternion = new Quaternion();
            quaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2); // 90 degrees in radians

            // Apply the quaternion rotation to the vector
            dotDistance.applyQuaternion(quaternion);

            if (!this.dot) {
                // Create the dot if it doesn't exist
                const dotGeometry = new SphereGeometry(0.05); // Adjust the radius as needed
                const dotMaterial = new MeshBasicMaterial({ color: 0x000000 });
                this.dot = new Mesh(dotGeometry, dotMaterial);
                this.dot.position.copy(dotDistance);
                this.orignalDotPos = this.dot.position.clone();
                this.add(this.dot);
            }
            camera.position.copy(frogPosition).add(cameraOffsetPOV);
            camera.lookAt(this.localToWorld(this.dot.position.clone()));
        } else {
            this.getWorldPosition(frogPosition);
            cameraOffsetPOV.copy(SceneParams.THIRDPERSONPOV);

            const lookPosition = frogPosition
                .clone()
                .add(new Vector3(0, this.rotation.z, 0));
            cameraOffsetLook.copy(lookPosition).add(new Vector3(0, 1, 0));

            // Remove the dot if it exists
            if (this.dot) {
                this.remove(this.dot);
                this.dot = undefined;
                this.orignalDotPos = new Vector3();
            }
            camera.position.copy(frogPosition).add(cameraOffsetPOV);
            camera.lookAt(cameraOffsetLook);
        }
    }

    getDotPosition() {
        return this.position.clone().add(this.dot.position);
    }

    update(timeStamp) {
        // update position
        this.position.add(
            this.velocity.clone().multiplyScalar(SceneParams.TIMESTEP)
        );
        // if in the air
        if (!this.onGround) {
            // apply gravity
            this.velocity.add(new Vector3(0, -SceneParams.GRAVITY, 0));
        }

        this.boundingSphere.center
            .copy(this.position)
            .add(SceneParams.FROG_BOUNDING_OFFSET);
        TWEEN.update();

        if (this.position.y < -5 && !this.dead) {
            this.dead = true;
            // set score to 0
            document.getElementById('score-content').innerText = 0;

            // TODO: trigger lose screen
            let deathScreen = document.getElementById('death');
            deathScreen.style.visibility = 'visible';
            deathScreen.style.opacity = 1;

            // freeze the froggy
            this.state.freeze();

            // death screen fadeout and reset froggy after 500 ms
            setTimeout(() => {
                document.getElementById('death').style.opacity = 0;
                setTimeout(() => {
                    document.getElementById('death').style.visibility =
                        'hidden';
                }, 500);
                
                this.state.reset();
            }, 800);

            // audio
            const listener = new AudioListener();
            const sound = new Audio(listener);
            const audioLoader = new AudioLoader();
            audioLoader.load(
                'https://raw.githubusercontent.com/msnxus/Froggin/main/src/sounds/death.wav',
                function (buffer) {
                    sound.setBuffer(buffer);
                    sound.setLoop(false);
                    sound.setVolume(0.2);
                    sound.play();
                }
            );
        }
    }
}

export default Frog;
