import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './waterfall.glb';

class Pond extends Group {
    constructor(frog) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();
        
        this.name = 'pond';
        this.offset = frog.position.clone();

        // Lilly Pad by Jarlan Perez [CC-BY] via Poly Pizza
        loader.load(MODEL, (gltf) => {
            let scale = 100;
            // let scale = 2000;

            gltf.scene.scale.set(scale, scale, scale);
            gltf.scene.position.set(70, 0, 0).add(this.offset);
            // gltf.scene.position.set(0, -40, 0);
            gltf.scene.rotation.y = Math.PI;
            this.add(gltf.scene);
        });
    }
}

export default Pond;
