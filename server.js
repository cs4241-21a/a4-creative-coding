const express = require('express'),
      app  = express(),
      port = 3001

// Endpoints

app.use(express.static("public"));

app.get('/', function(_req, response) {
  response.sendFile( __dirname + '/public/index.html' )
});

app.listen(process.env.PORT || port);
