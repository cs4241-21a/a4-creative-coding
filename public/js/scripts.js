const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const barWidth = 3;

var slider = document.getElementById("barWidth");
var output = document.getElementById("barWidthLable");

var colorBackground = 'black';
var colorBar = 'red';

const audioCtx = new AudioContext()
const audioElement = document.createElement('audio')
document.body.appendChild(audioElement)

const backgroundColorSelect = document.getElementById("BackgroundColor")

backgroundColorSelect.addEventListener('change', (event) => {
  colorBackground = document.querySelector('.result');
  colorBackground = event.target.value;
});

const barColorSelect = document.getElementById("BarColor")

barColorSelect.addEventListener('change', (event) => {
  colorBar = document.querySelector('.result2');
  colorBar = event.target.value;
  //console.log(colorBar)
});

const rotateSwitch = document.getElementById("rotate")
var rotate = 'off'
  rotateSwitch.addEventListener('change', (event) => {
    if(rotate === 'off'){
      rotate = 'on'
    }
    else{
      rotate ='off'
      ctx.fillStyle = colorBackground;
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = color
    }
    console.log(rotate)
});


const badGuyBtn = document.getElementById('BillieEilish'),
    vivaldiBtn = document.getElementById('Vivaldi')
    

const badGuy = "https://cdn.glitch.com/cf951236-0fd3-437f-af4a-b97d67cf90f6%2Fyt5s.com-Billie%20Eilish%20-%20bad%20guy%20(Lyrics).mp4?v=1633336332663"
const vivaldi = "https://cdn.glitch.com/cf951236-0fd3-437f-af4a-b97d67cf90f6%2Fyt5s.com-Vivaldi's%20Four%20Seasons%20-%20Spring%20(Part%201)-(480p).mp4?v=1633336321813"

const defaultColor = document.getElementById('default'),
    red = document.getElementById('redGradient'),
    green = document.getElementById('greenGradient'),
    blue = document.getElementById('blueGradient'),
    purple = document.getElementById('purpleGradient')

  let color = 'white';

const start = function () {
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 1024
    const player = audioCtx.createMediaElementSource(audioElement)
    player.connect(audioCtx.destination)
    player.connect(analyser)

    audioElement.crossOrigin = "anonymous";

    const results = new Uint8Array(analyser.frequencyBinCount)
    var flag= true
    const draw = function () {
        window.requestAnimationFrame(draw)
        ctx.fillStyle = colorBackground;
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = color

        analyser.getByteFrequencyData(results)
        

        for (let i = 0; i < analyser.frequencyBinCount; i++) {
            if(flag){
              ctx.save()
              flag =false
            }
            ctx.fillStyle = colorBar;
            ctx.fillRect(i, canvas.height,slider.value, -results[i])
            if(rotate === 'on'){
              ctx.rotate(i)
            }else{
              ctx.restore();
              
            }
            
        }
    }
    draw()
}



badGuyBtn.addEventListener('click', function () {
    audioCtx.resume()
    audioElement.src = badGuy
    audioElement.play()
    start()
})

vivaldiBtn.addEventListener('click', function () {
    audioCtx.resume()
    audioElement.src = vivaldi
    audioElement.play()
    start()
})
