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

    extend(position, angle) {
        if(!this.extending) {
            this.extending = true;
            let totalRotation = angle.y - Math.PI / 2;

            let xDist = 35 * -Math.sin(totalRotation);
            let zDist = 35 * -Math.cos(totalRotation);
            let yDist = 5;

            const finalPosition = new Vector3(position.x + xDist, position.y + yDist, position.z + zDist);
            this.finalPosition = finalPosition.clone();
            this.direction = new Vector3(xDist, 0, zDist);

            // Create a material with pink color
            let material = new LineBasicMaterial({ color: 0xff00ff }); // Pink color

            // Define the geometry for the line (in this case, a simple straight line)
            let geometry = new BufferGeometry().setFromPoints([
                position.clone(), position.clone() // Start with zero length
            ]);

            // Create the line and apply the material
            this.tongue = new Line(geometry, material);

            this.add(this.tongue);

            const extendDuration = 100; // Duration for extending in milliseconds

            this.motion = new TWEEN.Tween({ progress: 0 })
                .to({ progress: 1 }, extendDuration) // Tween duration: duration (ms)
                .onUpdate(({ progress }) => {
                    this.tongue.geometry.setFromPoints([position.clone(), finalPosition.clone().multiplyScalar(progress)]);
                    this.tongue.geometry.verticesNeedUpdate = true;
                    this.tongue.geometry.computeBoundingSphere();
                })
                .onComplete(() => {
                    this.retract(position); // Call retract after extend animation is complete
                })
                .start();
        }
    }

    retract(position) {
        const retractDuration = 100;

        this.motion = new TWEEN.Tween({ progress: 0 })
            .to({ progress: 1 }, retractDuration) // Tween duration: duration (ms)
            .onUpdate(({ progress }) => {
                this.tongue.geometry.setFromPoints([position.clone(), this.finalPosition.clone().multiplyScalar((1-progress))]);
                this.tongue.geometry.verticesNeedUpdate = true;
                this.tongue.geometry.computeBoundingSphere();
            })
            .onComplete(() => {
                this.remove(this.tongue);
                this.finalPosition = new Vector3();
                this.direction = new Vector3();
                this.extending = false;
            })
            .start();
    }
}

export default Tongue;