const express    = require('express'),
      app        = express();

app.use( express.static( 'public' ) );

app.get('/', function(request, response) {
  response.sendFile( __dirname + '/index.html' )
});

app.listen( 3000 );