
const CELLS = 20;
const PRIMARY_COLOR = "rgba(0, 0, 0, .25)";
const SECONDARY_COLOR = "rgba(188, 188, 188, 0)";
const SEARCH_COLOR = "#6EB5FF";
const PATH_COLOR = "#FF9CEE";
const LAST_EXPLORED_COLOR = '#FF60A8';
const START_COLOR = "#5ac18e";
const END_COLOR = "#ff4040";
const WALL_COLOR = "black";

let timerInterval = null;
let rendererInterval = null;

let runMaze = false


function createCanvas() {
    let body = document.getElementById("body");
    let canvas = document.createElement("canvas");
    canvas.id = 'canvas';
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    body.appendChild(canvas);
    return canvas
}


function load() {
    createCanvas();
    let maze = createMaze();
    let newMazeButton = document.getElementById('new-maze');
    newMazeButton.addEventListener('click', event => {
        let maze = createMaze();
        setupRerunButton(maze);
        runAStar(maze);
    });
    setupRerunButton(maze);
    setupPopup()
    runAStar(maze)
}

function setupPopup() {
    document.getElementById("disable-popup").onclick = disableInfoPopup
    let cookies = document.cookie
    if (cookies.includes("disable-popup")) {
        disableInfoPopup()
    }
}

function disableInfoPopup() {
    document.getElementById('popup-container').setAttribute("hidden", "")
    runMaze = true
    document.cookie = "disable-popup=true"
}

function setupRerunButton(maze) {
    let rerunButton = document.getElementById('rerun');
    rerunButton.addEventListener('click', event => {
        runAStar(maze)
    });
}

function createMaze() {
    let canvas = document.getElementById('canvas');
    let walls = document.getElementById('wall-density').value;
    let maze = new RandomMaze(CELLS, walls, canvas);
    maze.render();
    return maze;
}

function runAStar(maze) {
    clearIntervals();
    maze.resetSearcher();
    document.getElementById('path-length').innerText = 'n/a';
    let steppingSpeed = document.getElementById('stepping-speed').value;
    rendererInterval = setInterval(() => {
        maze.stepSearcher();
    }, steppingSpeed);
    startTimer();
}

function clearIntervals() {
    clearInterval(timerInterval);
    clearInterval(rendererInterval);
}

function startTimer() {
    let time = document.getElementById('time');
    let timer = 0;
    timerInterval = setInterval(() => {
        if (!runMaze) {
            return
        }
        timer += 0.01;
        time.innerText = timer.toFixed(2);
    }, 0.01);
}

function stopTimer() {
    clearInterval(timerInterval);
}

window.onload = load;

class Cell {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isWall = false;
        this.value = 1;
    }

    equal(other) {
        if (other === null) {
            return false;
        }
        return this.x === other.x && this.y === other.y;
    }

    render(ctx, color) {
        if (color !== undefined) {
            ctx.fillStyle = color;
            ctx.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
        }
        ctx.fillStyle = this._getColor();
        ctx.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
    }

    renderText(ctx, text) {
        let centerX = this.x * this.width + (this.width / 2);
        let centerY = this.y * this.height + (this.height / 2);
        ctx.fillText(text, centerX, centerY);
    }

    clear(ctx) {
        ctx.clearRect(this.x * this.width, this.y * this.height, this.width, this.height);
    }

    _getColor() {
        if (this.isWall) {
            return WALL_COLOR;
        }
        if ((this._isOdd(this.x) && this._isOdd(this.y)) || (!this._isOdd(this.x) && !this._isOdd(this.y))) {
            return PRIMARY_COLOR
        } else {
            return SECONDARY_COLOR;
        }
    }

    _isOdd(n) {
        return n % 2 === 1;
    }

    distance(other) {
        let taxicab = document.getElementById('taxicab').checked;
        if (taxicab) {
            return this._taxicabDistance(other);
        }
        return this._pythagoreanDistance(other);
    }

    _taxicabDistance(other) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    _pythagoreanDistance(other) {
        let deltaX = this.x - other.x;
        let deltaY = this.y - other.y;
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }

}

class Grid {

    constructor(size, canvas) {
        this.canvas = canvas;
        this.size = size;
        let cellWidth = this.canvas.width / this.size;
        let cellHeight = this.canvas.height / this.size;
        this._grid = [];
        for (let y = 0; y < size; y++) {
            this._grid.push([]);
            for (let x = 0; x < size; x++) {
                this._grid[y].push(new Cell(x, y, cellWidth, cellHeight));
            }
        }
    }

    get(x, y) {
        return this._grid[y][x];
    }

    getNeighbors(x, y) {
        let neighbors = [];
        let allowDiagonalMoves = document.getElementById('diagonal-moves').checked;
        for (let iY = -1; iY <= 1; iY++) {
            for (let iX = -1; iX <= 1; iX++) {
                if ((iX === 0 && iY === 0) || (!allowDiagonalMoves && Math.abs(iX) === Math.abs(iY))) {
                    continue;
                }
                let currX = iX + x;
                let currY = iY + y;
                if (!this.inBounds(currX, currY)) {
                    continue;
                }
                neighbors.push(this._grid[currY][currX]);
            }
        }
        return neighbors;
    }

    inBounds(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    render() {
        let ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let cellWidth = this.canvas.width / this.size;
        let cellHeight = this.canvas.height / this.size;
        let currY = 0;
        for (let y = 0; y < CELLS; y++) {
            let currX = 0;
            for (let x = 0; x < CELLS; x++) {
                let cell = this._grid[y][x];
                cell.render(ctx);
                currX += cellWidth;
            }
            currY += cellHeight;
        }
    }
}

class RandomMaze {

    constructor(size, numWalls, canvas) {
        this.canvas = canvas;
        this.grid = new Grid(size, canvas);
        for (let i = 0; i < numWalls; i++) {
            this._randomCell().isWall = true;
        }
        this.start = this._randomCell();
        this.end = this._randomCell();
        while (this.end.equal(this.start) || this.start._taxicabDistance(this.end) < 30) {
            this.start = this._randomCell();
            this.end = this._randomCell();
        }
        this.start.isWall = false;
        this.end.isWall = false;
        this._forcePath();
        this.searcher = new Searcher(this.grid, this.start, this.end);
    }

    _randomCell() {
        let x = Math.floor(Math.random() * CELLS);
        let y = Math.floor(Math.random() * CELLS);
        return this.grid.get(x, y);
    }

    _forcePath() {
        let searcher = new Searcher(this.grid, this.start, this.end, true);
        let path = searcher.search();
        let walls = searcher.getWallsInPath(path);
        walls.forEach(cell => {
            cell.isWall = false;
            console.log(`Removed wall at (${cell.x}, ${cell.y}) to make maze solvable`);
        });
    }

    render() {
        let ctx = this.canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // prevents lines from sometimes appearing between adjacent cells
        this.grid.render();
        this.searcher.render(this.canvas);
        this.start.clear(ctx);
        this.start.render(ctx, START_COLOR);
        this.end.clear(ctx);
        this.end.render(ctx, END_COLOR);
    }

    resetSearcher() {
        this.searcher = new Searcher(this.grid, this.start, this.end);
    }

    stepSearcher(steps=1) {
        if (!runMaze) {
            return;
        }
        if (this.searcher.foundPath) {
            return;
        }
        this.searcher.search(steps);
        this.render();
    }

}


class Searcher {

    constructor(grid, start, end, allowWalls=false) {
        this.allowWalls = allowWalls;
        this.start = start;
        this.end = end;
        this.grid = grid;
        this.reset();
    }

    reset() {
        this.nodes = new Map();
        this.explored = [];
        this.cellsExplored = 0;
        this.cameFrom = new Map();
        this.cost = new Map();
        this.fullPath = [];
        this.foundPath = false;
        this._pushNode(this.start, 0);
        this.cameFrom.set(this.start, null);
        this.cost.set(this.start, 0);
        this.lastExplored = null;
    }

    search(steps=-1) {
        let reachedTarget = false;
        while (this.nodes.size > 0 && steps !== 0) {
            steps--;
            let current = this._popNode();
            this.explored.push(current);
            this.cellsExplored += 1;
            this.lastExplored = current;
            if (current.equal(this.end)) {
                console.log('found exit');
                reachedTarget = true;
                break;
            }
            for (const neighbor of this.grid.getNeighbors(current.x, current.y)) {
                if (!this.allowWalls && neighbor.isWall) {
                    continue;
                }
                let nodeCost = this.cost.get(current) + this._heuristic(neighbor);
                if (neighbor.equal(this.end)) {
                    nodeCost = 0;
                }
                if (!this.cameFrom.has(neighbor) || nodeCost < this.cost.get(neighbor)) {
                   this.cost.set(neighbor, nodeCost);
                   this.cameFrom.set(neighbor, current);
                   let h = neighbor.distance(this.end);
                   this._pushNode(neighbor, nodeCost + h);
               }
            }
        }
        if (reachedTarget) {
            this.foundPath = true;
            return this._reconstructPath(this.cameFrom, this.end);
        }
        return [];
    }

    getWallsInPath(path) {
        let walls = [];
        path.forEach(cell => {
            if (cell.isWall) {
                walls.push(cell);
            }
        });
        return walls;
    }

    render(canvas) {
        let ctx = canvas.getContext('2d');
        for (const cell of this.explored) {
            cell.clear(ctx);
            cell.render(ctx, SEARCH_COLOR)
        }
        if (this.fullPath.length > 0) {
            document.getElementById('path-length').innerText = this.fullPath.length;
            stopTimer();
        }
        for (const cell of this.fullPath) {
            cell.clear(ctx);
            cell.render(ctx, PATH_COLOR);
        }
        let renderLastExplored = document.getElementById("show-last-explored").checked;
        if (renderLastExplored && this.lastExplored != null) {
            this.lastExplored.clear(ctx);
            this.lastExplored.render(ctx, LAST_EXPLORED_COLOR);
        }
        document.getElementById("cells-explored").innerText = this.cellsExplored;
        let renderValues = document.getElementById('show-values').checked;
        if (!renderValues) {
            return;
        }
        ctx.font = "15px Open Sans";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        this.nodes.forEach((priority, cell, map) => {
            let value = Math.round(priority * 10) / 10; // round to 1 decimal place
            cell.renderText(ctx, value);
        });
    }

    _reconstructPath(cameFrom, end) {
        let path = [];
        let current = end;
        while (current !== null) {
            path.splice(0, 0, current);
            current = cameFrom.get(current);
        }
        this.fullPath = path;
        return path;
    }

    _heuristic(cell) {
        if (cell.isWall) {
            return 500;
        }
        return cell.value;
    }

    _pushNode(cell, priority) {
        this.nodes.set(cell, priority);
    }

    _popNode() {
        let lowestPriorityCell = null;
        let lowestPriority = 10000000;
        this.nodes.forEach((priority, cell, map) => {
            if (priority < lowestPriority) {
                lowestPriority = priority;
                lowestPriorityCell = cell;
            }
        });
        this.nodes.delete(lowestPriorityCell);
        return lowestPriorityCell
    }



}