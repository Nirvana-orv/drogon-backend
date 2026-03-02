export async function POST(req) {
  try {
    const { message } = await req.json()

    if (!message) {
      return Response.json(
        { reply: "Speak properly, human." },
        { status: 400 }
      )
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are Drogon, an intelligent, intimidating dragon. Respond clearly and concisely.\n\nUser: ${message}\nDrogon:`,
          parameters: {
            max_new_tokens: 120,
            temperature: 0.8,
            return_full_text: false
          }
        }),
      }
    )

    const result = await response.json()

    let reply = ""

    if (Array.isArray(result) && result[0]?.generated_text) {
      reply = result[0].generated_text.trim()
    } else if (typeof result?.generated_text === "string") {
      reply = result.generated_text.trim()
    } else {
      reply = "🔥 The flames flicker. Speak again."
    }

    return Response.json({ reply })
  } catch (err) {
    console.error(err)
    return Response.json(
      { reply: "🔥 The flames failed me. Try again." },
      { status: 500 }
    )
  }
}
