import { GoogleGenAI } from "@google/genai";
import { AI_PROMPTS } from "@/lib/ai-utils";

export const dynamic = "force-dynamic";

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
}

export async function POST(req: Request) {
  const ai = getAI();
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return new Response("Missing imageUrl", { status: 400 });
  }

  const base64Image = imageUrl.split(",")[1] || imageUrl;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: AI_PROMPTS.IMAGE_ANALYSIS },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? JSON.stringify({ error: "No response" });
    return new Response(text, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini 3 Analysis Error:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze image" }), { status: 500 });
  }
}
