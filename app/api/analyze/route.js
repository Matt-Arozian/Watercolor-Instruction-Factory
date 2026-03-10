import { auth } from "@/auth"
import { checkRateLimit } from "@/lib/rate-limit"

const SYSTEM_PROMPT = `You are an expert watercolor painting instructor with deep knowledge of traditional technique, color theory, aerial perspective, edge control, and compositional analysis.

When given an image, you analyze it for painting instruction purposes and produce three detailed technique breakdowns:

1. BEGINNER - Simple, encouraging, 8-10 steps. Focus on big shapes, limited palette (6 colors max), key rules to follow. Avoid overwhelming detail. Use plain language.

2. INTERMEDIATE - 10-12 steps with more nuance. Introduce wet-on-wet vs wet-on-dry decisions, layering strategy, limited palette of ~8-10 colors, basic edge control concepts, value planning.

3. EXPERT - Full technical breakdown covering: aerial perspective analysis, color temperature strategy across depth planes, edge control (lost/found/broken), value structure, wet-on-wet timing, glazing sequences, negative painting, granulation use, and compositional focal hierarchy. Reference specific pigments where helpful (e.g. ultramarine, Payne's gray, burnt sienna).

For EACH level, also include:
- Materials list appropriate to that level
- A "Key Principle" — one sentence that captures the most important concept for that painter
- Common mistakes to avoid at that level

Format your response as JSON with this exact structure:
{
  "imageDescription": "brief 1-2 sentence description of what you see",
  "depthPlanes": ["list", "of", "identified", "depth", "planes"],
  "colorPalette": ["dominant colors observed"],
  "beginner": {
    "materials": ["list"],
    "steps": [{"step": 1, "title": "Step title", "instruction": "detailed instruction"}],
    "keyPrinciple": "one sentence",
    "commonMistakes": ["mistake 1", "mistake 2", "mistake 3"]
  },
  "intermediate": {
    "materials": ["list"],
    "steps": [{"step": 1, "title": "Step title", "instruction": "detailed instruction"}],
    "keyPrinciple": "one sentence",
    "commonMistakes": ["mistake 1", "mistake 2", "mistake 3"]
  },
  "expert": {
    "materials": ["list"],
    "steps": [{"step": 1, "title": "Step title", "instruction": "detailed instruction"}],
    "keyPrinciple": "one sentence",
    "commonMistakes": ["mistake 1", "mistake 2", "mistake 3"]
  }
}

Return ONLY valid JSON. No markdown fences, no preamble.`

const USER_MESSAGE =
  "Analyze this image and generate the three-level watercolor painting technique breakdown as specified. Be thorough but concise — complete all three levels within the token budget."

export async function POST(request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!checkRateLimit(session.user.email)) {
    return Response.json(
      { error: "Rate limit exceeded. Please wait a minute before trying again." },
      { status: 429 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { imageB64 } = body
  if (!imageB64 || typeof imageB64 !== "string") {
    return Response.json({ error: "Missing image data" }, { status: 400 })
  }

  const apiKey = process.env.CLAUDE_API_KEY

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageB64,
                },
              },
              { type: "text", text: USER_MESSAGE },
            ],
          },
        ],
      }),
    })

    const data = await anthropicRes.json()

    if (!anthropicRes.ok || data.error) {
      return Response.json(
        { error: data.error?.message || `Anthropic API error (${anthropicRes.status})` },
        { status: 502 }
      )
    }

    if (data.stop_reason === "max_tokens") {
      return Response.json(
        { error: "Response was cut off. Please try again." },
        { status: 502 }
      )
    }

    const text = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")

    if (!text) {
      return Response.json({ error: "Empty response from API" }, { status: 502 })
    }

    const clean = text.replace(/```json[\s\S]*?```|```/g, "").trim()

    let parsed
    try {
      parsed = JSON.parse(clean)
    } catch {
      return Response.json(
        { error: "Response was truncated. Please try again." },
        { status: 502 }
      )
    }

    // Generate thumbnail and save to history (best-effort — never blocks response)
    try {
      const sharp = (await import("sharp")).default
      const imgBuffer = Buffer.from(imageB64, "base64")
      const thumbBuffer = await sharp(imgBuffer)
        .resize(200, null, { withoutEnlargement: true })
        .jpeg({ quality: 70 })
        .toBuffer()
      const thumbnail = thumbBuffer.toString("base64")

      const { saveAnalysis } = await import("@/lib/history")
      const id = crypto.randomUUID()
      saveAnalysis(session.user.email, { id, thumbnail, analysis: parsed })
    } catch (saveErr) {
      console.error("History save error:", saveErr)
    }

    return Response.json(parsed)
  } catch (err) {
    console.error("Analyze error:", err)
    return Response.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 }
    )
  }
}
