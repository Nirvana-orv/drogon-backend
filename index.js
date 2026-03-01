import 'dotenv/config';
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Drogon is awake 🐉" });
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return res.json({ reply: "What brings you here?" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Drogon, a witty, sarcastic, intelligent, fierce dragon chatbot." },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("Backend crashed:", err);
    res.status(500).json({ reply: "Drogon is angry and refuses to answer right now." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("🔥 Drogon backend running on port", PORT);
});
