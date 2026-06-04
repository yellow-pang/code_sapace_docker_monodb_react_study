// Node.js 기본 http 모듈을 가져옵니다.
// Express 앱을 실제 HTTP 서버로 감싸서 실행할 때 사용합니다.
const http = require("http");

// Express를 가져옵니다.
// 여기서는 전체 서버의 메인 앱을 만들기 위해 사용합니다.
const express = require("express");

// CORS 미들웨어를 가져옵니다.
// 다른 출처에서 API 요청을 허용할 때 사용합니다.
const cors = require("cors");

// 채팅 기능이 들어 있는 Express 앱을 가져옵니다.
// app.js에서 module.exports = app으로 내보낸 객체입니다.
const chatApp = require("./app");

// 전체 서버 역할을 할 메인 Express 앱입니다.
// 정적 파일 제공, /chat API 연결 등을 담당합니다.
const mainApp = express();

// CORS 허용 미들웨어를 등록합니다.
// 브라우저에서 다른 origin으로 요청할 때 발생할 수 있는 CORS 문제를 줄여줍니다.
// 현재 예제에서는 chat.html과 API가 같은 서버라 꼭 필요하지 않을 수도 있지만,
// 실습 환경에서는 넣어두면 편합니다.
mainApp.use(cors());

// "/chat" 경로 아래에 채팅 앱을 연결합니다.
// 즉, app.js 안의 "/" 라우트는 실제로 "/chat/"가 됩니다.
// app.js 안의 "/poll/:lastId"는 실제로 "/chat/poll/:lastId"가 됩니다.
// app.js 안의 "/send"는 실제로 "/chat/send"가 됩니다.
mainApp.use("/chat", chatApp);

// public 폴더 안의 파일들을 정적 파일로 제공합니다.
// 예를 들어 public/chat.html 파일은 브라우저에서 다음 주소로 접근할 수 있습니다.
// http://localhost:3000/chat.html
mainApp.use("/", express.static("public"));

// Express 앱을 Node.js HTTP 서버로 만듭니다.
const server = http.createServer(mainApp);

// 3000번 포트에서 서버를 실행합니다.
// 서버가 정상 실행되면 콘솔에 주소를 출력합니다.
server.listen(3000, function () {
  console.log("running on server with http://localhost:3000");
});