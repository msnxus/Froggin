import { Vector3 } from 'three';

const SceneParams = {
    // Variables for simulation state;
    // ====================================================================
    //                     Physical Constants
    // ====================================================================
    // Damping coefficient for integration
    DAMPING: 0.03,

    // Mass of our frog
    MASS: 0.1,

    // Jump scalar
    JUMP_POWER: 0.1,

    // Acceleration due to gravity, scaled up experimentally for effect.
    GRAVITY: 5,
    // The timestep (or deltaT used in integration of the equations of motion)
    // Smaller values result in a more stable simulation, but becomes slower.
    // This value was found experimentally to work well in this simulation.
    TIMESTEP: 18 / 1000,

    // Camera setting
    FIRSTPERSON: false,
    THIRDPERSONPOV: new Vector3(0, 8, -15),
    FIRSTPERSONPOV: new Vector3(0, 1, 0),
    ENABLEPANNING: false,

    // bounding spheres
    DEBUGGING: false, // also affect aimguide
    FROG_RADIUS: 1.2,
    FROG_BOUNDING_OFFSET: new Vector3(-0.3, 0, 0),
    LILYPAD_RADIUS: 2.5,
    LILYPAD_BOUNDING_OFFSET:  new Vector3(-.9, 0, -.5),

    LILYPAD_MAX_Y_OFF: 5,

    // How long until max jump heigh/dist
    MAX_JUMP_TIME: 1400,
    

    // Number of initial pads to render
    NUM_INITIAL_PADS: 2,

    // Furthest a pad can be
    LILYPAD_MAX_JUMP_RADIUS: 20,
};

export default SceneParams;
