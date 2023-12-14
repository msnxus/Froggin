import {
    Group,
    Vector3,
    Sphere,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    Scene,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Frog.glb';
import SceneParams from '../../../params';
import { AudioLoader, Audio, AudioListener } from 'three';

class Frog extends Group {
    constructor(parent, lillyPadGenerator) {
        // Call parent Group() constructor
        super();

        // TiltUp animation
        this.tiltUp = new TWEEN.Tween(this.rotation).to(
            { z: 0.7 },
            SceneParams.MAX_JUMP_TIME
        );

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

                // Reset or remove the dot
                if (this.dot) {
                    this.remove(this.dot);
                    this.dot = undefined;
                    this.orignalDotPos = new Vector3();
                }
                this.lillyPadGenerator.reset();
            },
        };
        // tweens
        this.tweens = [];

        // connecting lilly pad generator
        this.lillyPadGenerator = lillyPadGenerator;

        // for jumping
        this.velocity = new Vector3(0, 0, 0);
        this.onGround = true;

        // collisions
        const radius = SceneParams.FROG_RADIUS;
        this.boundingSphere = new Sphere(this.position, radius); // Adjust radius as needed

        // For debugging: create a mesh to visualize the bounding sphere
        if (SceneParams.DEBUGGING) {
            const sphereGeom = new SphereGeometry(radius, 16, 16);
            const sphereMat = new MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true,
            });
            this.boundingSphereMesh = new Mesh(sphereGeom, sphereMat);
            this.add(this.boundingSphereMesh);
            this.boundingSphereMesh.position.copy(this.position);
        }
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
    }

    jump(power) {
        if (this.onGround) {
            const listener = new AudioListener();
            const sound = new Audio(listener);
            const audioLoader = new AudioLoader();
            audioLoader.load(
                'https://raw.githubusercontent.com/msnxus/Froggin/ca5fd1b232fd4bd2651bed0fd66330a447b1134c/src/sounds/jump.wav',
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

    generateNewTerrain(pond) {
        const dist = Math.sqrt(Math.pow(this.position.x - pond.offset.x, 2) + Math.pow(this.position.z - pond.offset.z, 2));
        if(dist >= 180) {
            return true;
        } else return false;
    }

    move(distance, totalRotation) {
        if (this.onGround) {
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

            cameraOffsetPOV
                .copy(SceneParams.FIRSTPERSONPOV)
                .add(new Vector3(0, this.rotation.z, 0));

            const lookPosition = frogPosition
                .clone()
                .add(new Vector3(0, 2 + this.rotation.z * 1.5, 5));
            cameraOffsetLook.copy(lookPosition);

            // Update the dot position based on the look-at direction
            const dotDistance = 1; // Adjust the distance of the dot from the frog
            const dotPosition = lookPosition
                .clone()
                .add(
                    cameraOffsetLook
                        .clone()
                        .normalize()
                        .multiplyScalar(dotDistance)
                );
            if (this.dot) {
                // this.dot.position.copy(this.worldToLocal(dotPosition));
            } else {
                // Create the dot if it doesn't exist
                const dotGeometry = new SphereGeometry(0.05); // Adjust the radius as needed
                const dotMaterial = new MeshBasicMaterial({ color: 0x000000 });
                this.dot = new Mesh(dotGeometry, dotMaterial);
                this.dot.position.copy(this.worldToLocal(dotPosition));
                this.orignalDotPos = this.dot.position.clone();
                this.add(this.dot);
            }
            // console.log(this.orignalDotPos);
            camera.position.copy(frogPosition).add(cameraOffsetPOV);
            // camera.lookAt(cameraOffsetLook);
            camera.lookAt(this.localToWorld(this.dot.position.clone()));
        } else {
            this.getWorldPosition(frogPosition);
            cameraOffsetPOV.copy(SceneParams.THIRDPERSONPOV);

            const lookPosition = frogPosition
                .clone()
                .add(new Vector3(0, this.rotation.z, 0));
            cameraOffsetLook.copy(lookPosition);

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

    moveDot(distance, key) {
        if (SceneParams.FIRSTPERSON) {
            const length = 3;
            if (key == 'w') {
                if (this.dot.position.y < this.orignalDotPos.y + length) {
                    this.dot.position.y += distance;
                }
            } else if (key == 'a') {
                if (this.dot.position.z > this.orignalDotPos.z - length) {
                    this.dot.position.z -= distance;
                }
            } else if (key == 's') {
                if (this.dot.position.y > this.orignalDotPos.y - length / 2) {
                    this.dot.position.y -= distance;
                }
            } else if (key == 'd') {
                if (this.dot.position.z < this.orignalDotPos.z + length) {
                    this.dot.position.z += distance;
                }
            } else if (key == 'r') {
                this.dot.position.set(
                    this.orignalDotPos.x,
                    this.orignalDotPos.y,
                    this.orignalDotPos.z
                );
            }
        }
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

        this.boundingSphere.center.copy(this.position);
        TWEEN.update();

        if (this.position.y < -5) {
            // set score to 0
            document.getElementById('score-content').innerText = 0;

            // TODO: trigger lose screen
            let deathScreen = document.getElementById('death');
            deathScreen.style.visibility = 'visible';
            deathScreen.style.opacity = 1;
            this.velocity = new Vector3();
            setTimeout(() => {
                document.getElementById('death').style.opacity = 0
                this.state.reset();
            }, 500);
            // reset position:
            const listener = new AudioListener();
            const sound = new Audio(listener);
            const audioLoader = new AudioLoader();
            audioLoader.load(
                'https://raw.githubusercontent.com/msnxus/Froggin/ca5fd1b232fd4bd2651bed0fd66330a447b1134c/src/sounds/death.wav',
                function (buffer) {
                    sound.setBuffer(buffer);
                    sound.setLoop(false);
                    sound.setVolume(0.5);
                    sound.play();
                }
            );
        }
    }
}

export default Frog;
