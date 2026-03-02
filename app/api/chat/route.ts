export async function POST(req) {
  try {
    const { message } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "Speak properly, human." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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
          inputs: `You are Drogon, a highly intelligent, ruthless dragon. You respond with sharp wit, deep reasoning, and controlled sarcasm. Never mention being an AI.

User: ${message}
Drogon:`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.8,
            return_full_text: false,
          },
        }),
      }
    )

    const result = await response.json()
    console.log("HF RESULT:", JSON.stringify(result, null, 2))

    let reply = "🔥 The flames flicker. Speak again."

    if (Array.isArray(result) && result[0]?.generated_text) {
      reply = result[0].generated_text.trim()
    } else if (typeof result?.generated_text === "string") {
      reply = result.generated_text.trim()
    }

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (err) {
    console.error("CHAT ERROR:", err)
    return new Response(
      JSON.stringify({ reply: "🔥 The flames failed me. Try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
