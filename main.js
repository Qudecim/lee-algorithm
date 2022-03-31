let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let size = {
    width: 500,
    height: 500,
    box: 50
}

let hero = {
    x: 1,
    y: 1
}

let enemy = {
    x:9,
    y:9,
    type:'build'
}

let matrix = generateMap()
console.log(matrix)

// CALCULATE

/**
 * Generate map
 */
function generateMap() {
    let map = []

    for (let y = 0; y < size.width / size.box; y++) {
        map.push([])
        for (let x = 0; x < size.height / size.box; x++) {
            let is_can_go = true
            if (Math.random() > 0.9) {
                is_can_go = false
            }
            map[y].push({number:-1, type:'ground', can_go: is_can_go})
        }
    }
    map[enemy.y][enemy.x].type = enemy.type
    return map
}

/**
 *
 * @param start_x
 * @param start_y
 * @param need_type
 * @returns {[{x: number, y: number, step: number}]|boolean}
 */
function steps(start_x, start_y, need_type) {
    let x_max = size.width / size.box
    let y_max = size.height / size.box
    let finish_x = -1
    let finish_y = -1
    let step = 0
    matrix[start_y][start_x].number = 0

    // Count steps
    let stop = false
    while (!stop && step < 50) {
        stop = true

        for (let y = 0; y < y_max; y++) {
            for (let x = 0; x < x_max; x++) {
                if (matrix[y][x].number === step) {
                    stop = false
                    if (matrix[y][x].type === need_type) {
                        finish_x = x
                        finish_y = y
                        stop = true
                    }

                    // Лево
                    setStep(x - 1, y, step + 1)

                    // Верх
                    setStep(x, y - 1, step + 1)

                    // Право
                    setStep(x + 1, y, step + 1)

                    // Вниз
                    setStep(x, y + 1, step + 1)

                }
            }
        }
        step++
    }

    if (finish_y === -1) {
        return false
    }

    // Get path
    stop = false
    let path = [{
        x: finish_x,
        y: finish_y,
        step: step
    }]
    let i = 0
    while (!stop && i < 100) {
        let current = path[path.length - 1]
        i++
        if (current.x === start_x && current.y === start_y) {
            stop = true
            continue
        }

        // LEFT
        let currentStep = backStep(current.x - 1, current.y, step)
        if (currentStep) {
            path.push(currentStep)
            continue
        }

        // UP
        currentStep = backStep(current.x, current.y - 1, step)
        if (currentStep) {
            path.push(currentStep)
            continue
        }

        // RIGHT
        currentStep = backStep(current.x + 1, current.y, step)
        if (currentStep) {
            path.push(currentStep)
            continue
        }

        // DOWN
        currentStep = backStep(current.x, current.y + 1, step)
        if (currentStep) {
            path.push(currentStep)
            continue
        }


    }

    console.log(path)

    return path


}

/**
 * Can go
 * @param x
 * @param y
 * @returns {boolean}
 */
function isCanGo(x,y) {
    return matrix[y][x].can_go
}

/**
 * Set step
 * @param x
 * @param y
 * @param step
 */
function setStep(x, y, step) {
    if (matrix[y] !== undefined) {
        if (matrix[y][x] !== undefined) {
            if (isCanGo(x, y)) {
                if (matrix[y][x].number === -1) {
                    matrix[y][x].number = step
                }
            }
        }
    }
}

function backStep(x, y, step)
{
    if (matrix[y] !== undefined) {
        if (matrix[y][x] !== undefined) {
            if (matrix[y][x].number > 0 && matrix[y][x].number < step) {
                return {
                    x: x,
                    y: y,
                    step: matrix[y][x].number
                }
            }
        }
    }
    return false
}


// DRAWING
/**
 * Draw lines
 */
function draw() {
    for (let step = 0; step <= size.height / size.box; step++) {
        ctx.fillRect(step * size.box, 0, 1, size.height)
        ctx.fillRect(0, step * size.box, size.width, 1)
    }
}

/**
 * Draw point (Hero, Enemy)
 * @param x
 * @param y
 * @param color
 */
function drawPoint(x, y, color = 'black') {
    ctx.fillStyle = color;
    ctx.fillRect(x * size.box, y * size.box, size.box, size.box)
}

/**
 * Draw numbers
 * @param number
 * @param x
 * @param y
 */
function drawNumber(number, x, y) {
    ctx.font = "24px serif";
    ctx.textAlign = 'center';
    ctx.textBaseline  = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(number, x * size.box + (size.box / 2), y * size.box + (size.box / 2), size.box)
}

/**
 * Draw steps
 */
function drawSteps() {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (isCanGo(x, y)) {
                drawNumber(matrix[y][x].number, x, y)
            } else {
                drawPoint(x, y, 'red')
            }
        }
    }
}


/**
 * Draw path
 * @param path
 */
function drawPath(path) {
    ctx.beginPath();
    let last = path[0]
    ctx.moveTo(last.x  * size.box + (size.box/2), last.y * size.box + (size.box/2));
    for (let i = 0; i < path.length; i++) {
        let current = path[i]
        ctx.lineTo(current.x * size.box + (size.box/2), current.y * size.box + (size.box/2));
    }
    ctx.stroke();
}


// INIT
drawPoint(hero.x, hero.y);
drawPoint(enemy.x, enemy.y);

draw()
let path = steps(hero.x, hero.y, 'build')
if (path) {
    drawPath(path)
}
drawSteps()
