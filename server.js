const express = require('express');

const port = 3000;
const dir = `${__dirname}/public`;

// server
const server = express();
server.listen(process.env.PORT || port);

// middleware
server.use(express.json()); // parses HTTP request bodys
server.use(express.static(dir)); // serve static public files

// default index.html route
server.get('/', async (req, res) => {
  res.sendFile(`${dir}/index.html`);
});
