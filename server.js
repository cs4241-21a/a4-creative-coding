const express = require("express");
const app = express();

const doctors = ["david tennant is a daddy"];

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/doctors", (request, response) => {
  response.json(doctors);
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
