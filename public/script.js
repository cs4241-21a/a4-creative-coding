"use strict";

//data that will be filled in on command
var lyricData = [{}, {}];

var xYears = 2020;
var xAlbums = [];

const submit = function (e) {
  // prevent default form action from being carried out
  e.preventDefault();
  console.log("Submit");
  return false;
};

const showStatus = function (msg) {
  const progress = document.getElementById("go");
  progress.value = msg;
}

window.onload = function () {

  showStatus("fetching albums...");

  fetch("/lyrics")
    .then(response => response.json())
    .then(data => {
      showStatus("fetching songs...");
      let lyricData = [];
      for (let i = 0; i < data.length; i++) {
        let split = data[i].split("_");
        lyricData[i] = {};
        lyricData[i][0] = data[i]; //filename
        lyricData[i][1] = split[0]; //year
        lyricData[i][2] = split[1].replace(/-/g, " "); //album name
        lyricData[i][3] = split[2].slice(0, -6).replace(/-/g, " "); //song name
        //showStatus(lyricData[i][3]);
      }

      showStatus("fetching lyrics...");
      for (let song of lyricData) {
        fetch(song[0])
          .then(response => response.text())
          .then(textString => {
            song[0] = textString;

            //collect album names while we're at it
            if(!xAlbums.includes(song[2])){
              xAlbums.push(song[2])
            }
          });
      }
      showStatus("Search!");

    });



  //set up bar chart
  let yearScale = d3.scaleLinear().domain([1980, xYears]).range([0, 400]);
  let freqScale = d3.scaleLinear().domain([0, 500]).range([0, 400]);
  let axisLeft = d3.axisLeft(freqScale);
  let axisBottom = d3.axisBottom(yearScale).tickFormat(d3.format("d"));

  d3.select('#left').call(axisLeft);
  d3.select('#bottom').call(axisBottom);

  //data is all set up, enable form controls
  enableForm();
};

const enableForm = function(){
  //enable submit button
  const button = document.getElementById('go');
  button.onclick = submit;

  //enable form elements
  var inputs = document.getElementsByTagName("input"); 
    for (var i = 0; i < inputs.length; i++) { 
        inputs[i].disabled = false;
    } 
};
