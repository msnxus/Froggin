import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './waterfall.glb';

class Pond extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'pond';
        // Lilly Pad by Jarlan Perez [CC-BY] via Poly Pizza
        loader.load(MODEL, (gltf) => {
            let scale = 100

            gltf.scene.scale.set(scale, scale, scale);
            gltf.scene.position.set(0, -4, 0);
            gltf.scene.rotation.y = Math.PI
            this.add(gltf.scene);
        });
    }
}

export default Pond;
