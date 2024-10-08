const debug = 1

//let nfps = 0
//const ifps = []

const flags = {},
    // keyboard controls
    FORWARD      = 1,
    STRAFE_LEFT  = 2,
    BACKWARD     = 3,
    STRAFE_RIGHT = 4,
    LOOK_UP      = 5,
    LOOK_LEFT    = 6,
    LOOK_DOWN    = 7,
    LOOK_RIGHT   = 8,
    JUMP         = 9,
    // mouse controls
    SHIFT_YAW    = 21,
    SHIFT_PITCH  = 22,
    SHIFT_ROLL   = 23,
    ZOOM_Y       = 24,

    // collider bounding volumes
    HIT_BOX       = 1,
    //HIT_SPHERE    = 2,
    // collider kinds
    EPHEMERAL     = 0,
    HARD          = 1,
    // collision types
    HIT_NONE      = 0,
    HIT_STEP      = 1,
    HIT_HARD      = 2,

    N             = 1,
    W             = 2,
    S             = 3,
    E             = 4,
    K             = 13312,
    env = {
        key: 'liminal-gap-runner/score',
        fnt: '28px monospace',
        cl: '#e06a10',

        time: 0,
        //fps: 60,
        vol: .5,

        // DEBUG
        //groundLevel:    1,
        //showHitboxes:   1,

        bind: [
            '',
            // movement controls
            'KeyW',        // 1..4 - WASD movements
            'KeyA',
            'KeyS',
            'KeyD',
            'ArrowUp',     // 5  - look up
            'ArrowLeft',   // 6  - turn left
            'ArrowDown',   // 7  - look down
            'ArrowRight',  // 8  - turn right
            'Space',       // 9  - jump
            //'KeyE',      // 10-11 - fly up and down 
            //'KeyC',        
            //'Delete',    // 12 - roll left
            //'PageDown',  // 13 - roll right
        ],

        dv: vec3(1, -.5, .7),  // directional light vector
        dc: vec4(1, 1, 1, 1), // directional light color

        pl: [],
        pc: [],

        backfaces: 0,
    }
for (let i = 0; i < 48; i++) env.pl[i] = env.pc[i] = 0
for (let i = 49; i < 64; i++) env.pc[0] = 0

