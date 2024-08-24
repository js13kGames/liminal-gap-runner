const debug = 1

let nfps = 0
const ifps = []

const flags = {},
    // keyboard controls
    FORWARD    = 1,
    LEFT       = 2,
    BACKWARD   = 3,
    RIGHT      = 4,
    UP         = 5,
    DOWN       = 6,
    LOOK_UP    = 7,
    LOOK_LEFT  = 8,
    LOOK_DOWN  = 9,
    LOOK_RIGHT = 10,
    ROLL_LEFT  = 11,
    ROLL_RIGHT = 12,
    // mouse controls
    SHIFT_YAW   = 21,
    SHIFT_PITCH = 22,
    SHIFT_ROLL  = 23

const env = {
    time: 0,
    fps: 60,

    bind: [
        '',
        // movement controls
        'KeyW', 
        'KeyA',
        'KeyS',
        'KeyD',
        'KeyE',
        'KeyC',
        'ArrowUp',
        'ArrowLeft',
        'ArrowDown',
        'ArrowRight',
        'PageUp',
        'PageDown',

        // ...
    ],

    directionalLightVector: vec3(0, 0, 1),

    status: '',
    tag: 'debug',
    dump: {},
}

