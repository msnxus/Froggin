import {
    Group,
    Vector3,
    Sphere,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Frog.glb';
import SceneParams from '../../../params';

class Frog extends Group {
    constructor(parent, lillyPadGenerator) {
        // Call parent Group() constructor
        super();

        // TiltUp animation
        this.tiltUp = new TWEEN.Tween(this.rotation).to({z: 0.7}, 700);

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            holdingTurn: false,
            jump: (power) => this.jump(power), // or this.jump.bind(this)
            twirl: 0,
            turn: (degrees) => this.turn(degrees),
            move: (distance) => this.move(distance),
            reset: () => {
                this.position.x = 0;
                this.position.y = 0;
                this.position.z = 0;
            },
        };

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

        // Populate GUI
        this.state.gui.add(this.state, 'bob');
        this.state.gui.add(this.state, 'jump');
        this.state.gui.add(this.state, 'reset');
    }

    jump(power) {
        if (this.onGround) {
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
            this.lillyPadGenerator.setNextLillyPad();
        }
    }

    turn(degrees) {
        const turnDuration = 500; // milliseconds to turn
        const turning = new TWEEN.Tween(this.rotation)
            .to({ y: this.rotation.y + degrees }, turnDuration)
            .easing(TWEEN.Easing.Exponential.Out)
            .start();

        // add a little hop to the movement
        if(this.onGround) {
            this.onGround = false;
            const hopHeight = 0.5;
            const hopDuration = 100;
            const upMovement = new TWEEN.Tween(this.position)
                .to({ y: this.position.y + hopHeight }, hopDuration)
                .easing(TWEEN.Easing.Quadratic.Out);
            const downMovement = new TWEEN.Tween(this.position)
                .to({ y: 0 }, hopDuration)
                .easing(TWEEN.Easing.Quadratic.In);
            // Fall down after little hop
            upMovement.onComplete(() => downMovement.start());
            //upMovement.start();
        }
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
                .to({ y: 0 }, hopDuration)
                .easing(TWEEN.Easing.Quadratic.In);

            // Fall down after little hop
            upMovement.onComplete(() => downMovement.start());
            upMovement.start();
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
        const boundingSphereWorld = new Sphere(worldPosition, SceneParams.FROG_RADIUS); // Use the same radius as your local bounding sphere
        return boundingSphereWorld;
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
        // Prevent the frog from going below ground level
        TWEEN.update();
    }
}

export default Frog;
