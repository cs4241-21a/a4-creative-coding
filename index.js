const audioContext = new AudioContext();

const analyzer = audioContext.createAnalyser();

const audioElement = document.querySelector("audio");

const track = audioContext.createMediaElementSource(audioElement);

const playButton = document.querySelector("button");

track.connect(audioContext.destination);
track.connect(analyzer);

analyzer.fftSize = 2048;
const bufferLength = analyzer.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);

analyzer.getByteTimeDomainData(dataArray);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.clearRect(0, 0, canvas.height, canvas.width);

let backgroundColor = "#000000";
let foregroundColor = "#ffffff";

const draw = () => {
  var drawVisual = requestAnimationFrame(draw);
  analyzer.getByteTimeDomainData(dataArray);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = foregroundColor;
  ctx.beginPath();
  var sliceWidth = (canvas.width * 1.0) / bufferLength;
  var x = 0;
  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = (v * canvas.height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
};

playButton.addEventListener(
  "click",
  function () {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // play or pause track depending on state
    if (audioElement.paused) {
      audioElement.play();
      playButton.innerText = "Pause";
    } else {
      audioElement.pause();
      playButton.innerText = "Play";
    }
  },
  false
);

const backgroundChange = () => {
  const input = document.getElementById("backgroundInput").value;
  if (isColor(input)) {
    backgroundColor = input;
  }
};

document.getElementById("backgroundInput").onchange = backgroundChange;

const foregroundChange = () => {
  const input = document.getElementById("foregroundInput").value;
  if (isColor(input)) {
    foregroundColor = input;
  }
};

document.getElementById("foregroundInput").onchange = foregroundChange;

const isColor = (strColor) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== "";
};

draw();
