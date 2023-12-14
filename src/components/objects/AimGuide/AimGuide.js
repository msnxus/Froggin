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
} from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import SceneParams from '../../../params';

class AimGuide extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const sphereGeom = new SphereGeometry(0.1, 16, 16);
        const sphereMat = new MeshBasicMaterial({
            color: 'red',
            wireframe: true,
        });

        this.target = new Mesh(sphereGeom, sphereMat);

        this.extension = null; // Property to hold the extension tween
        this.jumpCurveTween1 = null; // holds line extension obviously :D
        this.jumpCurveTween2 = null; // second one

        this.jumpArc1 = new Line(); // Create a line to represent the jump arc
        this.jumpArc2 = new Line(); // second one
    }

    startExtension(position, angle) {
        this.add(this.target);
        let totalRotation = angle.y - Math.PI / 2;

        let xDist = 35 * -Math.sin(totalRotation);
        let zDist = 35 * -Math.cos(totalRotation);

        const finalPosition = new Vector3(position.x + xDist, position.y, position.z + zDist);
        this.target.position.copy(position);

        // Calculate points along the curve with the vertical component due to gravity
        let curvePoints1 = [];
        let curvePoints2 = [];
        const segments = 20;
        const tiltAmount = 0.2; // Adjust the amount of tilt as needed
        const jumpheight = 8; // Jump height modifier

        // Apply tilt to the point
        const axis = new Vector3(xDist, 0, zDist).normalize();
        const quaternion1 = new Quaternion();
        const quaternion2 = new Quaternion();
        quaternion1.setFromAxisAngle(axis, tiltAmount);
        quaternion2.setFromAxisAngle(axis, -tiltAmount);
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = xDist * t;
            const y = Math.sqrt(1 - ((2*t-1)**2));
            const z = zDist * t;

            let point1 = new Vector3(x, y * jumpheight, z);
            let point2 = new Vector3(x, y * jumpheight, z);
        
            curvePoints1.push(point1.applyQuaternion(quaternion1));
            curvePoints2.push(point2.applyQuaternion(quaternion2));
        }

        this.add(this.jumpArc1);
        this.jumpCurveTween1 = this.createJumpArcTween(this.jumpArc1, position, curvePoints1, SceneParams.MAX_JUMP_TIME);

        this.add(this.jumpArc2);
        this.jumpCurveTween2 = this.createJumpArcTween(this.jumpArc2, position, curvePoints2, SceneParams.MAX_JUMP_TIME);
        
        this.jumpCurveTween1.start();
        this.jumpCurveTween2.start();
        this.extension = new TWEEN.Tween(this.target.position).to(finalPosition, SceneParams.MAX_JUMP_TIME).easing(TWEEN.Easing.Quadratic.In);
        this.extension.start();
    } 

    createJumpArcTween(jumpArc, position, curvePoints, duration) {
        let tweenPoints = Array.from(curvePoints);
        const curveGeometry = new BufferGeometry();
        const curveMaterial = new LineBasicMaterial({ color: 0xff0000 }); // Adjust color as needed
        jumpArc.geometry = curveGeometry;
        jumpArc.material = curveMaterial;
        
        // Create a tween to interpolate the parabolic curve
        return new TWEEN.Tween({ progress: 0 })
        .to({ progress: 1 }, duration) // Tween duration: duration (ms)
        .onUpdate(({ progress }) => {
            curvePoints.forEach((point, index) => {
                tweenPoints[index] = position.clone().add(point.clone().multiplyScalar(progress));
            });
            // Update the curve geometry
            curveGeometry.setFromPoints(tweenPoints);
            curveGeometry.verticesNeedUpdate = true;
            curveGeometry.computeBoundingSphere();
        }).easing(TWEEN.Easing.Quadratic.In);
    }

    endExtension() {
        this.extension.stop();
        this.jumpCurveTween1.stop();
        this.jumpCurveTween2.stop();
        //this.remove(this.jumpArc1);
        //this.remove(this.jumpArc2);
        //this.remove(this.target);
    }


}

export default AimGuide;