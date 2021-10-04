// server.js
// where your node app starts

const express = require('express'),
      app     = express(),
      cors    = require('cors')

app.use( cors() )
app.use( express.static('./views') )


app.get("/views/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
  
});

app.listen( 5000 )
