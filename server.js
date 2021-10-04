const express = require('express')
const app = express()



app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req,res) => {
    res.sendFile( __dirname + '/public/index.html' )
})

const listener = app.listen(3000, function() {
    console.log( 'Your app is listening on port ' + listener.address().port )
})