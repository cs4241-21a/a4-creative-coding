const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.static("/"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/home.html");
});

const server = app.listen(3000, () => {
  console.log("Server is listening on port", server.address().port);
});
