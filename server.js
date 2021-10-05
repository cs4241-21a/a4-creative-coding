const { response } = require('express')

const http = require('http'),
    express = require('express'),
    fs = require('fs')
    app = express(),
    port = 3000

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

// getdata
var publicdir = __dirname + '/';
app.post('/data', (req, res) => {
    fs.readFile(publicdir+'/public/pokemon.json', (err, data) =>{
        if (err){
            console.log('Error reading json file: '+ err)
            return 
        }
        let body = JSON.parse(data)
        res.send(JSON.stringify(body))
    })
});