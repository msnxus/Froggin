import { Vector3 } from 'three';

const SceneParams = {
  // Variables for simulation state; 
    // ====================================================================
    //                     Physical Constants
    // ====================================================================
    // Damping coefficient for integration
    DAMPING: 0.03,

    // Mass of our frog
    MASS:0.1,

    // Jump scalar
    JUMP_POWER: 0.1,

    // Acceleration due to gravity, scaled up experimentally for effect.
    GRAVITY: 5,
    // The timestep (or deltaT used in integration of the equations of motion)
    // Smaller values result in a more stable simulation, but becomes slower.
    // This value was found experimentally to work well in this simulation.
    TIMESTEP: 18 / 1000,

    // bounding spheres
    DEBUGGING: false,
    FROG_RADIUS: 1.2,
    LILYPAD_RADIUS: 2.2,
    LILYPAD_BOUNDING_OFFSET:  new Vector3(-.9, 0, -.5),


}

export default SceneParams;

