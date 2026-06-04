// Express를 가져옵니다.
const express = require("express");

// Express Router 객체를 만듭니다.
// Router는 관련 API들을 하나의 파일에 묶어서 관리할 때 사용합니다.
const router = express.Router();

/*
  메시지 하나의 구조 예시입니다.

  {
    id: 1,                         // 메시지 고유 번호
    user: "Kang",                  // 작성자 이름
    text: "안녕하세요",             // 메시지 내용
    dateStr: "2026-02-03 17:20:11" // 작성 시간 문자열
  }
*/

// 다음 메시지에 부여할 id 값입니다.
// 메시지가 하나 추가될 때마다 1씩 증가합니다.
let nextId = 1;

// 서버 메모리에 메시지를 저장하는 배열입니다.
// DB를 쓰지 않으므로 서버를 재시작하면 메시지는 사라집니다.
const messages = [];

// 현재 시간을 "YYYY-MM-DD HH:mm:ss" 형태의 문자열로 만들어주는 함수입니다.
function makeDateStr() {
  // 현재 날짜와 시간 객체를 만듭니다.
  const d = new Date();

  // 숫자가 한 자리일 때 앞에 0을 붙여 두 자리로 만드는 함수입니다.
  // 예: 3 -> "03", 12 -> "12"
  const pad = (n) => String(n).padStart(2, "0");

  // 날짜와 시간을 원하는 문자열 형태로 조합해서 반환합니다.
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds())
  );
}

/*
  1) 최초 접속 또는 새로고침 시 전체 메시지를 제공하는 API입니다.

  실제 요청 주소:
  GET /chat

  이유:
  사용자가 채팅 화면에 처음 들어오면 기존 메시지 목록을 한 번 받아와야 합니다.
*/
router.get("/", (req, res) => {
  // 현재 메시지가 하나라도 있으면 마지막 메시지의 id를 lastId로 내려줍니다.
  // 메시지가 없으면 lastId는 0입니다.
  res.json({
    lastId: messages.length ? messages[messages.length - 1].id : 0,

    // 현재 서버 메모리에 저장된 전체 메시지 배열을 내려줍니다.
    messages,
  });
});

/*
  2) 새 메시지만 가져오는 폴링 API입니다.

  실제 요청 주소:
  GET /chat/poll/:lastId

  예:
  GET /chat/poll/3

  의미:
  "나는 id가 3번인 메시지까지 받았으니,
   3번 이후에 새로 생긴 메시지만 주세요."
*/
router.get("/poll/:lastId", (req, res) => {
  // URL 파라미터로 받은 lastId를 숫자로 변환합니다.
  // 값이 없으면 기본값으로 0을 사용합니다.
  const lastId = Number(req.params.lastId || 0);

  // 전체 메시지 중에서 lastId보다 id가 큰 메시지만 찾습니다.
  // 즉, 클라이언트가 아직 받지 못한 새 메시지만 필터링합니다.
  const newer = messages.filter((m) => m.id > lastId);

  // 새 메시지 목록과 갱신된 lastId를 응답합니다.
  res.json({
    // 새 메시지가 있으면 그중 마지막 메시지 id를 lastId로 내려줍니다.
    // 새 메시지가 없으면 기존 lastId를 그대로 내려줍니다.
    lastId: newer.length ? newer[newer.length - 1].id : lastId,

    // 새 메시지 배열입니다.
    // 새 메시지가 없으면 빈 배열 []입니다.
    messages: newer,
  });
});

/*
  3) 메시지를 전송하는 API입니다.

  실제 요청 주소:
  POST /chat/send

  요청 body 예시:
  {
    "user": "Kang",
    "text": "안녕하세요"
  }
*/
router.post("/send", (req, res) => {
  // 요청 body에서 user 값을 꺼냅니다.
  // 값이 없으면 빈 문자열로 처리하고, 앞뒤 공백을 제거합니다.
  const user = String(req.body?.user || "").trim();

  // 요청 body에서 text 값을 꺼냅니다.
  // 값이 없으면 빈 문자열로 처리하고, 앞뒤 공백을 제거합니다.
  const text = String(req.body?.text || "").trim();

  // user 또는 text가 비어 있으면 잘못된 요청으로 처리합니다.
  if (!user || !text) {
    res.status(400).json({ error: "user와 text는 필수입니다." });
    return;
  }

  // 새 메시지 객체를 만듭니다.
  const msg = {
    // 현재 nextId를 id로 사용하고, 그 다음 nextId를 1 증가시킵니다.
    id: nextId++,

    // 작성자 이름
    user,

    // 메시지 내용
    text,

    // 작성 시간 문자열
    dateStr: makeDateStr(),
  };

  // 새 메시지를 서버 메모리 배열에 저장합니다.
  messages.push(msg);

  // 메시지가 너무 많이 쌓이는 것을 방지하기 위해 최근 200개만 유지합니다.
  // 200개를 초과하면 오래된 메시지부터 잘라냅니다.
  if (messages.length > 200) {
    messages.splice(0, messages.length - 200);
  }

  // 클라이언트에게 전송 성공 결과와 저장된 메시지를 응답합니다.
  res.json({
    ok: true,
    message: msg,
  });
});

// 이 router를 app.js에서 사용할 수 있도록 내보냅니다.
module.exports = router;