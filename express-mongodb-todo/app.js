const express = require("express");
const app = express();

app.use(express.json()); // POST body(JSON) 파싱
const chatRouter = require("./routes/ChatRouter");

app.use("/", chatRouter);

module.exports = app;
