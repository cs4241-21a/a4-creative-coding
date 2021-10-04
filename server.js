const express = require( 'express' ),
      app = express(),
      cors = require('cors')

app.use(express.static('./public/'))
app.use(cors())

app.listen( process.env.PORT || 3000)