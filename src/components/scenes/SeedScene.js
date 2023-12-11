import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Frog, LillyPad, Pond } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };


        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const lillypad = new LillyPad();
        this.frog = new Frog(this);
        const lights = new BasicLights();
        const pond  = new Pond();
        this.add(lillypad, this.frog, lights, pond);

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
            if (event.key == keyMap.ArrowDown) {
                this.frog.position.x -= 1;
            } else if (event.key == keyMap.ArrowUp) {
                this.frog.position.x += 1;
            } else if (event.key == keyMap.ArrowLeft) {
                this.frog.position.z -= 1;
            } else if (event.key == keyMap.ArrowRight) {
                this.frog.position.z += 1;
            }
        }

        if (event.key === ' ') {
            const keyUpTime = new Date().getTime();
            const duration = keyUpTime - this.keyDownTime;

            // Assuming flower is accessible here, otherwise you need to pass it or reference it appropriately
            this.frog.jump(duration);  // Adjust this line as per your code structure

            this.keyDownTime = 0; // Reset the keyDownTime
        }
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
