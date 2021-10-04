const gameboard = document.getElementById("gameCanvas")
const gameboardctx = gameboard.getContext("2d")
const board_border = 'black'
const board_background = "white"

const parent = document.getElementById("gameContainer")
gameboard.width = parent.offsetWidth
gameboard.height = parent.offsetHeight

const snake_col = 'lightblue'
const snake_border = 'darkblue'

const INCREMENT = 20

let gompei = [
  {x:200, y:200},
  {x:190, y:200},
  {x:180, y:200},
  {x:170, y:200},
  {x:160, y:200},
]

const goat = new Image()
goat.src = "https://cdn.glitch.com/a7611cfe-7b75-43fc-b92b-b75661f1bb15%2Fgoat.png?v=1633296688197"

function drawGompeiPart(gompeiPart) {
  gameboardctx.drawImage(goat, gompeiPart.x, gompeiPart.y, INCREMENT, INCREMENT)
}

function drawGompei() {  
  gompei.forEach(drawGompeiPart)
}

function clearCanvas() {
  gameboardctx.fillStyle = board_background
  gameboardctx.strokestyle = board_border
  gameboardctx.fillRect(0, 0, gameboard.width, gameboard.height)
  gameboardctx.strokeRect(0, 0, gameboard.width, gameboard.height)
}

let dx = INCREMENT
let dy = 0
let food_x
let food_y
let score = 0
let changing_direction = false
let started = false

const cheese = new Image()
cheese.src = "https://cdn.glitch.com/a7611cfe-7b75-43fc-b92b-b75661f1bb15%2Fcheese.png?v=1633321691951"

const goatsound = new Audio("https://cdn.glitch.com/a7611cfe-7b75-43fc-b92b-b75661f1bb15%2Fgoatwav.mp3?v=1633345750329")

function move_gompei() {
  const head = {x: gompei[0].x + dx, y: gompei[0].y + dy}
  gompei.unshift(head)
  const has_eaten_food = gompei[0].x+(INCREMENT/2) >= food_x && gompei[0].x+(INCREMENT/2) <= food_x+INCREMENT && gompei[0].y+(INCREMENT/2) >= food_y && gompei[0].y+(INCREMENT/2) <= food_y+INCREMENT
  if (has_eaten_food) {
    goatsound.currentTime = 1
    goatsound.play()
    score +=1
    document.getElementById("score").innerText = "Score: "+ score
    gen_food()
  } else {
    gompei.pop()
  }
}

document.addEventListener("keydown", change_direction)

function change_direction(event) 
{  
   const LEFT_KEY = 37
   const RIGHT_KEY = 39
   const UP_KEY = 38
   const DOWN_KEY = 40
 
   const keyPressed = event.keyCode
   const goingUp = dy === -INCREMENT
   const goingDown = dy === INCREMENT
   const goingRight = dx === INCREMENT
   const goingLeft = dx === -INCREMENT
 
     if (keyPressed === LEFT_KEY && !goingRight)
     {    
          dx = -INCREMENT
          dy = 0
     }
 
     if (keyPressed === UP_KEY && !goingDown)
     {    
          dx = 0
          dy = -INCREMENT
     }
 
     if (keyPressed === RIGHT_KEY && !goingLeft)
     {    
          dx = INCREMENT
          dy = 0
     }
 
     if (keyPressed === DOWN_KEY && !goingUp)
     {    
          dx = 0
          dy = INCREMENT
     }
}

function has_game_ended()
{  
  for (let i = 4; i < gompei.length; i++)
  {    
    const has_collided = gompei[i].x === gompei[0].x && gompei[i].y === gompei[0].y
    if (has_collided) {
      started = false
      return true
    }
  }
  const hitLeftWall = gompei[0].x < 0
  const hitRightWall = gompei[0].x > gameboard.width
  const hitToptWall = gompei[0].y < 0
  const hitBottomWall = gompei[0].y > gameboard.height
 
  return hitLeftWall ||  hitRightWall || hitToptWall || hitBottomWall
}

function random_food(min, max)
{  
   return Math.round((Math.random() * (max-min) + min) / 10) * 10
}
 
function gen_food() 
{  
   food_x = random_food(0, gameboard.width - INCREMENT)
   food_y = random_food(0, gameboard.height - INCREMENT)
   gompei.forEach(function has_gompei_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food()
      })
}

function drawFood() {
  gameboardctx.drawImage(cheese, food_x, food_y, INCREMENT, INCREMENT)
  
}

const endgame = function() {
  gameboard.remove()
  document.querySelector("#start").innerText = "Play Again"
  const prompt = document.createElement("H1")
  prompt.className = "nes-text is-error"
  prompt.innerText = "You Lost, Play Again?"
  document.getElementById("gameContainer").appendChild(prompt)
  
}

function main() {
  if (has_game_ended()){
    clearCanvas()
    endgame()
    return
  } 
  changing_direction = false
  setTimeout(function onTick() {
    clearCanvas()
    drawFood()
    move_gompei()
    drawGompei()
    main()
  }, 100)
}

const start = function () {
  if (!started) {
    started = true
    window.location.reload()
  }
}

main()
gen_food()

window.onload = function() {
  const start_button = document.querySelector("#start")
  start_button.onclick = start
}

window.onresize = function() {
  const gameboard = document.getElementById("gameCanvas")
  const gameboardctx = gameboard.getContext("2d")
  const board_border = 'black'
  const board_background = "white"

  const parent = document.getElementById("gameContainer")
  gameboard.width = parent.width
  gameboard.height = parent.height
}