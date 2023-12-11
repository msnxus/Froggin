import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './lilly-pad.glb';

class LillyPad extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'lilly-pad';
        // Lilly Pad by Jarlan Perez [CC-BY] via Poly Pizza
        loader.load(MODEL, (gltf) => {
            let scale = 15
            gltf.scene.scale.set(scale, scale, scale);
            this.add(gltf.scene);
        });
    }
}

export default LillyPad;
