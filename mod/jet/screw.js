// generate some sample geometry to fill the library
function zapGeoLib() {
    geo.gen().cube().scale(1).name('cubeOne').brew()
        .gen().cube().scale(2).name('cubeTwo').brew()
        .gen().precision(15).sphere().name('sphereOne').brew()
        .gen().precision(25).sphere().name('sphereTwo').brew()
        .gen().precision(25).smooth().sphere().name('sphereTwo').brew()
        .gen().precision(30).sharp().cylinder().scale(2).name('cilinder').brew()
        .gen().cone().scale(2).name('cone').brew()
}

// screw script parser and interpreter
const screw = (() => {

    // op types
    const END  = 0,
          DEF  = 1,
          NUM  = 2,
          STR  = 3,
          ID   = 4,
    // emu modes
          EMOD = 0,
          DMOD = 1


    // DEBUG
    function dumpToken(t) {
        switch(t.t) {
            case 0: return ';';
            case 1: return `![${t.v}]:`;
            case 2: return `#[${t.v}]`
            case 3: return `"${t.v}"`
            case 4: return `@${t.v}`
        }
    }

    // === EMU ===
    let def = {}, brews = []

    function rerr(msg) {
        throw new Error(`Screw Runtime Error: ${msg}`)
    }

    function defineWords(ops) {
        let st = EMOD, word
        const rops = []

        for (let i = 0; i < ops.length; i++) {
            const op = ops[i]
            if (st) {
                // do definition
                if (op.t === END) {
                    st = EMOD
                } else if (op.t === DEF) {
                    rerr(`Can't define a word [${op.v}] inside another word!`)
                } else {
                    word.push(op)
                }
            } else {
                // filter define and runtime ops
                switch(op.t) {
                    case DEF:
                        st = DMOD
                        word = []
                        word.name = op.v
                        def[op.v] = word
                        break
                    case END:
                        rerr(`Unexpected end of a definition`)
                        break
                    default:
                        rops.push(op)
                }
            }
        }
        return rops
    }

    function exec(ops) {
        for (let i = 0; i < ops.length; i++) {
            const op = ops[i]
            switch(op.t) {
                case NUM:
                case STR:
                    geo.push(op.v);
                    break;
                case ID:
                    const word = def[op.v]
                    if (word) exec(word)
                    else {
                        const a = op.v
                        if (!geo[a]) rerr(`Unknown action [${a}]`)
                        geo[a]()
                        if (a === 'brew') {
                            brews.push(geo.last())
                        }
                    }
                    break
                default:
                    rerr('Unexpected operation: ' + dumpToken(op))
            }
        }
        return brews
    }

    function resetEmuState() {
        defs = {}
        brews = []
    }

    return (src) => {
        resetEmuState()
        return exec( defineWords( screwUp(src) ) )
    }
})();

function screwOne(src) {
    return screw(src).pop()
}

