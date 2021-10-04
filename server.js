const express = require("express"),
      app = express()

app.use(express.static(__dirname + '/public'))
app.get("/", (req,res) => res.sendFile(__dirname + "/views/index.html"))

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);