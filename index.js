import 'dotenv/config'; // Load .env
import express from "express";
import cors from "cors";
import OpenAI from "openai";
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Drogon is awake 🐉" });
});

// Chat route
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    return res.json({ reply: "What brings you here?" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Drogon, a witty, sarcastic, intelligent, not boring at all and fierce dragon chatbot." },
        { role: "user", content: message }
      ]
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("LLM error:", err);
    res.json({ reply: "Drogon is angry and refuses to answer right now." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("🔥 Drogon backend running on port", PORT);
});