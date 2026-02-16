import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { title, category, condition, price, currency, outputLength } = await req.json();

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

  const lengthGuide: Record<string, string> = {
    short: "Keep it very brief (1 short paragraph, ~50 words).",
    medium: "Keep it concise (2-3 paragraphs, ~150 words).",
    long: "Write a detailed description (4-5 paragraphs, ~300 words) covering all selling points.",
  };

  const prompt = `Write a compelling marketplace listing description for the following item. ${lengthGuide[outputLength] || lengthGuide.medium} Highlight key selling points and make it appealing to buyers. Do not use markdown formatting.

Title: ${title}
${category ? `Category: ${category}` : ""}
${condition ? `Condition: ${conditionLabels[condition] || condition}` : ""}
${price ? `Price: ${currency || "ETB"} ${price}` : ""}

By prioritizing Amharic-speaking buyers as well, ensure the tone reflects "Sabeh Authority" (professional, trustworthy, authoritative).

Write the description directly without any preamble.`;

  const result = streamText({
    model: google("gemini-2.0-flash"),
    prompt,
  });

  return result.toTextStreamResponse();
}
