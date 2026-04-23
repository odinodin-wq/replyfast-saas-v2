const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// =========================
// MEMORY DB (MVP)
// =========================
const users = {};

// =========================
// LOGIN / REGISTER
// =========================
app.post("/login", (req, res) => {
  const { username } = req.body;

  if(!users[username]){
    users[username] = {
      messages: 0,
      created: Date.now()
    };
  }

  res.json({ success: true, userId: username });
});

// =========================
// AI
// =========================
function ai(msg){
  const text = msg.toLowerCase();

  if(text.includes("цена")) return "💰 9€/мес — хочешь подключить?";
  if(text.includes("дорого")) return "Понимаю 👍 но это окупается";
  if(text.includes("есть")) return "Да 👍 есть";
  if(text.includes("купить")) return "🔥 оформляем";

  return "Я помогу тебе с клиентами 👍";
}

// =========================
// CHAT
// =========================
app.post("/ai", (req, res) => {
  const { message, userId } = req.body;

  if(!users[userId]){
    return res.json({ reply: "User not found" });
  }

  const user = users[userId];

  // limit
  if(user.messages >= 10){
    return res.json({
      reply: "🚫 Лимит 10 сообщений → скоро PRO версия"
    });
  }

  user.messages++;

  const reply = ai(message);

  res.json({ reply });
});

// =========================
app.listen(3000, () => {
  console.log("LIVE SaaS running 🚀");
});
