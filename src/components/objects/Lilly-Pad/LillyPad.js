import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './lilly-pad.glb';

class LillyPad extends Group {
    constructor(initialPos) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'lilly-pad';
        if (initialPos) {
            this.position = initialPos;
        }
        // Lilly Pad by Jarlan Perez [CC-BY] via Poly Pizza
        loader.load(MODEL, (gltf) => {
            let scale = 15;
            gltf.scene.scale.set(scale, scale, scale);
            this.add(gltf.scene);
        });
    }

    generateNextPad() {
        const radius = 15;
        const angle = Math.random() * (Math.PI / 2);

        const offset = new Vector3(radius, 0, 0).applyAxisAngle(
            new Vector3(0, 1, 0),
            angle
        );

        const newPad = this.clone();
        newPad.position.add(offset);
        return newPad;
    }
}

export default LillyPad;
