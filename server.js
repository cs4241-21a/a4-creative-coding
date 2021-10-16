// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const favicon = require("serve-favicon");
const path = require("path");

const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.static("data"));

//add favicon
app.use(favicon(path.join(__dirname, "/", "favicon.ico")));

app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000);

// https://expressjs.com/en/starter/basic-routing.html

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.get("/index.html", (request, response) => {
  response.redirect("/");
});

app.get("/lyrics", bodyparser.json(), (request, response) => {
  //read the lyrics directory
  fs.readdir("data", (err, files) => {
  if (err)
    console.log(err);
  else {
    //return files
    //console.log(files);
    response.json(files);
  }
})
  //.then
});
