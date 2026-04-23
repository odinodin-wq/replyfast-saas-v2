const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// проверка сервера
app.get("/", (req, res) => {
  res.send("ReplyFast SaaS v2 is running 🚀");
});

// AI логика (пока простая)
app.post("/ai", (req, res) => {
  const msg = (req.body.message || "").toLowerCase();

  let reply = "Понял 😊";

  if (msg.includes("цена")) reply = "Цена 49€ 🔥";
  else if (msg.includes("есть")) reply = "Да, есть 👍";
  else if (msg.includes("доставка")) reply = "1–3 дня 🚚";
  else reply = "Могу помочь оформить заказ 😊";

  res.json({ reply });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
