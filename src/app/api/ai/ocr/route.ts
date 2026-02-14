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
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: AI_PROMPTS.AMHARIC_OCR },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const bodyStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(bodyStream);
  } catch (error) {
    console.error("Gemini 3 OCR Error:", error);
    return new Response(JSON.stringify({ error: "Failed to extract text from image" }), { status: 500 });
  }
}
