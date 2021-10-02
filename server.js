const port = 3000,
    express = require('express'),
    app = express()

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})