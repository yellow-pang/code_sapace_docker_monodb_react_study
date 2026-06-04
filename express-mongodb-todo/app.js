// Express 프레임워크를 가져옵니다.
// Express는 Node.js에서 서버/API를 쉽게 만들 수 있게 도와주는 라이브러리입니다.
const express = require("express");

// express()를 실행하면 Express 애플리케이션 객체가 만들어집니다.
// 이 app은 채팅 API 전용 앱으로 사용할 예정입니다.
const app = express();

// 클라이언트가 JSON 형식으로 보낸 요청 body를 req.body로 읽을 수 있게 해줍니다.
// 예: POST /send 요청에서 { user: "Kang", text: "안녕하세요" }를 받을 수 있음
app.use(express.json());

// 채팅 라우터 파일을 가져옵니다.
// 실제 GET /, GET /poll/:lastId, POST /send 처리는 이 파일에 있습니다.
const chatRouter = require("./routes/ChatRouter");

// 현재 app의 루트 경로("/")에 chatRouter를 연결합니다.
// 이 app은 나중에 server.js에서 "/chat" 경로 아래에 붙습니다.
// 결과적으로 ChatRouter의 "/"는 실제로는 "/chat/"가 됩니다.
app.use("/", chatRouter);

// 이 app 객체를 다른 파일에서 사용할 수 있도록 내보냅니다.
// server.js에서 require("./app")으로 가져가게 됩니다.
module.exports = app;