let grid_size = 30
const board_size = 600
let cell_size = board_size/grid_size
let world = [[]]
let evSpeed = 0
let starve = 2
let crowd = 4
let spawn = 3
let interval = window.setInterval(console.log(), 100);


window.onload = function() {
  window.conways = document.getElementById('canvas')
  window.ctx = canvas.getContext('2d')
  window.evButton = document.getElementById('evButton')
  window.sButton = document.getElementById('sButton')
  window.cButton = document.getElementById('cButton')
  window.sizeBar = document.getElementById('sizebar')
  window.speedBar = document.getElementById('speedbar')
  window.crowdBar = document.getElementById('crowdbar')
  window.spawnBar = document.getElementById('spawnbar')
  window.gridDisplay = document.getElementById('gridDisplay')
  gridDisplay.innerText = grid_size
  window.speedDisplay = document.getElementById('speedDisplay')
  speedDisplay.innerText = evSpeed
  window.crowdDisplay = document.getElementById('crowdDisplay')
  crowdDisplay.innerText = crowd
  window.spawnDisplay = document.getElementById('spawnDisplay')
  spawnDisplay.innerText = spawn

  conways.width = board_size
  conways.height = board_size

  initArr(world)
  drawGrid()
  
  conways.addEventListener('click', event => clicked(event))
  evButton.addEventListener('click', event => evolve())
  sButton.addEventListener('click', event => stop())
  cButton.addEventListener('click', event => {
    ctx.fillStyle = "aliceblue"
    ctx.fillRect(0, 0, board_size, board_size);
    world = [[]]
    initArr(world)
    drawGrid()
    evolve()
  })

  sizeBar.oninput = function() {
    ctx.fillStyle = "aliceblue"
    ctx.fillRect(0, 0, board_size, board_size);
    grid_size = Math.round(this.value);
    gridDisplay.innerText = grid_size
    cell_size = board_size/grid_size
    world = [[]]
    initArr(world)
    drawGrid()
    evolve()
  }
  speedBar.oninput = function() {
    evSpeed = Math.round(this.value)
    speedDisplay.innerText = evSpeed
    if (evSpeed == 0) { window.clearInterval(interval) }
    else{
      window.clearInterval(interval)
      interval = window.setInterval(evolve, 3000/evSpeed);
    }
  }
  crowdBar.oninput = function() {
    crowd = Math.round(this.value)
    crowdDisplay.innerText = crowd
  }
  spawnBar.oninput = function() {
    spawn = Math.round(this.value)
    spawnDisplay.innerText = spawn
  }

};

function stop() {
  evSpeed = 0
  speedBar.value = evSpeed
  speedDisplay.innerText = evSpeed
  window.clearInterval(interval)
}

function initArr(world) {
  for (let i = 0; i < grid_size; i++){
    for (let j = 0; j < grid_size; j++){
      world[i].push(0)
    }
    world.push([])
  }
  world.pop()
}

function drawGrid() {
  for (let i = 0; i <= grid_size; i++){
    for (let j = 0; j <= grid_size; j++){
      ctx.rect(cell_size * i, cell_size * j, cell_size-1, cell_size-1)
    }
  }
  ctx.stroke()
}

function updateAll() {
  for (let i = 0; i < grid_size; i++){
    for (let j = 0; j < grid_size; j++){
      ctx.fillStyle = world[i][j] ? "green" : "aliceblue";  
      ctx.fillRect(i*cell_size+1, j*cell_size+1, cell_size-3, cell_size-3)
    }
  }
}

function clicked(event) {
  cellX = Math.round(event.offsetX/board_size*grid_size-0.5)
  cellY = Math.round(event.offsetY/board_size*grid_size-0.5)
  
  world[cellX][cellY] = Math.abs(world[cellX][cellY] - 1)

  updateAll()
}

function evolve() {
  let newWorld = [[]]
  initArr(newWorld)
  let surr = 0
  for (let i = 0; i < grid_size; i++){
    for (let j = 0; j < grid_size; j++){
      surr = neighbors(i, j)
      if (world[i][j] === 1){
        if (!(surr < starve) && !(surr >= crowd)){
          newWorld[i][j] = 1
        }
      }
      else{
        if (surr === spawn){
          newWorld[i][j] = 1
        }
      }
    }
  }
  world = [...newWorld]
  updateAll()
}

function neighbors(x, y){
  sum = 0
  Xpos = x+1
  Xneg = x-1
  Ypos = y+1
  Yneg = y-1

  if (Xneg < 0) { Xneg = world.length - 1 }
  if (Yneg < 0) { Yneg = world.length - 1 }
  if (Xpos > world.length - 1) { Xpos = 0 }
  if (Ypos > world.length - 1) { Ypos = 0 }

  sum = sum + world[Xneg][Yneg]
  sum = sum + world[x][Yneg]
  sum = sum + world[Xpos][Yneg]
  sum = sum + world[Xneg][y]
  sum = sum + world[Xpos][y]
  sum = sum + world[Xneg][Ypos]
  sum = sum + world[x][Ypos]
  sum = sum + world[Xpos][Ypos]

  return sum
}