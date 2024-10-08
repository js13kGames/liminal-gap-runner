// shader attributes
let ctx,
    _a = {},
    _A = [
        'm',
        'n',
        'v',
        'p',
        'uO',
        'ucp',
        'udv',
        'udc',
        'upl',
        'upc',
        'uF',
        'ua',
        'ud',
        'us',
        'un',
        'uT'
    ]

function compileShader(src, type) {
    //const src = document.getElementById(id).innerHTML
    const shader = gl.createShader(type? gl.FRAGMENT_SHADER: gl.VERTEX_SHADER)

    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
    //else {
    //    err(`#${type?'frag':'vert'}: ` + gl.getShaderInfoLog(shader))
    //}
}

function setupShaders() {
    const v = compileShader(_vshader, 0)
    const f = compileShader(_fshader, 1)

    glP = gl.createProgram()
    gl.attachShader(glP, v)
    gl.attachShader(glP, f)
    gl.linkProgram(glP)

    //if (!gl.getProgramParameter(glP, gl.LINK_STATUS)) {
    //    err(gl.getProgramInfoLog(glP))
    //}
}

function setupUniforms() {
    _A.forEach(u => _a[u] = gl.getUniformLocation(glP, u))
}

function setupStage() {
    // setup the stage
    _.defaultStage()
    /*
    let stageFn = _.defaultStage
    if (debug) {
        if (location.hash.startsWith('#box')) {
            const args = location.hash.substring(1).split('/')
            const name = args[0]

            const fn = _[name] || window[name]
            if (!fn) throw `[${name}] is not found!`
            if (args.length > 1) {
                args.shift()
                stageFn = () => { fn(args) }
            } else {
                stageFn = fn
            }
        }
    }
    if (stageFn) stageFn()
    */
    //stageFn()
    //trap('stage')
}

function setupGL() {
    setupShaders()
    setupUniforms()
    gl.useProgram(glP)
}

window.onload = () => {
    gc = document.getElementById('gc')
    gl = gc.getContext('webgl2', {
        alpha: false,
        preserveDrawingBuffer: true,
    })
    gc.onwebglcontextlost = e => e.preventDefault()
    gc.webglcontextrestored = setupGL()
    hc= document.getElementById('hc')
    ctx = hc.getContext('2d')

    //if (!gl) alert('No WebGL!')

    setupGL()

    // run zaps
    //if (debug) {
    //    for (let prop in window) if (prop.startsWith('zap')) {
    //        log(`Zapping [${prop}]!`)
    //        window[prop]()
    //    }
    //} else {
        // zap directly, so they not be optimized
        // zapAudioController()
        // zapTextures()
        zapScrewLib()
        zapPreStage()
    //}
    setupStage()

    window.onresize = expandCanvas
    expandCanvas()
    // trap('start')
    _lt = Date.now()
    cycle()
}
