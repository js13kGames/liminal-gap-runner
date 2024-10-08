_.boxCube = function() {
    log('setup a stage with a single cube')

    let enops = screwUp('neogeo cube 2 scale "cube" name brew')
    geo(enops)

    lab.attach( new Form({
        pos: vec3(0, 0, -1),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: glib.cube,
                m: {
                    a: vec3(.5, .6, .7),
                    d: vec3(.1, .8, .9),
                    s: vec3(1, 1, 1),
                    i: vec4(.2, .5, .8, 0),
                    n: 50,
                },
            }),
        ],

        init() {
            this.rotSpeed[0] = .5
            this.rotSpeed[1] = .3 
        },

        evo: function(dt) {
            this.rot[0] += this.rotSpeed[0] * dt
            this.rot[1] += this.rotSpeed[1] * dt 
            this.rot[2] += this.rotSpeed[2] * dt 
        },

    }))

    // move camera back a little
    lab.cam.pos[1] = 1
    lab.cam.pos[2] = 4
}
