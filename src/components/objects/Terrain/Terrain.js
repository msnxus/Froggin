import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GRASSPOND from './grassPond.glb';
import WOODS from './woods.glb';
import DESERT from './desert.glb';
import CAVE from './cave.glb';

import { WebGLAttributes } from 'three/src/renderers/webgl/WebGLAttributes';



class Terrain extends Group {
    constructor(frog) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();
        
        this.offset = frog.position.clone();
        // CAVE -> Cave Scene | Draft 1 by Danni Bittman [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/2VmWkpO6OvK)
        // GRASSPOND -> Pond by Jarlan Perez [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/1XazZeNBWG_)
        // WOODS -> Nature by 3Donimus [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/0nsE2b8uXZy)
        // DESERT -> Desert by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/a1HnTCHfE34)
        const SCENES = [CAVE, DESERT, WOODS, GRASSPOND];
        const randNum = Math.floor(Math.random() * SCENES.length);
        this.name = SCENES[randNum];

        loader.load(SCENES[randNum], (gltf) => {
            let caveScale = 30;
            let scale = 100;
            let grassScale = 255;
            let woodsScale = 50;
            let desertScale = 0.2;
            

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
            if(SCENES[randNum] == CAVE) {
                gltf.scene.scale.set(caveScale, caveScale, caveScale);
                gltf.scene.position.set(100, -20, 20).add(this.offset);
                gltf.scene.rotation.y = Math.PI / 2;

            }
            this.add(gltf.scene);
        });
        
        
        
    }
}

export default Terrain;
