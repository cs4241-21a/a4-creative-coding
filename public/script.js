// declaring varibles
const margin = { top: 50, right: 50, bottom: 50, left: 50 },
    height = 300,
    width = 300

// creating SVG
var svgType = d3.select('#typeBarChart')
    .attr('width', width)
    .attr('height', height)

var svgWeak = d3.select('#weakBarChart')
    .attr('width', width)
    .attr('height', height)

var pokemon = [],
    typeData = [],
    weakData = []

window.onload= function () {
    fetch('/data', {
        method: 'POST'
    }).then(response => response.json())
    .then(function(data){
            console.log(data)
            data['pokemon'].forEach(function (d) {
                var p = {
                    'name': d['name'],
                    'type': d['type'],
                    'weaknesses': d['weaknesses']
                }
                pokemon.push(p)
    
                d['type'].forEach(function (d) {
                    const index = exists(typeData, d)
                    if (index !== -1) {
                        typeData[index]['val']++
                        typeData[index]['pokemon'].push(p['name'])
                    } else {
                        var t = {}
                        t['type'] = d
                        t['val'] = 1
                        t['pokemon'] = []
                        t['pokemon'].push(p['name'])
                        typeData.push(t)
                    }
    
                })
    
                d['weaknesses'].forEach(function (d) {
                    const index = exists(weakData, d)
                    if (index !== -1) {
                        weakData[index]['val']++
                        weakData[index]['pokemon'].push(p['name'])
                    } else {
                        var t = {}
                        t['type'] = d
                        t['val'] = 1
                        t['pokemon'] = []
                        t['pokemon'].push(p['name'])
                        weakData.push(t)
                    }
                })
    
    
            })
            graph(svgType, typeData)
            graph(svgWeak, weakData)
        })
        console.log(typeData)         
}
// Create Bar Graphs
var graph = function (svg, d) {

    //sort data so it's descending
    d = d.slice().sort((a, b) => d3.descending(a.val, b.val))
    data = d

    // set scales
    var yScale = d3.scaleBand()
        .domain(d.map(function (d) { return (d.type) }))
        .range([0, width - margin.left - margin.right])
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(d, function (d) { return d.val })])
        .range([0, height - margin.top - margin.bottom,])

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    // append axis
    var xAxis = d3.axisBottom()
        .scale(xScale)
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + (height - margin.top - margin.bottom) + ")")
        .call(xAxis)
        .attr("class", 'xAxis')

    var yAxis = d3.axisLeft()
        .tickSize(0)
        .scale(yScale)
    svg.append('g')
        .attr('transform', "translate(" + margin.left + ", 0 )")
        .call(yAxis)
        .attr('class', "yAxis")


    // Add X axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
        .attr("y", height - margin.bottom)
        .text("Number of Pokemon");

    // Add Y axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", -(height / 2))
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")

    // Add Bars
    var bars = svg.selectAll(".bar")
        .data(d)
        .enter().append("rect")
        .attr("class", "bar")
        .attr('type', function (d) { return d.type })
        .attr("x", function (d) { return margin.left })
        .attr("y", function (d) { return yScale(d.type) })
        .attr("width", function (d) { return xScale(d.val) })
        .attr("height", function (d) { return yScale.bandwidth() })
        .on('mouseover', function (e, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.80')

            let div = d3.select('.tooltip')

            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html('Num of Pokemon: ' + d.val + "<br/>")
                .style("left", (e.pageX) + "px")
                .style("top", (e.pageY - 28) + "px");
        })
        .on('click', function (e, d) {
            d3.select("#pokemonList").selectAll("*").remove()
            d3.select("#pokemonList2").selectAll("*").remove()

            var pokeList = d.pokemon
            let list = d3.select('#pokemonList')
            let list2 = d3.select('#pokemonList2')
            for (let i = 0; i < (Math.floor(pokeList.length / 2)); i++) {
                list.append('p')
                    .text(pokeList[i])
            }
            for (let i = (Math.floor(pokeList.length / 2)); i < pokeList.length; i++) {
                list2.append('p')
                    .text(pokeList[i])
            }
        })
        .on('mouseout', function (e, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1')

            let div = d3.select('.tooltip')

            div.transition()
                .duration(200)
                .style("opacity", 0);
        })
}


// Checks to see if a type or weakness is in the array already
var exists = function (obj, key) {
    let result = -1

    if (obj.length === 0) {
        return result
    }
    obj.forEach(function (d, i) {
        let vals = Object.values(obj[i])
        if (vals.indexOf(key) > -1) {
            result = i
        }
    })
    return result
}
