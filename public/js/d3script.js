let numbers = 20, maxNumber = 100, numberData = [], barColor = 'royalblue', sortAlgorithm = 'quicksort', currentChart
const outsideContainer = document.getElementById("outside-container")

function generateData() {
    numberData = []
    for (let i = 0; i < numbers; i++) {
        numberData.push(Math.floor(Math.random() * (maxNumber - 1) + 1))
    }
}
generateData()
currentChart = generateChart()
generateTweakpane()

function generateChart() {
    outsideContainer.removeChild(outsideContainer.firstChild)
    outsideContainer.innerHTML = '<div id="d3-container" />'
    const width = 900;
    const height = 450;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };

    const svg = d3.select('#d3-container')
        .append('svg')
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleBand()
        .domain(d3.range(numberData.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    const y = d3.scaleLinear()
        .domain([0, maxNumber])
        .range([height - margin.bottom, margin.top])
    const bar = svg.append("g")
        .attr("fill", barColor)
        .selectAll("rect")
        .data(numberData)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d))
        .attr('title', (d) => d)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d))
        .attr("width", x.bandwidth());

    function yAxis(g) {
        g.attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(null, numberData.format))
            .attr("font-size", '20px')
    }

    function xAxis(g) {
        g.attr("transform", `translate(0,${height - margin.bottom})`)
            .attr("font-size", '20px')
    }

    //svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
}

function generateTweakpane() {
    const PARAMS = {
        values: 20,
        max: 100,
        color: '#0f0',
        direction: "Ascending",
    };

    const pane = new Tweakpane.Pane();

    const valuesPane = pane.addInput(
        PARAMS, 'values',
        { min: 1, max: 200, step: 1 }
    );
    const maxPane = pane.addInput(
        PARAMS, 'max',
        { min: 1, max: 1000, step: 1 }
    );
    const colorPane = pane.addInput(PARAMS, 'color');

    const sortPane = pane.addInput(
        PARAMS, 'direction',
        {options: {Ascending: 'ascending', Desending: 'descending'}}
    );
    const sortButton = pane.addButton({
        title: 'Sort',
    });

    valuesPane.on('change', function (ev) {
        numbers = ev.value
        generateData()
        currentChart = generateChart()
    });
    maxPane.on('change', function(ev) {
        maxNumber = ev.value
        generateData()
        currentChart = generateChart()
    })
    colorPane.on('change', function(ev) {
        barColor = ev.value
        currentChart = generateChart()
    })
    sortButton.on('click', function() {
        sort()
    });
    sortPane.on('change', function(ev) {
        sortAlgorithm = ev.value
    })
}

function sort() {
    numberData = quickSort(numberData, 0, numberData.length - 1)
    if (sortAlgorithm === 'descending') { numberData = numberData.reverse() }
    currentChart = generateChart()
    
}

function setNumberData(data) {
    numberData = data
}