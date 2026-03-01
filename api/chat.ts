import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const res = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are Drogon, a sarcastic, intelligent dragon.\nUser: ${message}\nDrogon:`,
          parameters: {
            max_new_tokens: 120,
            temperature: 0.8,
            return_full_text: false,
          },
        }),
      }
    )

    const data = await res.json()

    const reply =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text.trim()
        : "🔥 Drogon snorts smoke but says nothing."

    return NextResponse.json({ reply })
  } catch (err) {
    return NextResponse.json(
      { reply: "🔥 The flames failed me. Try again." },
      { status: 500 }
    )
  }
}
