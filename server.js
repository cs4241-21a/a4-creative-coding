const express = require('express'),
      app     = express(),
      cors    = require('cors'),
      path = require('path'),
      router = express.Router(),
      port = process.env.PORT || 3000
/*
app.get('/', function(req, res){
    res.render('index.ejs');});
*/

app.use( cors() )

// make all the files available
// https://expressjs.com/en/starter/static-files.html
app.use( express.static('public') )
app.use( express.static('assets') )

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
 // console.log(__dirname);

});



// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  //  console.log(__dirname);

});
  
//app.listen( 3000 )