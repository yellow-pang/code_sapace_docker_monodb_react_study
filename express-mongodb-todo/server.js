const http = require("http");
const express = require("express");
const cors = require("cors");

const chatApp = require("./app");
const mainApp = express();

mainApp.use(cors());

// /chat 아래로 채팅 API 연결
mainApp.use("/chat", chatApp);

// 정적 파일 제공(public 폴더)
mainApp.use("/", express.static("public"));

const server = http.createServer(mainApp);

server.listen(3000, function () {
  console.log("running on server with http://localhost:3000");
});
