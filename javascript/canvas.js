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

window.addEventListener("load", () => {
  const canvas = document.querySelector("canvas");
  const c = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let isPainting = false;

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
});

// doodleBtn.addEventListener("click", function() {
//   document.body.removeChild(document.getElementById("popup"));
//   document.body.removeChild(document.getElementById("welcomeScreen"));
//   document.getElementById("toolbar").style.display = "block";
// });
