// Add some Javascript code here, to run on the front end.

console.log('Welcome to assignment 2!')


const COLORS = [
  '#007991',
  '#888098',
  '#F26A8D',
  '#8FCB9B',
  '#F7B05B',
  '#66CED6',
  '#645DD7',
  '#198754'
]

const USER_COLOR = '#007991'
const FOOD_COLOR = '#198754'

const MAX_X = 8
const MAX_Y = 8

const CANVAS_X = 480
const CANVAS_Y = 480
const SCALE = 1 // window.devicePixelRatio

const OBJECT_SIZE = 60

function randomCoords() {
  return [Math.floor(Math.random() * MAX_X), Math.floor(Math.random() * MAX_Y)]
}

function drawSquare(ctx, coords, color) {
  const x = coords[0] * OBJECT_SIZE
  const y = coords[1] * OBJECT_SIZE

  ctx.beginPath()
  ctx.rect(x, y, OBJECT_SIZE, OBJECT_SIZE)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}

function coordsMatching(a, b) {
  return a.toString() === b.toString()
}

function render(ctx, user, food, path, userColor, foodColor) {
  let userColorHex = COLORS[parseInt(userColor)]
  let foodColorHex = COLORS[parseInt(foodColor)]

  ctx.clearRect(0, 0, CANVAS_X, CANVAS_Y)
  drawSquare(ctx, user, userColorHex)
  drawSquare(ctx, food, foodColorHex)
  
  ctx.globalAlpha = 0.5
  path.forEach(coords => {
    drawSquare(ctx, coords, userColorHex)
  })
  ctx.globalAlpha = 1
}

const app = Vue.createApp({
  data() {
    return {
      token: '',
      game: {
        userColor: '0',
        foodColor: '7',
        user: [],
        path: [],
        food: [],
      },
      username: '',
      score: 0,
      intervalID: 0,
      results: {}
    }
  },
  computed: {
    scores() {
      let scores = []
      Object.keys(this.results).forEach(key => {
        scores.push({username: key, score: this.results[key]})
      })
      return scores.sort((a, b) => b.score - a.score)
    }
  },
  mounted: function() {
    this.token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    this.game.user = randomCoords()
    this.game.food = randomCoords()

    while (coordsMatching(this.game.user, this.game.food)) {
      this.game.food = randomCoords()
    }

    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    ctx.scale(SCALE, SCALE)

    canvas.onkeyup = (event) => {
      switch (event.key) {
        case 'a':
        case 'ArrowLeft':
          event.preventDefault()
          this.moveLeft()
          break
        case 'd':
        case 'ArrowRight':
          event.preventDefault()
          this.moveRight()
          break
        case 'w':
        case 'ArrowUp':
          event.preventDefault()
          this.moveUp()
          break
        case 's':
        case 'ArrowDown':
          event.preventDefault()
          this.moveDown()
          break
      }
    }

    this.intervalID = setInterval(() => {
      while (coordsMatching(this.game.user, this.game.food)) {
        this.score++
        this.game.food = randomCoords()
      }
      render(ctx, this.game.user, this.game.food, this.game.path, this.game.userColor, this.game.foodColor)
    }, 50)

    this.getScores()
  },
  methods: {
    async getScores() {
      let token = this.token
      let response = await fetch('/scores', {
        credentials: 'same-origin',
        headers: {
          'CSRF-Token': token,
          'Content-Type' : 'application/json'
        },
        method: 'GET'
      })
      this.results = await response.json()
    },
    async removeScore() {
      let token = this.token
      let requestBody = {
        username: this.username
      }
      let response = await fetch('/removeScore', {
        credentials: 'same-origin',
        headers: {
          'CSRF-Token': token,
          'Content-Type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(requestBody)
      })
      this.results = await response.json()
      this.score = 0
    },
    async submitScore() {
      let token = this.token
      let requestBody = {
        username: this.username,
        score: this.score
      }
      let response = await fetch('/score', {
        credentials: 'same-origin',
        headers: {
          'CSRF-Token': token,
          'Content-Type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(requestBody)
      })
      this.results = await response.json()
      this.score = 0
    },
    getColorByIndex(index) {
      return COLORS[parseInt(index)]
    },
    trackPath() {
      console.log(JSON.stringify(this.game.user))
      console.log(JSON.stringify(this.game.path))
      this.game.path.unshift(JSON.parse(JSON.stringify(this.game.user)))
      console.log(JSON.stringify(this.game.path))
      this.game.path.splice(3)
      console.log(JSON.stringify(this.game.path))

      this.$forceUpdate()
    },
    moveLeft() {
      if (this.game.user[0] > 0) {
        this.trackPath()
        this.game.user[0]--
      }
    },
    moveRight() {
      if (this.game.user[0] < MAX_X - 1) {
        this.trackPath()
        this.game.user[0]++
      }
    },
    moveUp() {
      if (this.game.user[1] > 0) {
        this.trackPath()
        this.game.user[1]--
      }
    },
    moveDown() {
      if (this.game.user[1] < MAX_Y - 1) {
        this.trackPath()
        this.game.user[1]++
      }
    }
  },
  beforeUnmount: function() {
    clearInterval(this.intervalID)
  }
})

const vm = app.mount('#app')