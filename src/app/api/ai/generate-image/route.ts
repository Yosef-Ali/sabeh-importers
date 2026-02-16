import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
}

export async function POST(req: Request) {
  const ai = getAI();
  const { prompt, referenceImage, referenceImageMimeType, aspectRatio, imageSize } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
  }

  // Build parts: text prompt + optional reference image
  const parts: any[] = [{ text: prompt }];
  if (referenceImage) {
    parts.push({
      inlineData: {
        mimeType: referenceImageMimeType || "image/jpeg",
        data: referenceImage,
      },
    });
  }

  // Build config
  const config: any = {
    responseModalities: ["TEXT", "IMAGE"],
  };
  if (aspectRatio || imageSize) {
    config.imageConfig = {};
    if (aspectRatio) config.imageConfig.aspectRatio = aspectRatio;
    if (imageSize) config.imageConfig.imageSize = imageSize;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      config,
    });

    // Log full response structure for debugging
    console.log("Gemini response candidates:", JSON.stringify(response.candidates?.length));
    const responseParts = response.candidates?.[0]?.content?.parts;
    if (!responseParts) {
      console.error("No parts in response. Full response:", JSON.stringify(response).slice(0, 500));
      return new Response(JSON.stringify({ error: "No response from model" }), { status: 500 });
    }

    console.log("Response parts count:", responseParts.length);
    console.log("Parts types:", responseParts.map((p: any) => p.text ? "text" : p.inlineData ? `image/${p.inlineData.mimeType}` : "unknown"));

    const imagePart = responseParts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));
    if (!imagePart?.inlineData) {
      // Return text response if available for debugging
      const textPart = responseParts.find((p: any) => p.text);
      console.error("No image in parts. Text response:", textPart?.text?.slice(0, 200));
      return new Response(JSON.stringify({ error: "No image generated. Model returned text only." }), { status: 500 });
    }

    return new Response(
      JSON.stringify({
        image: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error?.message || error);
    return new Response(JSON.stringify({ error: error?.message || "Failed to generate image" }), { status: 500 });
  }
}
