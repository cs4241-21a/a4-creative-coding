/**
 * Create title and description in html head after figuring out topic for project
 */

const express = require('express')
const app = express()
const path = require('path')

const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))

app.listen(process.env.PORT || 3000)
