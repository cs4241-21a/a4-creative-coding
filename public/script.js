"use strict";

//song data to be filled in
var lyricData = [];

//for drawing chart
var xYearStart = 1985;
var xYearEnd = 2022;
var xAlbumsList = [];
const chartHeight = 400
const chartWidth = 600
const chartMargin = { left: 60, top: 10, right: 50, bottom: 25 }

//chart data
var xArray = [];
var data = [];
let maxVal = 0;


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
      for (let song of data) {
        let split = song.split("_");
        let songData = {};
        songData.filename = song;
        songData.year = split[0];
        songData.album = split[1].replace(/-/g, " ");
        songData.name = split[2].slice(0, -6).replace(/-/g, " ");
        //console.log(songData);
        lyricData.push(songData);
      }

      //sort by year,
      lyricData = lyricData.sort((a, b) => (a.year > b.year ? 1 : -1));

      showStatus("fetching lyrics...");
      for (let song of lyricData) {
        fetch(song.filename)
          .then(response => response.text())
          .then(textString => {
            song.lyrics = textString;

            //get album names while we're at it
            if (!xAlbumsList.includes(song.album)) {
              xAlbumsList.push(song.album);
            }
          });
      }

      showStatus("Search!");
        //data is all set up, enable form controls
      enableForm();
      chartDisplay();
    });
};

const enableForm = function () {
  //enable submit button
  const button = document.getElementById('go');
  button.onclick = submit;

  //changing any radio button redraws chart
  for (let radio of document.querySelectorAll('input[type="radio"]')) {
    radio.onclick = chartDisplay;
  }
  const setX3selector = document.getElementById('albumSelect');
  setX3selector.onchange = chartDisplay;

  //enable form elements
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = false;
  }
};


//set up bar chart
const chartDisplay = function () {
  drawX(); //draws X and fills in xArray'
  //console.log(xArray);
  data = [];
  for (let x of xArray) {
    let dataVal = 0;
    for (let song of lyricData){
      if (x == relevantValue(song) && !(song.lyrics === undefined)){
        dataVal += evalMetric(song.lyrics);
      }
    }
    data.push({name:x, value:dataVal});
  }
  //find maximum value for the y axis
  maxVal = Math.max(...data.map(d => d.value));
  drawY(maxVal);

  drawBars(data);
  console.log("Displaying:")
  console.log(data);
}

/*
  Switch functions based on radio buttons
*/

const drawX = function () {
  let type = document.querySelector('input[name="xAxis"]:checked').value;
  switch (type) {
    case "xAlbums":
      setXAlbums();
      break;
    case "xSongs":
      setXSongs();
      break;
    default:
      setXYears();
  }

}

const relevantValue = function(song) {
  let type = document.querySelector('input[name="xAxis"]:checked').value;
  switch (type) {
    case "xAlbums":
      return song.album;
    case "xSongs":
      return song.name;
    default:
      return song.year;
  }
}

const evalMetric = function(text){
  let type = document.querySelector('input[name="yAxis"]:checked').value;
  switch (type) {
    case "wordCount":
      return evalWords(text).length;
    case "wordCountUnique":
      return evalUniqueWords(text).length;
    default:
      return evalChars(text).length;
  }
}

/*
  Functions to set the bottom X axis of the graph
*/

const setXYears = function () {
  allowXSongs(false)//disable album selection
  chartMargin.bottom =25;
  xArray = [];
  for (let i = xYearStart; i <= xYearEnd; i++) {
    xArray.push(i);
  }
  let yearScale = d3.scaleLinear().domain([xYearStart, xYearEnd]).range([chartMargin.left, chartWidth - chartMargin.right]);
  let axisBottom = d3.axisBottom(yearScale).tickFormat(d3.format("d"));
  d3.select('#bottom').call(axisBottom).attr('transform', 'translate(0,' + (chartHeight - chartMargin.bottom) + ')');
}

const setXAlbums = function () {
  allowXSongs(false)//disable album selection
  chartMargin.bottom = 90;
  //console.log(xAlbumsList);
  xArray = xAlbumsList;//all albums
  let albumScale = d3.scaleBand().domain(xArray).range([chartMargin.left, chartWidth - chartMargin.right]).padding(0.5);
  let axisBottom = d3.axisBottom(albumScale);
  d3.select('#bottom').call(axisBottom).attr('transform', 'translate(0,' + (chartHeight - chartMargin.bottom) + ')')
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");;
}

const setXSongs = function () {
  populateXSongs();
  chartMargin.bottom = 90;
  allowXSongs(true)//enable album selection
  let albumNames = document.querySelector("#albumSelect").value;
  xArray = lyricData.filter(song => song.album === albumNames).map(song => song.name);//all song names in this album
  let albumScale = d3.scaleBand().domain(xArray).range([chartMargin.left, chartWidth - chartMargin.right]).padding(0.5);
  let axisBottom = d3.axisBottom(albumScale);
  d3.select('#bottom').call(axisBottom).attr('transform', 'translate(0,' + (chartHeight - chartMargin.bottom) + ')')
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");;
}

const allowXSongs = function (allowed) {
  const selector = document.getElementById('albumSelect');
  selector.disabled = !allowed;
}

const populateXSongs = function () {
  //populate album name selector
  let albumSelect = document.getElementById("albumSelect");
  if (albumSelect.childElementCount === 0) {//if not already populated
    for (let album of xAlbumsList) {
      var opt = document.createElement("option");
      opt.value = album;
      opt.innerHTML = album;
      albumSelect.appendChild(opt);
    }
  }
}

/*
  Functions to determine the scoring and display of the Y of the graph. the length of whatever is returned is the score.
*/

const drawY = function (max) {
  let scale = d3.scaleLinear().domain([max, 0]).range([chartMargin.top, chartHeight - chartMargin.bottom]);
  let axisLeft = d3.axisLeft(scale).tickFormat(d3.format("d"));
  d3.select('#left').call(axisLeft).attr('transform', 'translate(' + (chartMargin.left) + ', 0)');
}

const evalChars = function (text) {
  text = text.replace("\n", "");
  return text;
}

const evalWords = function (text) {
  text = text.replace("\n", " ") //remove newlines
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") //remove punctuation
    .replace(/\s{2,}/g, " "); //strip out extra spaces
  let words = text.split(" ");
  return words;
}

const evalUniqueWords = function (text) {
  let words = evalWords(text);
  return [...new Set(words)];
}

const drawBars = function (data){
  //clear all bars
  d3.selectAll('g.bar').remove();
  //start over again
  let barWidth = (chartWidth - chartMargin.left - chartMargin.right)/data.length;
  let y = d3.scaleLinear()
  .domain([maxVal, 0])
  .range([0, chartHeight])
  let svg = d3.select('#chart');
  let bar = svg
  .selectAll('g.bar')
  .data(data.map(d => d.value))
  .enter()
  .append('svg:g')
  .attr('class', 'bar')
  .attr('transform', (_, i) => 'translate(' + (1 + chartMargin.left + i * barWidth) + ', 0)');
  bar
  .append('rect')
  .attr('width', barWidth - 1)
  .attr('y', d => y(d) - chartMargin.bottom)
  .attr('height', d => chartHeight - y(d) )
}