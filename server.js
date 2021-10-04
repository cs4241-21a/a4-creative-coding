const express = require("express"),
  app = express();

app.use(express.static("public"));

app.use( function( req, res, next ) {
  console.log( 'url:', req.url )
  next()
})

app.get( '/', function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
})

app.listen(process.env.PORT || 3000);