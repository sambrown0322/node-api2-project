const express = require("express");

const server = express();
const expressRouter = require("./expressRouter");

server.use(express.json());
server.use("/api/posts", expressRouter);

server.listen(5000, () => {
  console.log("Running...");
});
