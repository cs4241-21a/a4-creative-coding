const canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  overlay = document.getElementById("overlay"),
  content = document.getElementById("content"),
  title = document.getElementById("title"),
  close = document.getElementById("close"),
  file = document.getElementById("thefile"),
  volume = document.getElementById("volume"),
  pause = document.getElementById("pause"),
  play = document.getElementById("play"),
  mute = document.getElementById("mute"),
  loop = document.getElementById("loop"),
  currentSong = document.getElementById("currentSong"),
  lofiBtn = document.getElementById("lofi");

const lofi =
  "https://cdn.glitch.com/36ac2734-bfac-4c98-b919-aaedd40cac6c%2F1%20A.M%20Study%20Session%20%F0%9F%93%9A%20-%20%5Blofi%20hip%20hop_chill%20beats%5D.mp3?v=1633328897899";

const audioCtx = new AudioContext();
const audio = document.createElement("audio");
document.body.appendChild(audio);

const start = function() {
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  const player = audioCtx.createMediaElementSource(audio);
  player.connect(audioCtx.destination);
  player.connect(analyser);
  audio.src = lofi;
  audio.play();
  e => (audio.volume = 50);
  audio.crossOrigin = "anonymous";
  currentSong.value = "Lofi Beats";
  const results = new Uint8Array(analyser.frequencyBinCount);
  draw = function() {
    window.requestAnimationFrame(draw);
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    //const x = canvas.width / 2;
    //ctx.textAlign = "center";
    analyser.getByteFrequencyData(results);
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      ctx.fillRect(i, canvas.height, 25, -results[i]);
    }
  };
  draw();
};

close.addEventListener("click", function() {
  document.body.removeChild(overlay);
  content.style.display = "block";
  audioCtx.resume();
  start();
});

play.addEventListener("click", () => audio.play());
pause.addEventListener("click", () => audio.pause());
volume.addEventListener(
  "change",
  e => (audio.volume = e.currentTarget.value / 100)
);

mute.addEventListener("click", function() {
  if (mute.checked) {
    audio.muted = true;
  } else {
    audio.muted = false;
  }
});

loop.addEventListener("click", function() {
  if (loop.checked) {
    audio.loop = true;
  } else {
    audio.loop = false;
  }
});

lofiBtn.addEventListener("click", function() {
  audio.src = lofi;
  audio.play();
  currentSong.value = "Lofi Beats";
});

file.onchange = function() {
  var files = this.files;
  audio.src = URL.createObjectURL(files[0]);
  audio.load();
  audio.play();
  currentSong.value = file.value;
};
