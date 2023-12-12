import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Frog.glb';

class Frog extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            jump: (power) => this.jump(power), // or this.jump.bind(this)
            twirl: 10,
            turn: (degrees) => this.turn(degrees),
            move: (distance) => this.move(distance),
            reset: () => {
                this.position.x = 0;
                this.position.y = 0;
                this.position.z = 0;
            },
        };

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
        // Add a simple twirl
        this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + power/400 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    turn(degrees) {
        const turnDuration = 500; // milliseconds to turn
        const turning = new TWEEN.Tween(this.rotation)
        .to({ y: this.rotation.y + degrees}, turnDuration)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();
        
    }

    move(distance, totalRotation) {
        const moveDuration = 500;
        totalRotation -= Math.PI / 2;
        const moveXTween = new TWEEN.Tween(this.position)
        .to({x: this.position.x + distance * -Math.sin(totalRotation)}, moveDuration)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();

        const moveYTween = new TWEEN.Tween(this.position)
        .to({z: this.position.z + distance * -Math.cos(totalRotation)}, moveDuration)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();


        // add a little hop to the movement
        const hopHeight = 0.5;
        const hopDuration = 100;
        const upMovement = new TWEEN.Tween(this.position)
        .to({ y: this.position.y + hopHeight}, hopDuration)
        .easing(TWEEN.Easing.Quadratic.Out);
        const downMovement = new TWEEN.Tween(this.position)
        .to({y: 0}, hopDuration)
        .easing(TWEEN.Easing.Quadratic.Out);

        // Fall down after little hop
        upMovement.onComplete(() => downMovement.start());
        upMovement.start();
    }

    update(timeStamp) {
        if (this.state.bob) {
            // Bob back and forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }

        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Frog;
