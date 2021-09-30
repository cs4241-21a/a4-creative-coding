/**
 * Create title and description in html head after figuring out topic for project
 */

const express = require('express')
const cookie = require('cookie-session')
const app = express()
const path = require('path')
const router = express.Router()
const bodyParser = require("body-parser")
const yahooFinance = require('yahoo-finance')

const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use( express.urlencoded({ extended:true }))
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.listen(process.env.PORT || 3000)

app.post('/retrieveQuote', function(req, res) {
    yahooFinance.historical({
        symbol: 'AAPL',
        from: '1998-01-01',
        to: '1998-12-31',
        period: 'w'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
      }, function (err, quotes) {
          console.log(quotes)
      });
})