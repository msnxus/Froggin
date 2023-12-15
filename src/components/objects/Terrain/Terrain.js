import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import WATERFALL from './waterfall.glb';
import GRASSPOND from './grassPond.glb';
import WOODS from './woods.glb';
import DESERT from './desert.glb';

import { WebGLAttributes } from 'three/src/renderers/webgl/WebGLAttributes';



class Terrain extends Group {
    constructor(frog) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();
        
        this.offset = frog.position.clone();
        // WATERFALL -> Waterfall scene by Nikki Morin [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/dkbjOPcyB2l)
        // GRASSPOND -> Pond by Jarlan Perez [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/1XazZeNBWG_)
        // WOODS -> Nature by 3Donimus [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/0nsE2b8uXZy)
        // DESERT -> Desert by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/a1HnTCHfE34)
        const SCENES = [DESERT, WOODS, WATERFALL, GRASSPOND];
        const randNum = Math.floor(Math.random() * SCENES.length);
        this.name = SCENES[randNum];

        loader.load(SCENES[randNum], (gltf) => {
            let scale = 110;
            let grassScale = 255;
            let woodsScale = 50;
            let desertScale = 0.2;
            

            gltf.scene.scale.set(scale, scale, scale);
            gltf.scene.position.set(0, 0, 0).add(this.offset);
            gltf.scene.rotation.y = Math.PI;
            if(SCENES[randNum] == GRASSPOND) {
                gltf.scene.scale.set(grassScale, scale, grassScale);
                gltf.scene.position.set(100, -10, 0).add(this.offset);
                gltf.scene.rotation.y = Math.PI / 2;
            }
            if(SCENES[randNum] == WOODS) {
                gltf.scene.scale.set(woodsScale, scale, woodsScale);
                gltf.scene.position.set(110, -20, 0).add(this.offset);
            }
            if(SCENES[randNum] == DESERT) {
                gltf.scene.scale.set(desertScale, desertScale, desertScale);
                gltf.scene.position.set(95, -25, 0).add(this.offset);
            }
            if(SCENES[randNum] == WATERFALL) {
                gltf.scene.scale.set(scale, scale, scale);
                gltf.scene.position.set(95, -10, -10).add(this.offset);
                gltf.scene.rotation.y = Math.PI / 2;

            }
            this.add(gltf.scene);
        });
        
        
        
    }
}

export default Terrain;
