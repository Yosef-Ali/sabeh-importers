import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
}

export async function POST(req: Request) {
  const ai = getAI();
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    // Find the image part in the response
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return new Response(JSON.stringify({ error: "No response from model" }), { status: 500 });
    }

    const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));
    if (!imagePart?.inlineData) {
      return new Response(JSON.stringify({ error: "No image generated" }), { status: 500 });
    }

    return new Response(
      JSON.stringify({
        image: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate image" }), { status: 500 });
  }
}
