import * as Dat from 'dat.gui';
import {
    Scene,
    Color,
    Camera,
    Box3,
    Vector3,
    FogExp2,
    TextureLoader,
    Intersection,
    PlaneGeometry,
    Mesh,
    MeshBasicMaterial,
    Raycaster,
    Quaternion,
} from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { Frog, LillyPadGenerator, Terrain, Fly } from 'objects';
import { BasicLights } from 'lights';
import SceneParams from '../../params';
import AimGuide from '../objects/AimGuide/AimGuide';
import Tongue from '../objects/Tongue/Tongue';
import { AudioLoader, Audio, AudioListener } from 'three';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            rotationSpeed: 0,
            updateList: [],
        };

        this.camera = null;
        this.fliesScore = 0

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);
        this.background = new TextureLoader().load(
            'https://raw.githubusercontent.com/msnxus/Froggin/main/src/components/scenes/stars.jpg'
        );

        // this.fogColor = new Color(0xd192a4);

        // Add fog
        // this.fog = new FogExp2(this.fogColor, 0.015);

        // Add meshes to scene
        this.lillyPadGenerator = new LillyPadGenerator(this);
        this.frog = new Frog(this, this.lillyPadGenerator);
        this.AimGuide = new AimGuide();
        const lights = new BasicLights();


        const planeGeometry = new PlaneGeometry(100000, 100000); // Adjust the size as needed
        const material = new MeshBasicMaterial({ color: 0x6EB5FF }); // Light blue color
        const water = new Mesh(planeGeometry, material);
        water.position.y = -2;
        water.rotation.x = -Math.PI / 2; // Rotates it to be parallel to the ground
        this.water = water;
        this.add(this.water);
        this.water.visible = false;

        this.terrain = new Terrain(this.frog);
        this.scenes = [this.terrain];
        this.add(
            this.lillyPadGenerator,
            this.frog,
            lights,
            this.terrain,
            this.AimGuide
        );

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
        if (!SceneParams.PAUSED) {
            // only allow inputs if the game is not paused
            if (
                event.key === ' ' &&
                this.keyDownTime === 0 &&
                !SceneParams.FIRSTPERSON
            ) {
                if (this.frog.onGround) {
                    this.keyDownTime = new Date().getTime();
                    this.AimGuide.isActive = true;
                    this.AimGuide.startExtension(
                        this.frog.position.clone(),
                        this.frog.rotation,
                        this.lillyPadGenerator.getPads()
                    );
                    // Frog tiltup TWEEN
                    this.frog.tiltUp.start();
                }
            }

            if (this.keyDownTime == 0) {
                if (event.key === 'f') {
                    if (SceneParams.FIRSTPERSON) {
                        SceneParams.FIRSTPERSON = false;
                        this.frog.rotation.z = 0;
                    } else {
                        SceneParams.FIRSTPERSON = true;
                    }
                } else if (
                    SceneParams.FIRSTPERSON &&
                    (event.key === 'w' ||
                        event.key === 'a' ||
                        event.key === 's' ||
                        event.key === 'd')
                ) {
                    this.moveDot(event.key);
                } else if (event.key === 'l' && SceneParams.HACKS_l_k) {
                    this.frog.position.y += 0.5;
                    this.frog.position.x += 5;
                } else if (event.key === 'k' && SceneParams.HACKS_l_k) {
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
        }
    }

    toggleTerrain(value) {
        if (value) {
            this.scenes.forEach((terrain) => {
                terrain.visible = true;
            });
            this.water.visible = false;
        }
        else {
            this.scenes.forEach((terrain) => {
                terrain.visible = false;
            });
            this.water.visible = true;
        }
    }

    moveDot(key) {
        let factor = 8;
        if (key == 'w') {
            if (this.frog.rotation.z < 0.4) {
                new TWEEN.Tween(this.frog.rotation)
                    .to({ z: this.frog.rotation.z + 0.01 * factor }, 100)
                    .start();
            }
        } else if (key == 'a') {
            new TWEEN.Tween(this.frog.rotation)
                .to({ y: this.frog.rotation.y + 0.01 * factor }, 100)
                .start();
        } else if (key == 's') {
            if (this.frog.rotation.z > -0.5) {
                new TWEEN.Tween(this.frog.rotation)
                    .to({ z: this.frog.rotation.z - 0.01 * factor }, 100)
                    .start();
            }
        } else if (key == 'd') {
            new TWEEN.Tween(this.frog.rotation)
                .to({ y: this.frog.rotation.y - 0.01 * factor }, 100)
                .start();
        }
    }

    handleKeyUp(event, frog) {
        if (!SceneParams.PAUSED) {
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

            if (event.key === ' ' && !SceneParams.FIRSTPERSON) {
                const keyUpTime = new Date().getTime();
                let duration = Math.min(
                    SceneParams.MAX_JUMP_TIME,
                    keyUpTime - this.keyDownTime
                );

                this.AimGuide.isActive = false;
                this.AimGuide.endExtension();
                this.frog.tiltUp.stop();
                this.frog.rotation.z = 0;

                // Assuming frog is accessible here, otherwise you need to pass it or reference it appropriately
                this.frog.jump(700 * (duration / SceneParams.MAX_JUMP_TIME)); // Adjust this line as per your code structure

                this.keyDownTime = 0; // Reset the keyDownTime
            } else if (event.key == ' ' && SceneParams.FIRSTPERSON) {
                if (!this.frog.tongue.extending) {
                    this.frog.tongue.extend(this.frog.dot.position);
                

                    // https://stackoverflow.com/questions/63338784/three-js-getworldposition-target-is-now-required-error-message
                    let raycaster = new Raycaster();
                    var cameraPostion = new Vector3();
                    var cameraDirection = new Vector3();
                    this.camera.getWorldPosition(cameraPostion);
                    this.camera.getWorldDirection(cameraDirection);
                    raycaster.set(cameraPostion, cameraDirection);
                    const listener = new AudioListener();
                    const sound = new Audio(listener);
                    const audioLoader = new AudioLoader();
                    audioLoader.load(
                        'https://raw.githubusercontent.com/msnxus/Froggin/main/src/sounds/lick.mp3',
                        function (buffer) {
                            sound.setBuffer(buffer);
                            sound.setLoop(false);
                            sound.setVolume(1);
                            sound.play();
                        }
                    );
                    // Collision with flies
                    this.children.forEach((child) => {
                        if (child.name == 'fly') {
                            // Define the raycaster
                            // let childBounding = child.getWorldBoundingSphere()
                            let intersect = raycaster.intersectObject(child);
                            
                            if (intersect.length && intersect[0].distance > 0 && intersect[0].distance < SceneParams.TONGUE_COLLISION_RANGE) {
                                // intersection
                                this.remove(child);
                                this.fliesScore += 2;
                                this.checkCollision(this.frog, this.lillyPadGenerator.getPads());
                                const listener = new AudioListener();
                                const sound = new Audio(listener);
                                const audioLoader = new AudioLoader();
                                audioLoader.load(
                                    'https://raw.githubusercontent.com/msnxus/Froggin/main/src/sounds/gulp.wav',
                                    function (buffer) {
                                        sound.setBuffer(buffer);
                                        sound.setLoop(false);
                                        sound.setVolume(1);
                                        sound.play();
                                    }
                                );
                            }
                        }
                    });
                }
            }
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
                if (
                    frog.position.y - pad.position.y <= 0 &&
                    frog.velocity.y <= 0
                ) {
                    /// NEW COLLISION!! -------------
                    this.AimGuide.clear();
                    frog.collide(pad);
                    // Handle collision here (e.g., stop the frog, trigger a score increase, etc.)

                    if (this.lillyPadGenerator.current !== pad) {
                        const listener = new AudioListener();
                        const sound = new Audio(listener);
                        const audioLoader = new AudioLoader();
                        audioLoader.load(
                            'https://raw.githubusercontent.com/msnxus/Froggin/main/src/sounds/land.wav',
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
                    let hiScore = localStorage.getItem('high-score', 0);

                    localStorage.setItem(
                        'high-score',
                        Math.max(hiScore, pad.index + this.fliesScore)
                    );
                    document.getElementById('score-content').innerText =
                        pad.index + this.fliesScore;
                    document.getElementById('hi-score-content').innerText =
                        Math.max(hiScore, pad.index + this.fliesScore);

                    break;
                }
            }
        }
    }

    toggleBounding(value) {
        if (value) {
            this.frog.boundingSphereMesh.visible = true;
            this.lillyPadGenerator.getAllPads().forEach((pad) => {
                pad.boundingSphereMesh.visible = true;
            });
            this.children.forEach((child) => {
                if (child.name == 'fly') {
                    child.boundingSphereMesh.visible = true;
                }
            });
        } else {
            this.frog.boundingSphereMesh.visible = false;
            this.lillyPadGenerator.getAllPads().forEach((pad) => {
                pad.boundingSphereMesh.visible = false;
            });
            this.children.forEach((child) => {
                if (child.name == 'fly') {
                    child.boundingSphereMesh.visible = false;
                }
            });
        }
    }

    update(timeStamp, camera) {
        this.camera = camera;
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = -this.frog.rotation.y - Math.PI / 2;

        // this.fog.color = this.fogColor.clone().multiplyScalar(Math.cos(this.frog.position.y / 1000));

        if (!this.frog.onGround) {
            // if frog dies
            if (this.frog.position.y < -3) {
                this.AimGuide.clear();
            }
            this.checkCollision(this.frog, this.lillyPadGenerator.getPads());
        }
        if (this.frog.generateNewTerrain(this.scenes, false)) {
            const terrain = new Terrain(this.frog);
            this.scenes.push(terrain);
            this.terrain = terrain;
            this.add(this.terrain);
            this.terrain.visible = SceneParams.TERRAIN;
        }
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
