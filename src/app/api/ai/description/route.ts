import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
}

export async function POST(req: Request) {
  const ai = getAI();
  const { title, category, condition, price, currency } = await req.json();

  if (!title) {
    return new Response("Missing title", { status: 400 });
  }

  const conditionLabels: Record<string, string> = {
    NEW: "New",
    LIKE_NEW: "Like New",
    USED_GOOD: "Used (Good condition)",
    USED_FAIR: "Used (Fair condition)",
    FOR_PARTS: "For Parts",
  };

  const prompt = `Write a compelling marketplace listing description for the following item. Keep it concise (2-3 paragraphs), highlight key selling points, and make it appealing to buyers. Do not use markdown formatting.

Title: ${title}
${category ? `Category: ${category}` : ""}
${condition ? `Condition: ${conditionLabels[condition] || condition}` : ""}
${price ? `Price: ${currency || "ETB"} ${price}` : ""}

By prioritizing Amharic-speaking buyers as well, ensure the tone reflects "Sabeh Authority" (professional, trustworthy, authoritative).

Write the description directly without any preamble.`;

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-pro-preview", // Use Pro for creative writing
      contents: [{ role: "user", parts: [{ text: prompt }] }],
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
    console.error("Gemini 3 Description Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate description" }), { status: 500 });
  }
}
