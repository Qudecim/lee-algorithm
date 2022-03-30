let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let size = {
    width: 500,
    height: 500,
    box: 100
}

let hero = {
    x: 1,
    y: 1
}

let enemy = {
    x:3,
    y:4
}

let matrix = []
for (let y = 0; y < size.width / size.box; y++) {
    matrix.push([])
    for (let x = 0; x < size.height / size.box; x++) {
        matrix[y].push({number:1000, type:'ground'})
    }
}

matrix[enemy.y][enemy.x].type = 'build'

function draw() {

    for (let step = 0; step <= size.height / size.box; step++) {
        ctx.fillRect(step * size.box, 0, 1, size.height)
        ctx.fillRect(0, step * size.box, size.width, 1)
    }

    //drawPoint(start_point.x, start_point.y)
}

function drawPoint(x, y) {
    ctx.fillRect(x * size.box, y * size.box, size.box, size.box)
}

function drawNumber(number, x, y) {
    ctx.font = "24px serif";
    ctx.textAlign = 'center';
    ctx.textBaseline  = 'middle';
    ctx.fillText(number, x * size.box + (size.box / 2), y * size.box + (size.box / 2), size.box)
}

function drawSteps() {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            drawNumber(matrix[y][x].number, x, y)
        }
    }
}

function steps(start_x, start_y, need_type) {
    let x_max = size.width / size.box
    let y_max = size.height / size.box
    let finish_x = -1
    let finish_y = -1
    let step = 0
    matrix[start_y][start_x].number = 0

    let stop = false
    while (!stop && step < 10) {
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
                    if (x > 0 && matrix[y][x - 1].number === 1000) {
                        matrix[y][x - 1].number = step + 1
                    }

                    // Верх
                    if (y > 0 && matrix[y - 1][x].number === 1000) {
                        matrix[y - 1][x].number = step + 1
                    }

                    // Право
                    if (x < x_max - 1 && matrix[y][x + 1].number === 1000) {
                        matrix[y][x + 1].number = step + 1
                    }

                    // Вниз
                    if (y < y_max - 1 && matrix[y + 1][x].number === 1000) {
                        matrix[y + 1][x].number = step + 1
                    }

                }
            }
        }
        step++
    }

    if (finish_y === -1) {
        return false
    }

    stop = false
    let path = [{
        x: finish_x,
        y: finish_y,
        step: step
    }]
    let i = 0
    while (!stop && i < 3) {
        let current = path[path.length - 1]

        if (current.x === start_x && current.y === start_y) {
            stop = true
            continue
        }

        //console.log([matrix[current.y ][current.x - 1].number, current.step])
        if (current.x > 0 && matrix[current.y][current.x - 1].number < current.step) {
            path.push({
                x: current.x - 1,
                y: current.y,
                step: matrix[current.y][current.x - 1].number
            })
            continue
        }

        // Верх
        if (current.y > 0 && matrix[current.y - 1][current.x].number < current.step) {
            path.push({
                x: current.x,
                y: current.y - 1,
                step: matrix[current.y - 1][current.x].number
            })
            continue
        }

        // Право
        if (current.x < x_max - 1 && matrix[current.y][current.x + 1].number < current.step) {
            path.push({
                x: current.x + 1,
                y: current.y,
                step: matrix[current.y][current.x + 1].number
            })
            continue
        }

        // Вниз
        if (current.y < y_max - 1 && matrix[current.y + 1][current.x].number < current.step) {
            path.push({
                x: current.x,
                y: current.y + 1,
                step: matrix[current.y + 1][current.x].number
            })
        }

        i++
    }

    return path


}

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

draw()
let d = steps(hero.x, hero.y, 'build')
console.log(d)
drawPath(d)
drawSteps()

drawPoint(hero.x, hero.y);
drawPoint(enemy.x, enemy.y);