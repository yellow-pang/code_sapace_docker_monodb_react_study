const express = require("express");
const router = express.Router();

/*
  메시지 구조 예시
  {
    id: 1,
    user: "Kang",
    text: "안녕하세요",
    dateStr: "2026-02-03 17:20:11"
  }
*/

let nextId = 1;
const messages = [];

function makeDateStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
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
  1) 최초 접속(또는 새로고침) 시 전체 메시지 제공
  GET /chat
*/
router.get("/", (req, res) => {
  res.json({
    lastId: messages.length ? messages[messages.length - 1].id : 0,
    messages,
  });
});

/*
  2) 새 메시지 폴링
  GET /chat/poll/:lastId
  - lastId 이후에 추가된 메시지만 반환
  - 없으면 빈 배열 반환
*/
router.get("/poll/:lastId", (req, res) => {
  const lastId = Number(req.params.lastId || 0);
  const newer = messages.filter((m) => m.id > lastId);

  res.json({
    lastId: newer.length ? newer[newer.length - 1].id : lastId,
    messages: newer,
  });
});

/*
  3) 메시지 전송
  POST /chat/send
  body: { user, text }
*/
router.post("/send", (req, res) => {
  const user = String(req.body?.user || "").trim();
  const text = String(req.body?.text || "").trim();

  if (!user || !text) {
    res.status(400).json({ error: "user와 text는 필수입니다." });
    return;
  }

  const msg = {
    id: nextId++,
    user,
    text,
    dateStr: makeDateStr(),
  };

  messages.push(msg);

  // 메모리 폭주 방지(최근 200개만 유지)
  if (messages.length > 200) messages.splice(0, messages.length - 200);

  res.json({ ok: true, message: msg });
});

module.exports = router;
