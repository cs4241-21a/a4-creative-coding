"use strict";

var lyricData = [{},{}];

const submit = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();
  console.log("Submit");
  return false;
};

window.onload = function() {


  const progress = document.getElementById("progress");

  progress.innerHTML = "fetching albums...";
  
  fetch("/lyrics")
    .then(response => response.json())
    .then( data =>{
    progress.innerHTML = "fetching songs...";
    let lyricData = [];
    for (let i = 0; i < data.length; i++) {
      let split = data[i].split("_");
      lyricData[i] = {};
      //filename, year, 
      lyricData[i][0] = data[i];
      lyricData[i][1] = split[0];
      lyricData[i][2] = split[1].replace(/-/g, " ");
      lyricData[i][3] = split[2].slice(0, -6).replace(/-/g, " ");
      progress.innerHTML = lyricData[i][3];
    }

    progress.innerHTML = "fetching lyrics..."
    for (let song of lyricData){
      fetch(song[0])
      .then(response => response.text())
      .then(textString => {
        song[0] = textString;
      });
    }
    progress.innerHTML = "Ready!"
    
  });
  
    //enable submit button
  const button = document.querySelector("button");
  button.onclick = submit;
};
