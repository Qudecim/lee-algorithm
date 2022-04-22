let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let size = {
    width: 600,
    height: 600,
    box: 30
}

let hero = {
    x: 1,
    y: 1
}

let enemy = {
    x:15,
    y:15,
    type:'build'
}

let options = {
    show_number: false
}

let matrix = generateMap()

// CALCULATE

/**
 * Generate map
 */
function generateMap() {
    let map = []

    for (let y = 0; y < size.width / size.box; y++) {
        map.push([])
        for (let x = 0; x < size.height / size.box; x++) {
            map[y].push({number:-1, type:'ground', can_go: true})
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

    for (let y = 0; y < size.width / size.box; y++) {
        for (let x = 0; x < size.height / size.box; x++) {
            matrix[y][x].number = -1
        }
    }

    let x_max = size.width / size.box
    let y_max = size.height / size.box
    let finish_x = -1
    let finish_y = -1
    let step = 0
    matrix[start_y][start_x].number = 0
    
    // Count steps
    let stop = false
    while (!stop) {
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

                    // Низ - право
                    setStep(x + 1, y + 1, round(step + 1.6))

                    // Низ - Лево
                    setStep(x - 1, y + 1, round(step + 1.6))

                    // Верх - право
                    setStep(x + 1, y - 1, round(step + 1.6))

                    // Верх - Лево
                    setStep(x + 1, y - 1, round(step + 1.6))

                }
            }
        }
        step = getNextStep(step)
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
    while (!stop && i < 500) {
        let current = path[path.length - 1]
        i++
        if (current.x === start_x && current.y === start_y) {
            stop = true
            continue
        }

        let steps = []

        // LEFT
        let currentStep = backStep(current.x - 1, current.y, current.step)
        if (currentStep) {
            steps.push(currentStep)
        }

        // UP
        currentStep = backStep(current.x, current.y - 1, current.step)
        if (currentStep) {
            steps.push(currentStep)
        }

        // RIGHT
        currentStep = backStep(current.x + 1, current.y, current.step)
        if (currentStep) {
            steps.push(currentStep)
        }

        // DOWN
        currentStep = backStep(current.x, current.y + 1, current.step)
        if (currentStep) {
            steps.push(currentStep)
        }

        // UP - LEFT
        currentStep = backStep(current.x - 1, current.y - 1, current.step)
        if (currentStep) {
            steps.push(currentStep)
        }

        // UP - RIGHT
        currentStep = backStep(current.x + 1, current.y - 1, current.step)
        if (currentStep) {
            steps.push(currentStep)
        }

        // DOWN - LEFT
        currentStep = backStep(current.x - 1, current.y + 1, current.step)
        if (currentStep) {
            steps.push(currentStep)
        }

        // DOWN - RIGHT
        currentStep = backStep(current.x + 1, current.y + 1, current.step)
        if (currentStep) {
            steps.push(currentStep)
        }

        if (steps.length) {
            nextStep = steps[0]
            for (let i = 1; i < steps.length; i++) {
                if (nextStep.step > steps[i].step) {
                    nextStep = steps[i]
                }
            }

            path.push(nextStep)
        }
    }
    return path
}

function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}

function getNextStep(step)
{
    let currentStep = 1000
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            if (matrix[y][x].number > step) {
                if (matrix[y][x].number < currentStep) {
                    currentStep = matrix[y][x].number
                }
            }
        }
    }

    return currentStep
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

function backStep(x, y, step) {
    if (matrix[y] !== undefined) {
        if (matrix[y][x] !== undefined) {
            if (matrix[y][x].number >= 0 && matrix[y][x].number < step) {
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
 * main draw function
 */
function draw() {

    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,size.width, size.height)

    drawLines()
    drawPoint(hero.x, hero.y);
    drawPoint(enemy.x, enemy.y);

    let path = steps(hero.x, hero.y, 'build')
    if (path) {
        drawPath(path)
    }
    drawSteps()

    setTimeout(draw, 100)
}

/**
 * Draw lines
 */
function drawLines() {
    ctx.fillStyle = 'black'
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
    if (!options.show_number) {
        return
    }
    ctx.font = "18px serif";
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


// CONTROL

function click(event) {
    let pos_x = Math.floor(event.offsetX / size.box)
    let pos_y = Math.floor(event.offsetY / size.box)

    matrix[pos_y][pos_x].can_go = !matrix[pos_y][pos_x].can_go
}

canvas.addEventListener('mousedown', click)


// INIT
draw()

