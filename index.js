const express = require("express");
const cors = require("cors");

const dbRouter = require("./hubs/db-router");

const server = express();

server.use(express.json());
server.use(cors());

server.use("/api/posts", dbRouter);

server.get("/", (req, res) => {
  res.send(`
    <h1>Is this working? Cool</h1>
  `);
});

// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub
const port = 7000;
server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
