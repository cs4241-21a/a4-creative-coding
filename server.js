const express = require('express'),
      app = express(),
      cors = require('cors'),
      port = 3000

app.use( cors() )
app.use(express.static('public'))

app.listen( process.env.PORT || port );