let gl, glProg, glBuf
let canvas
let lastTime

const env = {
    time: 0,
}

function log(msg) {
    console.log('>' + msg)
}

function expandCanvas() {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight

    canvas.width = newWidth
    canvas.height = newHeight
    canvas.style.width = newWidth + 'px'
    canvas.style.height = newHeight + 'px'
    gl.viewportWidth = canvas.width
    gl.viewportHeight = canvas.height

    draw()
}

function compileShader(id, type) {
    const src = document.getElementById(id).innerHTML
    const shader = gl.createShader(type? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER)

    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
    else {
        log('shader error!')
        log(gl.getShaderInfoLog(shader))
    }
}

function setupShaders() {
    const v = compileShader('v-shader', 1)
    const f = compileShader('f-shader', 0)

    glProg = gl.createProgram()
    gl.attachShader(glProg, v)
    gl.attachShader(glProg, f)
    gl.linkProgram(glProg)

    if (gl.getProgramParameter(glProg, gl.LINK_STATUS)) {
        gl.useProgram(glProg)
    } else {
        log('unable to link the GL program!')
    }
}

function fixBuffers() {
    // TODO load or proceduraly generate our geometry
    const shift = 1 - env.time % 1
    const vertices = new Float32Array([
        // left triangle
         -1,   shift,  .0,
         .0,  .0,  .0,
         -1,  -shift,  .0,

        // right triangle
         shift,    1,  .0,
        .0,   .0,  .0,
         shift,   -1,  .0,
    ])

    glBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuf)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)
}

function setup() {
    canvas = document.getElementById('canvas')
    gl = canvas.getContext('webgl', {
        alpha: false,
    })

    if (!gl) alert('No WebGL!')

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    //gl.clear(gl.COLOR_BUFFER_BIT)

    setupShaders()

    expandCanvas()
    lastTime = Date.now()
    cycle()
}

function evo(dt) {
}

function draw() {
    // TODO maybe change ONLY when resize happens?
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    fixBuffers()

    const vertexPositionAttribute = gl.getAttribLocation(glProg, 'aVertexPosition')
    gl.enableVertexAttribArray(vertexPositionAttribute)
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuf)
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function cycle() {
    const now = Date.now()
    let dt = (now - lastTime) / 1000

    // TODO handle inputs
    // ...
    if (dt > .3) dt = .3
    env.time += dt
    while (dt > .05) {
        evo(.05)
        dt -= .05
    }
    evo(dt)

    draw()

    lastTime = now
    requestAnimationFrame(cycle)
}


window.onload = setup
window.onresize = function() {
    expandCanvas()
}
