import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ reply: "No message provided." })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    })

    res.status(200).json({
      reply: completion.choices[0].message.content,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ reply: "🔥 Drogon failed to breathe fire." })
  }
}
