import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json(
        { reply: "🐉 Speak, or be silent forever." },
        { status: 400 }
      )
    }

    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are Drogon the dragon. Respond intelligently, arrogantly, and with dark wit.\nUser: ${message}\nDrogon:`,
          parameters: {
            max_new_tokens: 120,
            temperature: 0.8,
          },
        }),
      }
    )

    if (!hfRes.ok) {
      const text = await hfRes.text()
      return NextResponse.json(
        { reply: "🔥 The flames sputtered. Try again." },
        { status: 500 }
      )
    }

    const data = await hfRes.json()

    const reply =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text.split("Drogon:").pop().trim()
        : "🐉 I refuse to answer that."

    return NextResponse.json({ reply })
  } catch (err) {
    return NextResponse.json(
      { reply: "🔥 Drogon is silent. The flames failed." },
      { status: 500 }
    )
  }
}
