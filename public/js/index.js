var speedMap = {
    75: 'Easy',
    100: 'Medium',
    125: 'Hard'
}

// map from key to direction
var keyMap = {
    65: 3,
    37: 3,
    87: 0,
    38: 0,
    68: 1,
    39: 1,
    83: 2,
    40: 2
}

var gameStarted = false;
var animationInterval = null;

jQuery(() => {
    // setup the game
    // -> Create a snake
    let c = $('#game-area').get(0)

    c.height = c.offsetHeight - (c.offsetHeight % 60)
    c.width = c.offsetWidth - (c.offsetWidth % 60)

    var endGame = (win, score) => {
        let msg = win ? 'You win!' : 'Game Over! You scored: ' + score
        clearInterval(animationInterval)

        // reset the game
        if (!alert(msg)) { window.location.reload(); }
    }

    var snakeBoard = new Snake(c, c.width / 60, endGame);
    // -> setup an interval to run the snake's draw function

    function setSpeed(num) {
        localStorage.setItem('speed', num)
        $('#level-dropdown').text(speedMap[num])

        if (gameStarted) {
            clearInterval(animationInterval)
            animationInterval = setInterval(() => { snakeBoard.draw() }, num)
        }
    }

    let s = localStorage.getItem('speed') || 100;
    setSpeed(s)

    $('#easy-button').on('click', () => setSpeed(75))
    $('#med-button').on('click', () => setSpeed(100))
    $('#hard-button').on('click', () => setSpeed(125))

    var startGame = () => {
        gameStarted = true;
        animationInterval = setInterval(() => { snakeBoard.draw() }, parseInt(localStorage.getItem('speed')))
    }

    // Snake controller
    let handleKey = function (e) {
        if (e.which in keyMap) {
            // set the direction of the snake to the new direction (only if valid)
            if (Math.abs(snakeBoard.direction - keyMap[e.which]) != 2 || !gameStarted)
                snakeBoard.direction = keyMap[e.which]

            if (!gameStarted)
                startGame()

        }
    }

    $(document).on('keydown', handleKey);
})

// Draw a canvas and add squares to it based on the game state
class Snake {
    constructor(canvas, squareWidth, stopGame) {
        this.canvas = canvas
        this.squareWidth = squareWidth
        this.apple = -1
        this.toAdd = 0;
        this.direction = 0;
        this.stopGame = stopGame

        this.squares = {}
        for (let i = 0; i < canvas.width / squareWidth; i += 1) {
            for (let j = 0; j < canvas.height / squareWidth; j += 1) {
                this.squares[i + j * canvas.width / squareWidth] = false;
            }
        }

        this.body = [new Square(0, 0)]
        this.squares[0] = true;

        let ctx = this.canvas.getContext('2d')
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, squareWidth, squareWidth)

        this.drawApple()
    }

    drawApple() {
        let available = Object.entries(this.squares).filter((v) => !v[1])
        if (available.length == 0) {
            this.stopGame(true, this.body.length)
        }

        let sq = available[Math.floor(Math.random() * available.length)][0]
        let ctx = this.canvas.getContext('2d')
        ctx.fillStyle = 'red'
        ctx.fillRect((sq % (this.canvas.width / this.squareWidth)) * this.squareWidth, Math.floor((sq / (this.canvas.width / this.squareWidth))) * this.squareWidth, this.squareWidth, this.squareWidth)
        this.apple = sq
    }

    // return false if the new coordinates intersect with a snake body part or the edge of the board
    positionValid(x, y) {
        if (x >= this.canvas.width / this.squareWidth || x < 0 || y < 0 || y >= this.canvas.height / this.squareWidth)
            return false

        return !this.squares[x + y * this.canvas.width / this.squareWidth]
    }

    // Store all of the sqaures that the snake takes up in a list (of coordinates)
    // every frame, remove the last square and draw the square at the start of the new direction
    draw() {
        let ctx = this.canvas.getContext('2d')

        // calculate the new position:
        let front = this.body[this.body.length - 1]
        let newX = (this.direction % 2) * (2 - this.direction) + front.x
        let newY = (this.direction % 2 - 1) * (1 - this.direction) + front.y

        // check if newX and Y are valid
        if (!this.positionValid(newX, newY))
            this.stopGame(false, this.body.length)

        if (newX + newY * this.canvas.width / this.squareWidth == this.apple) {
            this.toAdd += 5
            this.drawApple()
        }

        if (this.toAdd == 0) {
            // remove the last square from our list
            let lastSquare = this.body.shift()
            this.squares[lastSquare.x + lastSquare.y * this.canvas.width / this.squareWidth] = false;
            ctx.clearRect(lastSquare.x * this.squareWidth, lastSquare.y * this.squareWidth, this.squareWidth, this.squareWidth)
        } else {
            this.toAdd--
        }

        // create a new square at the front
        let newFront = new Square(newX, newY)
        this.body.push(newFront)

        this.squares[newFront.x + newFront.y * this.canvas.width / this.squareWidth] = true;
        ctx.fillStyle = 'black'
        ctx.fillRect(newX * this.squareWidth, newY * this.squareWidth, this.squareWidth, this.squareWidth)
    }

}

// Represents a square in the grid (accounting for width)
class Square {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
