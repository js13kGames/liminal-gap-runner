const lab = new Frame()

lab.attach( new Camera({
    name: 'cam',
    vfov: 45,
    pos: vec3(0, 0, 0),

    pushers: new Float32Array(SHIFT_ROLL+1),
    speed: 30,
    turnSpeed: 2,

    init: function() {
        lab.broker = this
    },

    push: function(action, factor, dt) {
        const speed = this.speed
        const turnSpeed = this.turnSpeed
        switch(action) {
            case FORWARD:
                this.moveZ(-speed * dt)
                break
            case LEFT:
                this.moveX(-speed * dt)
                break
            case BACKWARD:
                this.moveZ(speed * dt)
                break
            case RIGHT:
                this.moveX(speed * dt)
                break
            case UP:
                this.moveY(speed * dt)
                break
            case DOWN:
                this.moveY(-speed * dt)
                break

            case LOOK_LEFT:
                this.yaw(turnSpeed * dt)
                break
            case LOOK_RIGHT:
                this.yaw(-turnSpeed * dt)
                break
            case LOOK_UP:
                this.pitch(-turnSpeed * dt)
                break
            case LOOK_DOWN:
                this.pitch(turnSpeed * dt)
                break
            case ROLL_LEFT:
                this.roll(turnSpeed * dt)
                break
            case ROLL_RIGHT:
                this.roll(-turnSpeed * dt)
                break

            case SHIFT_YAW:
                this.yaw(turnSpeed * factor * dt)
                break
            case SHIFT_PITCH:
                this.pitch(turnSpeed * factor * dt)
                break
            case SHIFT_ROLL:
                this.roll(turnSpeed * factor * dt)
                break
        }
    },

    evo: function(dt) {
        let dir, len

        if (this.lookAt) {
            // fix the camera on the target coordinates
            dir = vec3.isub(this.lookAt, this.pos)
            len = vec3.len(dir)
            vec3.normalize(dir)
        }

        // activate pushers
        for (let i = 0; i < this.pushers.length; i++) {
            const f = this.pushers[i]
            if (f) {
                this.push(i, f, dt)
                if (i > 20) this.pushers[i] = 0 // reset the mouse movement accumulation buffers
            }
        }

        if (debug) {
            const p = this.pos, l = this.lookAt

            let cx = Math.round(p[0]),
                cy = Math.round(p[1]),
                cz = Math.round(p[2])
            const sPos = `@${cx}:${cy}:${cz}`

            const pdir = vec3.toSpherical(this.dir)
            const sDir = ' ^' + Math.round(pdir[1] * RAD_TO_DEG) + '*'
                              + Math.round(pdir[2] * RAD_TO_DEG) + '*'

            let sLookAt = ''
            if (l) {
                let lx = Math.round(l[0] * 100)/100,
                    ly = Math.round(l[1] * 100)/100,
                    lz = Math.round(l[2] * 100)/100
                sLookAt = ` => ${lx}:${ly}:${lz}`
            }

            env.status = 'cam: ' + sPos + sDir + sLookAt
        }

    },

    jumpNext: function() {
        const id = Math.floor(Math.random() * lab._ls.length)
        const next = lab._ls[id]
        this.lookAt = next.pos
    },
    looseIt: function() {
        this.lookAt = 0
        vec3.set(this.pos, 0, 0, 0)
    },

    activate(action) {
        this.pushers[action] = 1
    },

    stop(action) {
        this.pushers[action] = 0
    },

    onMouseMove(e) {
        if (e.buttons != 1) return
        const dx = e.movementX, dy = e.movementY

        if (dx) {
            if (e.shiftKey) {
                // accumulate mouse roll
                this.pushers[SHIFT_ROLL] += dx
            } else {
                // accumulate horizontal mouse movement
                this.pushers[SHIFT_YAW] += dx
            }
        }
        if (dy) {
            // accumulate vertical mouse movement
            this.pushers[SHIFT_PITCH] += dy
        }
    }
}))


_.onStart = () => {

    for (let i = 0; i < 0; i++) {
        const B = 60
        const H = B/2
        lab.attach( new Cube({
            pos: vec3(
                H - B*rnd(),
                H - B*rnd(),
                H - B*rnd()
            ),
            rot: vec3(0, 0, 0),
            scale: vec3(1, 1, 1)
        }))
    }

    for (let i = 0; i < 128; i++) {
        const B = 60
        const H = B/2

        let g
        switch( Math.floor(rnd()*3) ) {
            case 0:
                g = geo.gen().plane().scale(.5 + rnd() * 2).bake()
                break
            case 1:
                g = geo.gen().cube().scale(.5 + rnd() * 2).bake()
                break
            case 2:
                g = geo.gen().sphere().scale(.5 + rnd() * 2).bake()
                break
        }
        const spin = (rnd()*4) < 1? 0 : 1

        lab.attach( new Mesh({
            pos: vec3(
                H - B*rnd(),
                H - B*rnd(),
                H - B*rnd()
            ),
            rot:   vec3(0, 0, 0),
            rotSpeed: vec3(0, 0, 0),
            scale: vec3(1, 1, 1),
            geo: g,

            init() {
                this.rotSpeed[0] += (rnd() < .5? -1 : 1) * (.5 + rnd()*3) * spin
                this.rotSpeed[1] += (rnd() < .5? -1 : 1) * (.2 + rnd()*1.5) * spin
            },

            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[1] * dt 
            },
        }))
    }

}
