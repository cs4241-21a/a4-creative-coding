const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const overlay = document.getElementById('overlay')
const content = document.getElementById('content')
const title = document.getElementById('title')
const playBtn = document.getElementById('play')

const volume = document.getElementById('volume'),
      pauseBtn = document.getElementById('pause'),
      playSet = document.getElementById('playSet'),
      mute = document.getElementById('mute'),
      loopBox = document.getElementById('loop'),
      currentSong = document.getElementById('currentSong')

const hatenaBtn = document.getElementById('hatena'),
    sawanoBtn = document.getElementById('sawano'),
    reonaBtn = document.getElementById('reona'),
    lisaBtn = document.getElementById('lisa'),
    utadaBtn = document.getElementById('utada'),
    sasanomalyBtn = document.getElementById('sasanomaly'),
    aimerBtn = document.getElementById('aimer'),
    lynBtn = document.getElementById('lyn')

const hatena = "https://cdn.glitch.com/1be4c9fb-3024-481f-be52-d8a904df0358%2F01.%E5%A4%A2.mp3?v=1632698467767"
const sawano = "https://cdn.glitch.com/1be4c9fb-3024-481f-be52-d8a904df0358%2F02.Hands%20Up%20to%20the%20Sky.mp3?v=1632612774842"
const reona = "https://cdn.glitch.com/1be4c9fb-3024-481f-be52-d8a904df0358%2F03.Untitled%20world.mp3?v=1632613620178"
const lisa = "https://cdn.glitch.com/1be4c9fb-3024-481f-be52-d8a904df0358%2F01.%20%E7%B4%85%E8%93%AE%E8%8F%AF.mp3?v=1632679415882"
const utada = "https://cdn.glitch.com/1be4c9fb-3024-481f-be52-d8a904df0358%2F01.PINK%20BLOOD.mp3?v=1632679673420"
const sasanomaly = "https://cdn.glitch.com/1be4c9fb-3024-481f-be52-d8a904df0358%2F01.%E7%A9%BA%E3%81%A8%E8%99%9A.mp3?v=1632680283648"
const aimer = "https://cdn.glitch.com/1be4c9fb-3024-481f-be52-d8a904df0358%2F04%203min.mp3?v=1632680298458"
const lyn = "https://cdn.glitch.com/1be4c9fb-3024-481f-be52-d8a904df0358%2Fdisc1_03.mp3?v=1632698430615"

const defaultColor = document.getElementById('default'),
    red = document.getElementById('redGradient'),
    green = document.getElementById('greenGradient'),
    blue = document.getElementById('blueGradient'),
    purple = document.getElementById('purpleGradient')

let color = 'white';

//audio init
const audioCtx = new AudioContext()
const audioElement = document.createElement('audio')
document.body.appendChild(audioElement)

//Starts audio setup and visualization
const start = function () {

    //audio graph setup
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 1024
    const player = audioCtx.createMediaElementSource(audioElement)
    player.connect(audioCtx.destination)
    player.connect(analyser)

    audioElement.src = hatena
    audioElement.play()
    audioElement.crossOrigin = "anonymous";

    currentSong.value = hatenaBtn.value

    const results = new Uint8Array(analyser.frequencyBinCount)

    draw = function () {
        window.requestAnimationFrame(draw)

        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = color

        analyser.getByteFrequencyData(results)

        for (let i = 0; i < analyser.frequencyBinCount; i++) {
            ctx.fillRect(i, canvas.height, 3, -results[i])
        }
    }
    draw()
}

//Play button on the instructions screen
playBtn.addEventListener('click', function () {
    document.body.removeChild(overlay)
    document.body.removeChild(title)
    content.style.display = 'block'
    audioCtx.resume()
    start()
})

//Settings menu
playSet.addEventListener('click', ()=> audioElement.play())
pauseBtn.addEventListener('click', ()=> audioElement.pause())
volume.addEventListener("change", (e)=> audioElement.volume = e.currentTarget.value / 100)

mute.addEventListener('click', function() {
    if (mute.checked) {
        audioElement.muted = true
    } else {
        audioElement.muted = false
    }
})

loopBox.addEventListener('click', function() {
    if (loopBox.checked) {
        audioElement.loop = true
    } else {
        audioElement.loop = false
    }
})

//Plays selected song when clicked
hatenaBtn.addEventListener('click', function () {
    audioElement.src = hatena
    audioElement.play()
    currentSong.value = hatenaBtn.value
})

sawanoBtn.addEventListener('click', function () {
    audioElement.src = sawano
    audioElement.play()
    currentSong.value = sawanoBtn.value

})

reonaBtn.addEventListener('click', function () {
    audioElement.src = reona
    audioElement.play()
    currentSong.value = reonaBtn.value

})

lisaBtn.addEventListener('click', function () {
    audioElement.src = lisa
    audioElement.play()
    currentSong.value = lisaBtn.value

})

utadaBtn.addEventListener('click', function () {
    audioElement.src = utada
    audioElement.play()
    currentSong.value = utadaBtn.value
})

sasanomalyBtn.addEventListener('click', function () {
    audioElement.src = sasanomaly
    audioElement.play()
    currentSong.value = sasanomalyBtn.value
})

aimerBtn.addEventListener('click', function () {
    audioElement.src = aimer
    audioElement.play()
    currentSong.value = aimerBtn.value
})

lynBtn.addEventListener('click', function () {
    audioElement.src = lyn
    audioElement.play()
    currentSong.value = lynBtn.value
})

//Changes color of audio wave when clicked
defaultColor.addEventListener('click', ()=> color = 'white')

red.addEventListener('click', function () {
    let gradient = ctx.createLinearGradient(170, 0, 0, 0)
    gradient.addColorStop(0, "#D67F74")
    gradient.addColorStop(1, "#D63936")
    color = gradient;
})

green.addEventListener('click', function () {
    let gradient = ctx.createLinearGradient(170, 0, 0, 0)
    gradient.addColorStop(0, "#91D6C3")
    gradient.addColorStop(1, "#32D6AC")
    color = gradient;
})

blue.addEventListener('click', function () {
    let gradient = ctx.createLinearGradient(0, 0, 170, 0)
    gradient.addColorStop(0, "#0087F5")
    gradient.addColorStop(1, "#7DC6E0")
    color = gradient;
})

purple.addEventListener('click', function () {
    let gradient = ctx.createLinearGradient(170, 0, 0, 0)
    gradient.addColorStop(0, "#B89FD6")
    gradient.addColorStop(1, "#9563D6")
    color = gradient;
})