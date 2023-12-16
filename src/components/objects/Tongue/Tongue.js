import {
    Group,
    Vector3,
    Sphere,
    Line,
    Quaternion,
    LineCurve3,
    BufferGeometry,
    LineBasicMaterial,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    BoxBufferGeometry,
    Scene,
} from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import SceneParams from '../../../params';

class Tongue extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.tongue = new Line();
        this.motion = new TWEEN.Tween();

        this.extending = false;

        this.finalPosition = new Vector3();
        this.direction = new Vector3();
    }

    extend(dotPosition) {
        if (!this.extending) {
            this.extending = true;
            const distance = 5;
    
            const FROG_TONGUE_OFFSET = new Vector3(0.1, 0.1, 0);
            const initPosition = FROG_TONGUE_OFFSET;
    
            this.direction = dotPosition.clone().sub(initPosition).normalize();
            this.finalPosition = this.direction.multiplyScalar(distance);
    
            let material = new MeshBasicMaterial({ color: 0xff00ff }); // Pink color
    
            const width = 0.2; // Width of the rectangle
            const height = 0.05; // Height of the rectangle
            const depth = 0.05; // Depth of the rectangle
    
            let geometry = new BoxBufferGeometry(width, height, depth);
    
            // Create the rectangle and apply the material
            this.tongue = new Mesh(geometry, material);
            this.tongue.position.copy(initPosition);
            this.tongue.lookAt(dotPosition);
            this.add(this.tongue);
    
            const extendDuration = 50; // Duration for extending in milliseconds
    
            this.motion = new TWEEN.Tween({ progress: 0 })
                .to({ progress: 1 }, extendDuration) // Tween duration: duration (ms)
                .onUpdate(({ progress }) => {
                    let geometry = this.tongue.geometry;
                    let updatedGeometry = new BoxBufferGeometry(geometry.parameters.width, geometry.parameters.height, progress * distance);
                    geometry.dispose();
                    this.tongue.geometry = updatedGeometry;

                    const currentPosition = initPosition.clone().lerp(this.finalPosition.clone().multiplyScalar(0.5), progress);
                    this.tongue.position.copy(currentPosition);
                })
                .onComplete(() => {
                    this.retract(initPosition); // Call retract after extend animation is complete
                })
                .easing(TWEEN.Easing.Quadratic.In)
                .start();
        }
    }

    retract(position) {
        const retractDuration = 150;
        const initPosition = position.clone();
        const distance = 6.5;
    
        this.motion = new TWEEN.Tween({ progress: 0 })
            .to({ progress: 1 }, retractDuration) // Tween duration: duration (ms)
            .onUpdate(({ progress }) => {
                let geometry = this.tongue.geometry;
                    let updatedGeometry = new BoxBufferGeometry(geometry.parameters.width, geometry.parameters.height, (1-progress) * distance);

                    // Dispose the old geometry to release memory
                    geometry.dispose();

                    // Apply the updated geometry to the tongue Mesh
                    this.tongue.geometry = updatedGeometry;

                    const currentPosition = this.finalPosition.clone().multiplyScalar(0.5).lerp(initPosition.clone(), progress);
                    this.tongue.position.copy(currentPosition);
            })
            .onComplete(() => {
                this.remove(this.tongue);
                this.finalPosition = new Vector3();
                this.direction = new Vector3();
                this.extending = false;
            })
            .easing(TWEEN.Easing.Quadratic.In)
            .start();
    }
    

    // Function to interpolate vectors given a ratio (0-1)
    lerpVectors(vector1, vector2, alpha) {
        return vector2.clone().multiplyScalar(alpha).add(vector1.clone().multiplyScalar(1-alpha));
    }
}

export default Tongue;