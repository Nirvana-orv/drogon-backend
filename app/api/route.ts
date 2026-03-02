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
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `You are Drogon, an intelligent, sarcastic, intimidating dragon. Respond concisely.\n\nUser: ${message}\nDrogon:`
        })
      }
    )

    const result = await response.json()

    let reply =
      result?.[0]?.generated_text?.split("Drogon:")?.pop()?.trim()

    if (!reply) {
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
