const express    = require('express'),
      app        = express()
const path = require('path')

const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))
// even with our static file handler, we still
// need to explicitly handle the domain name alone...
app.get('/', function(request, response) {
    response.sendFile( __dirname + '/public/index.html' )
})

const PORT = process.env.PORT||3000
app.listen( PORT, ()=> {
    console.log('click here for a surprise https://localhost:3000')
} )
