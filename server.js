const express = require('express')
const morgan = require('morgan')
const csp = require('helmet-csp')

const app = express();
app.use(express.static('public'))
//app.use(express.static(__dirname));
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'))
app.use(csp({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js', 'https://cdn.jsdelivr.net/npm/tweakpane@3.0.5/dist/tweakpane.js', 'https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/addons/p5.sound.js']
    }
}))

app.use( function( req, res, next ) {
    console.log( 'url:', req.url )
    next()
})
app.get( '/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html" )
})

app.listen(process.env.PORT ||3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
})