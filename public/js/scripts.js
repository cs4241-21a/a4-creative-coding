// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!")

let andrewGarfield = setInterval(updateColor, 15);
  let colorCounter = 0;
  
  function updateColor() {
      colorCounter += 1;
      if (colorCounter > 255) {
          colorCounter = 1;
      }
      theBody.style.backgroundColor = "rgb("+colorCounter % 60+","+colorCounter % 60+","+(colorCounter+colorCounter) % 60+")";
  }