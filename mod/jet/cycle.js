let gl, glProg
let gcanvas, hcanvas
let _lastTime

function evo(dt) {
    if (env.pause) return
    lab.evo(dt)
}

function drawScene() {
    // TODO move out to a debug node?
    if (debug) {
        env.dump.polygons = 0
    }
    // prepare the framebuffer and the drawing context
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)
    if (env.backfaces) {
        gl.disable(gl.CULL_FACE)
    } else {
        gl.enable(gl.CULL_FACE)
        gl.cullFace(gl.BACK)
    }

    // set model matrix to identity
    mat4.copy(mMatrix, iMatrix)

    // setup up the view and projection transformations
    // TODO merge view and projection into the pv matrix and get it from the camera
    gl.uniformMatrix4fv(_pMatrix, false, lab.cam.projectionMatrix())
    gl.uniformMatrix4fv(_vMatrix, false, lab.cam.viewMatrix())
    gl.uniform3fv(_uCamPos, lab.cam.pos)

    // TODO precalc in _dirLight buffer and use that instead?
    const rnv = vec3.clone(env.directionalLightVector)
    vec3.scale(rnv, -1)
    vec3.normalize(rnv)

    gl.uniform3fv(_uDirectionalLightVector, rnv)
    gl.uniform4fv(_uDirectionalLightColorI, env.directionalLightColorI)

    gl.uniform3fv(_uPointLightPosition, env.pointLightPosition)
    gl.uniform4fv(_uPointLightColorI, env.pointLightColorI)

    // draw the scene graph
    lab.draw()
}


function draw(dt) {
    if (dt > .01) {
        // accumulate FPS
        ifps[nfps++] = 1/dt
        if (nfps > 59) {
            nfps = 0
            // update the average FPS value
            env.fps = (ifps.reduce((v, acc) => acc + v) / ifps.length) << 0
        }
    }

    drawScene()
}

function cycle() {
    const now = Date.now()
    const delta = (now - _lastTime) / 1000
    let dt = delta

    if (dt > .3) dt = .3
    env.time += dt
    while (dt > .2) {
        evo(.2)
        dt -= .2
    }
    evo(dt)

    draw(delta)

    _lastTime = now
    requestAnimationFrame(cycle)
}
