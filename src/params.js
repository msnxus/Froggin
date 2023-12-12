"use strict";

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
  
    // Are we in a first person POV
    FIRSTPERSON: false,
}

export default SceneParams;

