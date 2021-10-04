const express = require('express')

const app = express()
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

/* MIDDLEWARE SETUP */
app.use(express.static('public'))

app.get('/', function (req, res) {
    // Get the logged in user
    res.sendFile('public/index.html')
})

// Connect to the client
app.listen(port)
