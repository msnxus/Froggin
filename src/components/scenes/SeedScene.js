import * as Dat from 'dat.gui';
import { Scene, Color, Camera, Box3, Vector3 } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { Frog, LillyPadGenerator, Pond } from 'objects';
import { BasicLights } from 'lights';
import SceneParams from '../../params';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        this.lillyPadGenerator = new LillyPadGenerator();
        this.frog = new Frog(this, this.lillyPadGenerator);
        const lights = new BasicLights();
        const pond = new Pond();
        this.add(this.lillyPadGenerator, this.frog, lights, pond);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        // Event listeners
        this.keyDownTime = 0;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // Set up the event listhis.teners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(event) {
        if (event.key === ' ' && this.keyDownTime === 0) {
            this.keyDownTime = new Date().getTime();
            // Frog tiltup TWEEN
            this.frog.tiltUp.start();
        } else if (event.key === 'f') {
            SceneParams.FIRSTPERSON = !SceneParams.FIRSTPERSON;
            SceneParams.ENABLEPANNING = !SceneParams.ENABLEPANNING;
        } else if (event.key === ' ') {
            let duration = Math.min(
                700,
                new Date().getTime() - this.keyDownTime
            );
        } else if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd' || event.key === 'r') {
            this.frog.moveDot(0.2, event.key);
        }

        const keyMap = {
            ArrowUp: 'ArrowUp',
            ArrowDown: 'ArrowDown',
            ArrowLeft: 'ArrowLeft',
            ArrowRight: 'ArrowRight',
        };

        const rotationAmount = Math.PI / 30;
        const movementAmount = 0.5;

        if (Object.keys(keyMap).find((v) => v == event.key)) {
            if (event.key == keyMap.ArrowDown) {
                this.frog.move(-movementAmount, this.frog.rotation.y);
            } else if (event.key == keyMap.ArrowUp) {
                this.frog.move(movementAmount, this.frog.rotation.y);
            } else if (event.key == keyMap.ArrowLeft) {
                if (this.frog.state.holdingTurn) {
                    this.frog.turn(rotationAmount * 4);
                } else {
                    this.frog.state.holdingTurn = true;
                    this.frog.turn(rotationAmount);
                }
            } else if (event.key == keyMap.ArrowRight) {
                if (this.frog.state.holdingTurn) {
                    this.frog.turn(-rotationAmount * 4);
                } else {
                    this.frog.state.holdingTurn = true;
                    this.frog.turn(-rotationAmount);
                }
            }
        }
    }

    handleKeyUp(event, frog) {
        if (event.target.tagName === 'INPUT') return;

        const keyMap = {
            ArrowUp: 'ArrowUp',
            ArrowDown: 'ArrowDown',
            ArrowLeft: 'ArrowLeft',
            ArrowRight: 'ArrowRight',
        };

        if (Object.keys(keyMap).find((v) => v == event.key)) {
            if (
                event.key == keyMap.ArrowLeft ||
                event.key == keyMap.ArrowRight
            ) {
                this.frog.state.holdingTurn = false;
            }
        }

        if (event.key === ' ') {
            const keyUpTime = new Date().getTime();
            let duration = Math.min(700, keyUpTime - this.keyDownTime);

            this.frog.tiltUp.stop();
            this.frog.rotation.z = 0;

            // Assuming frog is accessible here, otherwise you need to pass it or reference it appropriately
            this.frog.jump(duration); // Adjust this line as per your code structure

            this.keyDownTime = 0; // Reset the keyDownTime
        }
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    checkCollision(frog, lillyPads) {
        for (let pad of lillyPads) {
            let padWorldBoundingSphere = pad.getWorldBoundingSphere();
            let frogWorldBoundingSphere = frog.getWorldBoundingSphere();

            // let frogBox = new Box3().setFromObject(frog.boundingSphere);
            // let lilypadBox = new Box3().setFromObject(pad.boundingSphere);
            // frog.boundingSphere.intersectsSphere(pad.boundingSphere)
            if (
                frogWorldBoundingSphere.intersectsSphere(padWorldBoundingSphere)
            ) {
                // console.log(frog.boundingSphere.center)
                if (
                    frog.position.y - pad.position.y <= 0 &&
                    frog.velocity.y <= 0
                ) {
                    frog.collide(pad);
                    // Handle collision here (e.g., stop the frog, trigger a score increase, etc.)
                    console.log(pad.index);
                    break;
                }
            }
        }
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = -this.frog.rotation.y - Math.PI / 2;

        if (!this.frog.onGround) {
            this.checkCollision(this.frog, this.lillyPadGenerator.getPads());
        }
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
