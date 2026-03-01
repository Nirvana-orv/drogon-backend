import OpenAI from "openai"
export const config = {
  runtime: "nodejs",
};
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { message } = req.body

  if (!message) {
    return res.status(400).json({ reply: "Speak, human." })
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Drogon, a sarcastic, intelligent, intimidating, intriguing and entertaining dragon. You mock stupidity and respect clarity.",
        },
        { role: "user", content: message },
      ],
    })

    res.status(200).json({
      reply: JSON.stringify(completion),
    })
  } catch (err) {
    res.status(500).json({
      reply: "🔥 The flames failed me. Try again.",
    })
  }
}
