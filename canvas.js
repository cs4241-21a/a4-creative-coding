window.addEventListener("load", () => {
  const canvas = document.querySelector("canvas"),
    c = canvas.getContext("2d"),
    doodleBtn = document.getElementById("doodle"),
    redBtn = document.getElementById("red"),
    blueBtn = document.getElementById("blue"),
    yellowBtn = document.getElementById("yellow"),
    greenBtn = document.getElementById("green"),
    blackBtn = document.getElementById("black"),
    whiteBtn = document.getElementById("white"),
    pinkBtn = document.getElementById("pink"),
    purpleBtn = document.getElementById("purple"),
    clearBtn = document.getElementById("clear"),
    popup = document.getElementById("popup"),
    welcomeScreen = document.getElementById("welcomeScreen");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  c.lineCap = "round";
  c.lineWidth = 10;

  let isPainting = false;

  function startPosition(e) {
    isPainting = true;
    doodle(e);
  }

  function endPosition() {
    isPainting = false;
    c.beginPath();
  }

  function checkKey(e) {
    e = e || window.event;

    //Up Arrow
    if (e.keyCode == "38") {
      c.lineWidth += 1;
    }
    
    //Down Arrow
    else if (e.keyCode == "40") {
      c.lineWidth -= 1;
    }

    //X Key
    else if (e.keyCode == "88") {
      c.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    //R Key
    else if (e.keyCode == "82") {
      c.lineCap = "round";
    }
    
    //B Key
    else if (e.keyCode == "66") {
      c.lineCap = "butt";
    }
    
    //S Key
    else if (e.keyCode == "83") {
      c.lineCap = "square";
    }
  }

  function doodle(e) {
    if (!isPainting) return;
    
    c.lineTo(e.clientX, e.clientY);
    c.stroke();
    c.beginPath();
    c.moveTo(e.clientX, e.clientY);
  }

  redBtn.addEventListener("click", function() {
    c.strokeStyle = "red";
  });

  blueBtn.addEventListener("click", function() {
    c.strokeStyle = "blue";
  });

  yellowBtn.addEventListener("click", function() {
    c.strokeStyle = "yellow";
  });

  greenBtn.addEventListener("click", function() {
    c.strokeStyle = "green";
  });

  blackBtn.addEventListener("click", function() {
    c.strokeStyle = "black";
  });

  whiteBtn.addEventListener("click", function() {
    c.strokeStyle = "white";
  });

  pinkBtn.addEventListener("click", function() {
    c.strokeStyle = "pink";
  });

  purpleBtn.addEventListener("click", function() {
    c.strokeStyle = "purple";
  });

  clearBtn.addEventListener("click", function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
  });
  
  window.addEventListener("keydown", checkKey);
  
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", endPosition);
  canvas.addEventListener("mousemove", doodle);
});
