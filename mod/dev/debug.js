function zapDebug() {
    if (debug || !debug) return

    lab.attach( new HUD() )

    env.stat = {}
    env.dump = {}
    env.tag = '=== debug ==='

    if (debug) {
        lab.attach( new CityMap() )

        trap.register('keyDown', (e) => {
            if (e.code === 'F1') {
                if (lab.cam === lab.hero.cam) {
                    lab.cam = lab.freeCam
                    vec3.copy(lab.cam.pos, lab.hero.pos)
                    lab.cam.pos[1] += 20
                    lab.cam.mover.capture()
                } else {
                    lab.cam = lab.hero.cam
                    lab.hero.mover.capture()
                }
                e.preventDefault()
            }
        })
    }

    // extend screw VM with extensions and debug opcodes

    // ring
    const PR = 25
    geo.ops.push(() => {
        const ir = pop(), v = [], w = []

        for (let lon = 0; lon < PR; lon++) {
            let phi = (lon * PI2) / PR,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < PR; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % PR) * 3

                w.push(
                    v[at2],    0,  v[at2+2],
                    v[at],     0,  v[at+2], 
                    v[at2]*ir, 0,  v[at2+2]*ir,

                    v[at],     0,  v[at+2],
                    v[at]*ir,  0,  v[at+2]*ir,
                    v[at2]*ir, 0,  v[at2+2]*ir

                    /*
                    v[at]*ir,  0,  v[at]*ir,
                    v[at],     0,  v[at],
                    v[at2]*ir, 0,  v[at2]*ir,

                    v[at2]*ir, 0,  v[at2]*ir,
                    v[at],     0,  v[at],
                    v[at2],    0,  v[at2]
                    */
                )
        }
        g.v = g.v.concat(w)
    })

    // tetrahedron
    geo.ops.push(() => {
        g.v = g.v.concat([
            -1, 1,-1,   -1,-1, 1,   1, 1, 1,
             1, 1, 1,    1,-1,-1,  -1, 1,-1, 
            -1,-1, 1,    1,-1,-1,   1, 1, 1,
            -1, 1,-1,    1,-1,-1,  -1,-1, 1,
        ])
    })

    // cone
    geo.ops.push(() => {
        const v = [], w = []

        for (let lon = 0; lon < PR; lon++) {
            let phi = (lon * PI2) / PR,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < PR; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % PR) * 3

                w.push(
                    0,  1,  0,
                    v[at2], -1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at2], -1,  v[at2+2],
                    0,      -1,  0,
                    v[at],  -1,  v[at+2]
                )
        }
        //g.v = g.v.concat(w)
    })


    // dump
    geo.ops.push(() => {
        const b = [],
            M = geo.cM(),
            s = geo.cs()

        b.push('=== matrix ===\n')
        M.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 4 === 3) b.push('\n')
        })

        b.push('\n=== stack ===\n')
        s.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 3 === 2) b.push('\n')
        })

        const d = b.join('')
        console.log(d)
        term.println('\n' + d)
        console.dir(M)
        console.dir(s)
    })

    // dumpv
    geo.ops.push(() => {
        const b = [],
              g = geo.cg()

        b.push('\n=== vertices ===\n')
        g.v.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 9 === 8) b.push('\n')
            else if (i % 3 === 2) b.push('    ')
        })

        const d = b.join('')
        console.log(d)
        term.println('\n' + d)
        console.dir(g.v)
    })

    /*
    // if we want to have autostart for sandboxes
    window.onhashchange = () => {
        start()
    }
    */
}
