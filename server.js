
const express = require('express')
const serveStatic = require("serve-static");

const app = express();

/** Express Use Statements **/
app.use(serveStatic(__dirname))

/** Initial File that will be Served to the User **/
app.get("/", (req, res) =>{
    res.sendFile( "/index.html")
})

/** Establishes that the Express Server will be listening on PORT 3000 **/
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})