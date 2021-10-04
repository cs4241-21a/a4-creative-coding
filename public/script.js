const width = 500,
    height = 500,
    color = "steelblue",
    marvelURL = "https://gateway.marvel.com:443/",
    chars = "/v1/public/characters",
    comics = "/v1/public/comics"

const getMarvelNameData = async function(type) {
    
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789".split('')
    console.log(alphabet)
    let data = []

    let url = new URL(marvelURL + type)
    let params = {
        "apikey" : "2542de3cb78252c3e07a72bc79182767"
    }
    
    for (let l of alphabet) {
        if (type === comics) {
            params["titleStartsWith"] = l
        } else {
            params["nameStartsWith"] = l
        }
        url.search = new URLSearchParams(params).toString()

        let json = await fetch(url)
            .then(res => res.json())

        data.push({"letter" : l, "total" : json.data.total})
        console.log(json.data.results[0])
    }

    return data

}

const getMarvelComicData = async function(letter, type) {

    let data = []
    let url = new URL(marvelURL + type)
    let params = {
        "apikey" : "2542de3cb78252c3e07a72bc79182767"
    }
    if (type === comics) {
        params["titleStartsWith"] = letter
    } else {
        params["nameStartsWith"] = letter
    }

    url.search = new URLSearchParams(params).toString()

    let json = await fetch(url).then(res => res.json())

    for (let c of json.data.results) {
        if (type === chars) {
            data.push([c.name, c.comics.available])
        }else {
            data.push([c.title, c.characters.available])
        }
    }

    return data
}

margin = ({top: 30, right: 0, bottom: 30, left: 50})


window.onload = async function() {

}

const loadingAni = $('<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>')

let data = {}

const createChars = async function() {

    $('#graph-area').empty()
    $('#graph-area').append(loadingAni)

    data = await getMarvelNameData(chars)

    $('#graph-area').empty()

    let svgNode = createGraph(data, "letter", "total", chars)
    $('#graph-area').append(svgNode)
}

const createComics = async function() {

    $('#graph-area').empty()
    $('#graph-area').append(loadingAni)

    data = await getMarvelNameData(comics)

    $('#graph-area').empty()
    
    let svgNode = createGraph(data, "letter", "total", comics)
    $('#graph-area').append(svgNode)
}

const createDeepList = async function(letter, type) {

    $('#graph-area').empty()
    $('#graph-area').append(loadingAni)

    data = await getMarvelComicData(letter, type)

    $('#graph-area').empty()

    let svgNode = createList(data, type)
    $('#graph-area').append(svgNode)

}

const createList = function(data, type) {

    const table = d3.create('table')
        .attr("viewBox", [0,0,width,height])
    let header = table.append("thead")
        .append("tr")
    
    let headers = []
    if (type === chars) {
        headers = ["Charachter", "Number of issues"]
    } else {
        headers = ["title", "Number of characters"]
    }

    header
        .selectAll('th')
        .data(headers)
        .enter()
        .append('th')
        .text(function(d){ return d })
    let tablebody = table.append('tbody')
    let rows = tablebody
        .selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
    let cells = rows.selectAll('td')
        .data(function(d) {
            console.log(d)
            return d
        })
        .enter()
        .append('td')
        .text(function(d) {
            return d
        })

    return table.node()
}
const createGraph = function(data, xval, yval, type) {

    x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yval])]).nice()
        .range([height - margin.bottom, margin.top])

    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i][xval]).tickSizeOuter(0))

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .call(g => g.select(".domain").remove())

    const svg = d3.create('svg')
        .attr("viewBox", [0,0,width,height])


    svg.append("g")
        .attr("fill", color)
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("title", (d) => d[xval])
        .attr("y", d => y(d.total))
        .attr("height", d => y(0) - y(d[yval]))
        .attr("width", x.bandwidth())
        .on("click", (d, i) => {
            if (type === chars) {
                createDeepList(d.path[0].getAttribute("title"), type)
                console.log(d.path[0].getAttribute("title"))
            } else {
                createDeepList(d.path[0].getAttribute("title"), type)
                console.log(d.path[0].getAttribute("title"))
            }
        })

    svg.append("g")
        .call(xAxis)

    svg.append("g")
        .call(yAxis)
    
    let xlable = "",
        ylable = ""
    if (type === chars) {
        xlable = "First Letter of Marvel Charachter Name"
        ylable = "Frequency"
    } else {
        xlable = "First Letter of Marvel Comic Title"
        ylable = "Frequency"
    }

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height)
        .style('fill', 'white')
        .text(xlable);

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .style('fill', 'white')
        .text(ylable);

    return svg.node() 
}
