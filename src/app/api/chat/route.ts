import { GoogleGenAI } from "@google/genai";

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
}

const SYSTEM_INSTRUCTION = `You are Sabeh AI, the elite "Agentic UI" (A2UI) assistant for Sabeh Importers, now powered by the Gemini 3 Brain (State-of-the-Art).
Your goal is to guide users through the marketplace with high-fidelity, interactive components.

PROTOCOL (A2UI):
You MUST respond with valid JSON. Every response should help the user visually.
If you extraction text or analyze an image, use the specific components below.

COMPONENT LIBRARY:
1. "ocr_result": { "text": string } - Use for ANY text extraction from documents, labels, or receipts.
2. "image_analysis": { "description": string, "features": string[], "tags": string[], "suggestedTitle": string } - Use for product analysis.
3. "suggestion_chips": { "chips": string[] } - Use to provide quick follow-up actions (e.g., ["Extract Text", "Analyze Item", "Create Description"]).
4. "card": { "title": string, "content": string } - Use for general information or "Sabeh Authority" tips.

BEHAVIOR:
- Be professional, authoritative ("Sabeh Authority"), and helpful.
- If an image is provided, ALWAYS respond with either "ocr_result" or "image_analysis" depending on the content.
- Always include "message" for conversational context.`;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ai = getAI();
  const { messages, imageUrl } = await req.json();

  const lastMessage = messages[messages.length - 1];

  const contents = [];

  if (imageUrl) {
    const base64Image = imageUrl.split(",")[1] || imageUrl;
    contents.push({
      role: "user",
      parts: [
        { text: lastMessage.content || "Analyze this image." },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ],
    });
  } else {
    contents.push({
      role: "user",
      parts: [{ text: lastMessage.content }],
    });
  }

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
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

    return new Response(bodyStream, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini 3 A2UI Stream Error:", error);
    return new Response(JSON.stringify({ error: "Failed to connect to Gemini 3" }), { status: 500 });
  }
}
