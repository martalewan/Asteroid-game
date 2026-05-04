const FULL_CIRCLE = 2 * Math.PI;

export const config = {
    MATH: {
        FULL_CIRCLE,
    },

    SHIP: {
        BODY_RADIUS: 20,

        EYE_RADIUS: 4,
        EYE_OFFSET_X: 8,
        EYE_OFFSET_Y: 5,

        MOUTH_RADIUS: 9,
        MOUTH_OFFSET_Y: 5,

        GUN_WIDTH: 15,
        GUN_HEIGHT: 10,
        GUN_OFFSET_X: 20,

        GUN_BARREL_WIDTH: 3,
        GUN_BARREL_OFFSET_X: 31,

        FLAME_LENGTH: 30,
        FLAME_HEIGHT: 15,
        FLAME_OFFSET: 35,

        VELOCITY_SPEED: 6,
        VELOCITY_SLOWING: 0.9,
        ROTATION_SPEED: 0.15,
        EXPLODE_DURATION: 3000,
    },

    ASTEROID: {
        BASE_SPEED: 3,
        SPAWN_INTERVAL: 2500,
        MAX_RADIUS: 70,
        MIN_RADIUS: 20,
        MIN_SIDES: 5,
        MAX_SIDES: 10,
        STROKE_COLOR: "white"
    },

    BULLET: {
        SPEED: 8,
        SIZE: 10,
        RADIUS: 3,
        COLOR: "white",
    },
};