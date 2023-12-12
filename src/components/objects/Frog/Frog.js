import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Frog.glb';
import SceneParams from '../../../params';

class Frog extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            jump: (power) => this.jump(power), // or this.jump.bind(this)
            twirl: 0,
            reset: () => {
                this.position.x = 0;
                this.position.y = 0;
                this.position.z = 0;
            },
        };

        // for jumping
        this.velocity = new Vector3(0, 0, 0);
        this.onGround = true;

        // Load object
        // Frog by Poly by Google [CC-BY] via Poly Pizza
        const loader = new GLTFLoader();

        this.name = 'frog';
        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(0.01, 0.01, 0.01);
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        this.state.gui.add(this.state, 'bob');
        this.state.gui.add(this.state, 'jump');
        this.state.gui.add(this.state, 'reset');
    }

    jump(power) {
        if (this.onGround) {
            this.velocity.add(new Vector3(0, power*SceneParams.JUMP_POWER, 0));
            this.onGround = false;
        }
    }

    
    update(timeStamp) {
        if (this.state.bob) {
            // Bob back and forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        // update position
        this.position.add(this.velocity.clone().multiplyScalar(SceneParams.TIMESTEP))
        // if in the air
        if (!this.onGround) {
            // apply gravity
            this.velocity.add(new Vector3(0, -SceneParams.GRAVITY, 0));
            
        }
        
        // check for collision with ground
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity = new Vector3(0, 0, 0);
            this.onGround = true;
        } else {
            console.log(this.velocity)
        }
        // Prevent the frog from going below ground level
        // TODO: change this to checking lillypad
        
    }
}

export default Frog;
