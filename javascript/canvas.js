let isPainting = false;
let c, canvas;

const doodleBtn = document.getElementById("doodle"),
  redBtn = document.getElementById("red"),
  blueBtn = document.getElementById("blue"),
  yellowBtn = document.getElementById("yellow"),
  greenBtn = document.getElementById("green"),
  blackBtn = document.getElementById("black"),
  squareBtn = document.getElementById("square"),
  circleBtn = document.getElementById("circle"),
  triangleBtn = document.getElementById("triangle"),
  lineBtn = document.getElementById("line");

const doodle = function(e) {
  if (!isPainting) return;

  c.lineWidth = 5;
  c.lineCap = "round";
  c.strokeStyle = "black";

  c.lineTo(e.clientX, e.clientY);
  c.stroke();
  c.beginPath();
  c.moveTo(e.clientX, e.clientY);
};

window.addEventListener("load", () => {
  canvas = document.querySelector("canvas");
  c = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  function startPosition(e) {
    isPainting = true;
    doodle(e);
  }

  function endPosition() {
    isPainting = false;
    c.beginPath();
  }

  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", endPosition);
  canvas.addEventListener("mousemove", doodle);
});
