// client-side js, loaded by index.html
// run by the browser each time the page is loaded
console.log("hello world :o");

var PARAMS = {
  color: '#0027ff',
  size: 5,
  type: 'all',
  minimum: 0
};

const pane = new Tweakpane.Pane({ container: document.getElementById('tweakpane'), title: 'Parameters', expanded: true });

const width = 800,
      height = 800

var found = false      

const svg = d3.select('#masssize').append('svg')
svg.attr('width', width)
    .attr('height', height)

const inputColor = pane.addInput(
  PARAMS, 'color'
);

inputColor.on('change', function(ev) {
  console.log(`change: ${ev.value}`)
  PARAMS.color = ev.value
  svg.selectAll('circle')
      .attr( 'fill', PARAMS.color )
      .attr('opacity', 0.5)
  svg2.selectAll('rect')
      .attr( 'fill', PARAMS.color )
});

const inputSize = pane.addInput(
  PARAMS, 'size',
  {min: 1, max: 10, step: 1}
);

inputSize.on('change', function(ev) {
  console.log(`change: ${ev.value}`)
  PARAMS.size = ev.value
  if(found == true) {
    fetch( "https://data.nasa.gov/resource/y77d-th95.json" )
    .then( data => data.json() )
    .then( jsonData => {
      svg.selectAll('circle')
         .attr('r', d => d.mass * PARAMS.size)
    })
  } else {
    fetch( "https://data.nasa.gov/resource/y77d-th95.json" )
    .then( data => data.json() )
    .then( jsonData => {
      svg.selectAll('circle')
         .attr('r', d => d.mass / (10000 * PARAMS.size))
    })
  }
});

const inputType = pane.addInput(
  PARAMS, 'type',
  {options: {All: 'all', Fell: 'Fell', Found: 'Found'}}
);

function filterJSON(json, key, value) {
    var result = [];
    for (var indicator in json) {
        if (json[indicator][key] === value) {
            result.push(json[indicator]);
        }//from  w w w  .  d  e m  o2  s.  c  om
    }
    return result;
}

inputType.on('change', function(ev) {
  console.log(`change: ${ev.value}`)
  PARAMS.type = ev.value
  if(PARAMS.type == 'Fell'){
    found = false
   fetch( "https://data.nasa.gov/resource/y77d-th95.json" )
    .then( data => data.json() )
    .then( jsonData => {
      var filtered = filterJSON(jsonData, 'fall', 'Fell')
      console.log(filtered)
      svg.selectAll('circle')
        .data( filtered )
        .join( 'circle' )
        .attr( 'fill', PARAMS.color )
        .attr('opacity', 0.5)
        .attr( 'cx', d => d.reclat )
        .attr( 'cy', d => d.reclong )
        .attr( 'r', d => d.mass / (10000 * PARAMS.size) )
        .attr("transform",function() {
            var movementX = width /2;
            var movementY = height /2;
            return "translate("+movementX+","+movementY +")" 
        })
    })
  } else if (PARAMS.type == 'Found') {
    found = true
    fetch( "https://data.nasa.gov/resource/y77d-th95.json" )
    .then( data => data.json() )
    .then( jsonData => {
      var filtered = filterJSON(jsonData, 'fall', 'Found')
      console.log(filtered)
      svg.selectAll('circle')
        .data( filtered )
        .join( 'circle' )
        .attr( 'fill', PARAMS.color )
        .attr('opacity', 0.5)
        .attr( 'cx', d => d.reclat )
        .attr( 'cy', d => d.reclong )
        .attr( 'r', d => d.mass )
        .attr("transform",function() {
            var movementX = width /2;
            var movementY = height /2;
            return "translate("+movementX+","+movementY +")" 
        })
    })
  } else {
    found = false
      fetch( "https://data.nasa.gov/resource/y77d-th95.json" )
    .then( data => data.json() )
    .then( jsonData => {
      svg.selectAll('circle')
        .data( jsonData )
        .join( 'circle' )
        .attr( 'fill', PARAMS.color )
        .attr('opacity', 0.5)
        .attr( 'cx', d => d.reclat )
        .attr( 'cy', d => d.reclong )
        .attr( 'r', d => d.mass / (10000 * PARAMS.size) )
        .attr("transform",function() {
            var movementX = width /2;
            var movementY = height /2;
            return "translate("+movementX+","+movementY +")" 
        })
    })
    }
});

function filterJSONmin(json, key, value) {
    var result = [];
    for (var indicator in json) {
        if (json[indicator][key] >= value) {
            result.push(json[indicator]);
        }//from  w w w  .  d  e m  o2  s.  c  om
    }
    return result;
}

const inputMinimum = pane.addInput(
  PARAMS, 'minimum'
);

inputMinimum.on('change', function(ev) {
  console.log(`change: ${ev.value}`)
  PARAMS.minimum = ev.value
  fetch( "https://data.nasa.gov/resource/y77d-th95.json" )
    .then( data => data.json() )
    .then( jsonData => {
      var filtered = filterJSONmin(jsonData, 'mass', ev.value)
      console.log(filtered)
      svg.selectAll('circle')
        .data( filtered )
        .join( 'circle' )
        .attr( 'fill', PARAMS.color )
        .attr('opacity', 0.5)
        .attr( 'cx', d => d.reclat )
        .attr( 'cy', d => d.reclong )
        .attr( 'r', d => d.mass / (10000 * PARAMS.size) )
        .attr("transform",function() {
            var movementX = width /2;
            var movementY = height /2;
            return "translate("+movementX+","+movementY +")" 
        })
    })
});

//Second visualization code
var margin = {top: 10, right: 30, bottom: 90, left: 40},
    width2 = 460 - margin.left - margin.right,
    height2 = 450 - margin.top - margin.bottom;

const svg2 = d3.select('#yearsdocumented')
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

window.onload = function() {
  const radius = 40,
        y = 50
  //Starting point for first visualization
  fetch( "https://data.nasa.gov/resource/y77d-th95.json" )
    .then( data => data.json() )
    .then( jsonData => {
      svg.selectAll('circle')
        .data( jsonData )
        .join( 'circle' )
        .attr( 'fill', PARAMS.color )
        .attr('opacity', 0.5)
        .attr( 'cx', d => d.reclat )
        .attr( 'cy', d => d.reclong )
        .attr( 'r', d => d.mass / (10000 * PARAMS.size) )
        .attr("transform",function() {
            var movementX = width /2;
            var movementY = height /2;
            return "translate("+movementX+","+movementY +")" 
        })
    })
  //Starting point for second visualization
  fetch( "https://data.nasa.gov/resource/y77d-th95.json" )
    .then( data => data.json() )
    .then( jsonData => {
      // X axis
      var x = d3.scaleBand()
        .range([ 0, width2 ])
        .domain(jsonData.map(function(d) { return d.fall; }))
        .padding(0.2);
    
      svg2.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, 1000])
        .range([ height2, 0]);
      svg2.append("g")
        .call(d3.axisLeft(y));

    //count up values for
      var nest = d3.nest()
      .key(function(d) { return d.fall; })
      .rollup(function(values) { return values.length; })
      .entries(jsonData);
    
        var tooltip = d3.select("#yearsdocumented")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    console.log(d3.select(this).datum().fall)
    var subgroupValue = d3.select(this).datum().fall;
    tooltip
        .html("Value: " + subgroupValue)
        .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }
  
   // Bars
      svg2.selectAll("mybar")
        .data(jsonData)
        .join("rect")
          .attr("x", function(d) { return x(d.fall)+50; })
          .attr("width", 50)
          .attr("fill", PARAMS.color)
          // no bar at the beginning thus:
          .attr("height", function(d) { 
                              if(d.fall == "Fell") {
                                return (height2 - y(nest[0].value))
                              } else {
                                return height2 - y(nest[1].value)
                              }
                          })
          .attr("y", function(d) { 
                        if(d.fall == "Fell") {
                          return (y(nest[0].value))
                        } else {
                          return y(nest[1].value)
                        }
                     })
        .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    })
}
