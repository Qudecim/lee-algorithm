let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let size = {
    width: 500,
    height: 500,
    box: 100
}

let start_point = {
    x: 1,
    y: 1
}

let matrix = []
for (let y = 0; y < size.width / size.box; y++) {
    matrix.push([])
    for (let x = 0; x < size.height / size.box; x++) {
        matrix[y].push({number:-1})
    }
}

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

function steps(start_x, start_y) {
    let x_max = size.width / size.box
    let y_max = size.height / size.box
    let step = 0
    matrix[start_y][start_x].number = 0

    let stop = false
    while (!stop && step < 10) {
        stop = true

        for (let y = 0; y < y_max; y++) {
            for (let x = 0; x < x_max; x++) {
                if (matrix[y][x].number === step) {
                    stop = false

                    // Лево
                    if (x > 0 && matrix[y][x - 1].number === -1) {
                        matrix[y][x - 1].number = step + 1
                    }

                    // Лево - Верх
                    if (x > 0 && y > 0 && matrix[y - 1][x - 1].number === -1) {
                        matrix[y - 1][x - 1].number = step + 1
                    }

                    // Верх
                    if (y > 0 && matrix[y - 1][x].number === -1) {
                        matrix[y - 1][x].number = step + 1
                    }

                    // Верх - Право
                    if (y > 0 && x < x_max - 1 && matrix[y - 1][x + 1].number === -1) {
                        matrix[y - 1][x + 1].number = step + 1
                    }

                    // Право
                    if (x < x_max - 1 && matrix[y][x + 1].number === -1) {
                        matrix[y][x + 1].number = step + 1
                    }

                    // Право - Низ
                    if (x < x_max - 1 && y < y_max - 1 && matrix[y + 1][x + 1].number === -1) {
                        matrix[y + 1][x + 1].number = step + 1
                    }

                    // Вниз
                    if (y < y_max - 1 && matrix[y + 1][x].number === -1) {
                        matrix[y + 1][x].number = step + 1
                    }

                    // Вниз - Лево
                    if (y < y_max - 1 && x > 0 && matrix[y + 1][x - 1].number === -1) {
                        matrix[y + 1][x - 1].number = step + 1
                    }

                }
            }
        }
        step++
    }

    console.log(matrix)

}

draw()
steps(start_point.x, start_point.y)
drawSteps()