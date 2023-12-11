import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land } from 'objects';
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
        const land = new Land();
        const flower = new Flower(this);
        const lights = new BasicLights();
        this.add(land, flower, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        window.addEventListener('keyup', function (event) {
            // Ignore keypresses typed into a text box
            if (event.target.tagName === 'INPUT') return;
            console.log(event.key);
            // if 'I' was released, download the image
            if (event.key === ' ') {
                flower.spin();
            }

            const keyMap = {
                ArrowUp: 'ArrowUp',
                ArrowDown: 'ArrowDown',
                ArrowLeft: 'ArrowLeft',
                ArrowRight: 'ArrowRight',
            };

            if (Object.keys(keyMap).find((v) => v == event.key)) {
                if (event.key == keyMap.ArrowDown) {
                    flower.position.x -= 1;
                } else if (event.key == keyMap.ArrowUp) {
                    flower.position.x += 1;
                } else if (event.key == keyMap.ArrowLeft) {
                    flower.position.z -= 1;
                } else if (event.key == keyMap.ArrowRight) {
                    flower.position.z += 1;
                }
            }
        });
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
