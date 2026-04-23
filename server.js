const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* =========================
   DATABASE (простая память)
========================= */
const db = {};

/* =========================
   USER MODEL
========================= */
function getUser(id){
  if(!db[id]){
    db[id] = {
      messages: 0,
      pro: false,
      memory: []
    };
  }
  return db[id];
}

/* =========================
   AI SALES ENGINE
========================= */
app.post("/ai", (req, res) => {
  const { message, userId } = req.body;

  const user = getUser(userId);

  // 🚫 FREE LIMIT
  if(!user.pro && user.messages >= 10){
    return res.json({
      reply: "🚫 Free лимит закончился.\nОбновись до PRO чтобы продолжить 💰"
    });
  }

  user.messages++;

  const msg = message.toLowerCase();
  let reply = "";

  // 🔥 SALES LOGIC
  if(msg.includes("цена")){
    reply = "🔥 Цена 49€\nОсталось мало, отправка сегодня. Оформляем?";
  }
  else if(msg.includes("есть")){
    reply = "Да 👍 есть в наличии\nНо быстро заканчивается 🔥";
  }
  else if(msg.includes("дорого")){
    reply = "Понимаю 👍\nНо сейчас акция заканчивается сегодня 🔥";
  }
  else if(msg.includes("купить") || msg.includes("заказ")){
    reply = "🔥 Отлично!\nНапиши адрес и телефон — оформим заказ";
  }
  else {
    reply = "Могу помочь 😊 спроси цену или наличие";
  }

  // 🧠 MEMORY (как у стартапа)
  user.memory.push({
    input: message,
    output: reply
  });

  res.json({ reply });
});

/* =========================
   STRIPE WEBHOOK (PRO unlock)
========================= */
app.post("/webhook", (req, res) => {
  const event = req.body;

  if(event.type === "checkout.session.completed"){
    const userId = event.data.object.metadata.userId;

    const user = getUser(userId);
    user.pro = true;
  }

  res.sendStatus(200);
});

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
  console.log("SaaS running 🚀");
});
