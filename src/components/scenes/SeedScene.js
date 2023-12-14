import * as Dat from 'dat.gui';
import { Scene, Color, Camera, Box3, Vector3, FogExp2 } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { Frog, LillyPadGenerator, Pond } from 'objects';
import { BasicLights } from 'lights';
import SceneParams from '../../params';
import AimGuide from '../objects/AimGuide/AimGuide';
<<<<<<< HEAD
import { AudioLoader, Audio, AudioListener } from 'three';
=======

>>>>>>> bbe827a (added AimGuide and changed frog perspective, increase lilypad hitbox, decrease lilypad max height)
class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            rotationSpeed: 0,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee); 
        // this.fogColor = new Color(0xd192a4);

        // Add fog
        // this.fog = new FogExp2(this.fogColor, 0.015);

        // Add meshes to scene
        this.lillyPadGenerator = new LillyPadGenerator();
        this.frog = new Frog(this, this.lillyPadGenerator);
        this.AimGuide = new AimGuide();
        const lights = new BasicLights();
<<<<<<< HEAD
=======
        const pond = new Pond();
        this.add(this.lillyPadGenerator, this.frog, lights, pond, this.AimGuide);
>>>>>>> bbe827a (added AimGuide and changed frog perspective, increase lilypad hitbox, decrease lilypad max height)

        this.pond = new Pond(this.frog);
        this.add(this.lillyPadGenerator, this.frog, lights, this.pond, this.AimGuide);


        // Event listeners
        this.keyDownTime = 0;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // Set up the event listhis.teners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);

        this.hiScore = 0;
    }

    handleKeyDown(event) {
        if (event.key === ' ' && this.keyDownTime === 0) {
            this.keyDownTime = new Date().getTime();
<<<<<<< HEAD
            this.AimGuide.startExtension(
                this.frog.position,
                this.frog.rotation
            );
=======
            this.AimGuide.startExtension(this.frog.position, this.frog.rotation);
>>>>>>> bbe827a (added AimGuide and changed frog perspective, increase lilypad hitbox, decrease lilypad max height)
            // Frog tiltup TWEEN
            this.frog.tiltUp.start();
        } else if (event.key === 'f') {
            SceneParams.FIRSTPERSON = !SceneParams.FIRSTPERSON;
            SceneParams.ENABLEPANNING = !SceneParams.ENABLEPANNING;
<<<<<<< HEAD
        } else if (
            event.key === 'w' ||
            event.key === 'a' ||
            event.key === 's' ||
            event.key === 'd' ||
            event.key === 'r'
        ) {
=======
        } else if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd' || event.key === 'r') {
>>>>>>> bbe827a (added AimGuide and changed frog perspective, increase lilypad hitbox, decrease lilypad max height)
            this.frog.moveDot(0.2, event.key);
        } else if (event.key === 'l') {
            this.frog.position.y += 0.5;
            this.frog.position.x += 5;
        } else if (event.key === 'h') {
            this.frog.position.y += 5;
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
<<<<<<< HEAD
            let duration = Math.min(
                SceneParams.MAX_JUMP_TIME,
                keyUpTime - this.keyDownTime
            );
=======
            let duration = Math.min(SceneParams.MAX_JUMP_TIME, keyUpTime - this.keyDownTime);
>>>>>>> bbe827a (added AimGuide and changed frog perspective, increase lilypad hitbox, decrease lilypad max height)

            this.AimGuide.endExtension();
            this.frog.tiltUp.stop();
            this.frog.rotation.z = 0;

            // Assuming frog is accessible here, otherwise you need to pass it or reference it appropriately
            this.frog.jump(700 * (duration / SceneParams.MAX_JUMP_TIME)); // Adjust this line as per your code structure

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

                    if (this.lillyPadGenerator.current !== pad) {
                        const listener = new AudioListener();
                        const sound = new Audio(listener);
                        const audioLoader = new AudioLoader();
                        audioLoader.load(
                            'https://raw.githubusercontent.com/msnxus/Froggin/ca5fd1b232fd4bd2651bed0fd66330a447b1134c/src/sounds/land.wav',
                            function (buffer) {
                                sound.setBuffer(buffer);
                                sound.setLoop(false);
                                sound.setVolume(0.5);
                                sound.play();
                            }
                        );
                        this.lillyPadGenerator.setNextLillyPad(pad);
                    }
                    pad.stopMovement();

                    // update score
                    let hiScore = localStorage.getItem('high-score', 0)

                    localStorage.setItem('high-score', Math.max(hiScore, pad.index));
                    document.getElementById('score-content').innerText = pad.index;
                    document.getElementById('hi-score-content').innerText = Math.max(hiScore, pad.index);

                    break;
                }
            }
        }
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = -this.frog.rotation.y - Math.PI / 2;

        // this.fog.color = this.fogColor.clone().multiplyScalar(Math.cos(this.frog.position.y / 1000));


        if (!this.frog.onGround) {
            this.checkCollision(this.frog, this.lillyPadGenerator.getPads());
        }
        if(this.frog.generateNewTerrain(this.pond)) {
            const pond = new Pond(this.frog);
            this.pond = pond;
            this.add(this.pond);
            // this.add(pond);
        }
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
