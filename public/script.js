// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
document.body.style.zoom = "75%";

// get color for the bar
var dd = document.getElementById("color");
var barColor = dd.options[dd.selectedIndex].value;
// get scale for the bars
var d2 = document.getElementById("scale");
var barScale = parseFloat(d2.options[d2.selectedIndex].value);
// get range for the data to display
var d = document.getElementById("range");
var range = parseFloat(d.options[d.selectedIndex].value);
// get range for the data to display
var d4 = document.getElementById("top");
var top = parseFloat(d4.options[d4.selectedIndex].value);
// get sorting instructions
var d5 = document.getElementById("sort");
var sort = parseFloat(d5.options[d5.selectedIndex].value);
// get type for filtering negative or positive values or none 
var d6= document.getElementById("type");
var type = parseFloat(d6.options[d6.selectedIndex].value);

// set the dimensions of the canvas
var margin = { top: 100, right: 100, bottom: 100, left: 100 },
  width = 1750 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

function updateColor() {
  var barColor = dd.options[dd.selectedIndex].value;
  console.log(barColor);
  var svg = d3.selectAll("circle").attr("fill", barColor);
  return barColor;
}

function updateScale() {
  var barScale = d2.options[d2.selectedIndex].value;
  if (barScale != 0) {
    var x = d3.scale.ordinal().rangeRoundBands([0, width], barScale);
    console.log(barScale);
    var svg = d3.selectAll("circle").attr("r", barScale * 50);
  }
}




function displayHelp(){
  window.alert("Welcome, this page displays a graph containing information about the Meteorite Landings, it allowes you to control the design of the graph and the the specific information you want displayed, in order to edit your graph play around with the inputs from the drop down menus , different combinations produce different grpahs");
}
window.alert("Welcome, this page displays a graph containing information about the Meteorite Landings, it allowes you to control the design of the graph and the the specific information you want displayed, in order to edit your graph play around with the inputs from the drop down menus , different combinations produce different grpahs");
function updateRange() {
  var range = parseFloat(d.options[d.selectedIndex].value);
  var top = parseFloat(d4.options[d4.selectedIndex].value);
  var sort = parseFloat(d5.options[d5.selectedIndex].value);
  var type = parseFloat(d6.options[d6.selectedIndex].value);
  var newdata = [];
  var i = 0;

  svg.selectAll("*").remove();
  d3.json("data.json", function(error, data) {
    
    // filter data by range
    if (isNaN(range)) {
      data.forEach(function(d) {
        d.year = d.year;
        d.mass = d.mass;
        newdata[i] = d;
        i = i + 1;
      });
    } else {
      data.forEach(function(d) {
        if (parseInt(d.year) <= range + 99 && parseInt(d.year) >= range) {
          d.year = d.year;
          d.mass = d.mass;
          newdata[i] = d;
          i = i + 1;
        }
      });
    }
    
    //ranged data 
    var ranged = [];
    i = 0;
    // filter data by negatives or positives or none 
    if(type == 1){
      newdata.forEach(function(d) {
        if(d.mass < 1000){
        d.year = d.year;
        d.mass = d.mass;
        ranged[i] = d;
        i = i + 1;
        }
      });   
    }
    else if(type == 2){
      newdata.forEach(function(d) {
        if(d.mass > 100000 ){
        d.year = d.year;
        d.mass = d.mass;
        ranged[i] = d;
        i = i + 1;
        }
      });
      
    }
    else if (type ==0){
      ranged = newdata;
    }
          
    
    i = 0;
    var temp = [];
    var temp2 = [];
    if (top == 0) {
      if (sort == 1) {
        ranged = ranged.sort(
          (a, b) => parseFloat(b.mass) - parseFloat(a.mass)
        );
      } else if (sort == 2) {
        ranged = ranged.sort(
          (a, b) => parseFloat(a.mass) - parseFloat(b.mass)
        );
      }
      update(ranged);
    } else if (top == 1) {
      temp = ranged.sort(
        (a, b) => parseFloat(b.mass) - parseFloat(a.mass)
      );
      temp2 = [temp[0], temp[1], temp[2], temp[3], temp[4]];
      //// sort 
        if (sort == 1) {
          temp2 = temp2.sort(
            (a, b) => parseFloat(b.mass) - parseFloat(a.mass)
          );
        } else if (sort == 2) {
          temp2 = temp2.sort(
            (a, b) => parseFloat(a.mass) - parseFloat(b.mass)
          );
        }
      console.log(temp2)
      update(temp2);
    } else {
      temp = ranged.sort(
        (a, b) => parseFloat(a.mass) - parseFloat(b.mass)
      );
      temp2 = [temp[0], temp[1], temp[2], temp[3], temp[4]];
      //sort
          if (sort == 1) {
            temp2 = temp2.sort(
              (a, b) => parseFloat(b.mass) - parseFloat(a.mass)
            );
          } else if (sort == 2) {
            temp2 = temp2.sort(
              (a, b) => parseFloat(a.mass) - parseFloat(b.mass)
            );
          }
      update(temp2);
    }
  });
}

function update(newdata) {
   x.domain(
    newdata.map(function(d) {
      return d.year;
    })
  );
  y.domain([0, 500000]); 



  // add axis
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("stroke", "white")
    .text("mass");

  // Add bar chart
  svg
    .selectAll("dot")
    .data(newdata)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) {
      return x(d.year);
    })
    .attr("r", x.rangeBand())
    .attr("cy", function(d) {
      return y(d.mass);
    })
    .attr("height", function(d) {
      return height - y(d.mass);
    })
    .attr("fill", updateColor());
  updateScale();
}

// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.5);

var y = d3.scale.linear().range([height, 0]);

// define the axis
var xAxis = d3.svg
  .axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg
  .axis()
  .scale(y)
  .orient("left")
  .ticks(50);

// add the SVG element
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the data
d3.json("data.json", function(error, data) {
  data.forEach(function(d) {
    d.year = d.year;
    d.mass = d.mass;
  });

  // scale the range of the data
   x.domain(
    data.map(function(d) {
      return d.year;
    })
  );
  y.domain([0, 500000]); 




  // add axis
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(1," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("stroke", "white")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("stroke", "white")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("mass");

  // Add bar chart
  svg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) {
      return x(d.year);
    })
    .attr("r", x.rangeBand())
    .attr("cy", function(d) {
      return y(d.mass);
    })
    .attr("height", function(d) {
      return height - y(d.mass);
    })
    .attr("fill", barColor)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)


});