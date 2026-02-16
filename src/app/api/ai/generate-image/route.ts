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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          ...(aspectRatio && { aspectRatio }),
          ...(imageSize && { imageSize }),
        },
      },
    });

    // Find the image part in the response
    const responseParts = response.candidates?.[0]?.content?.parts;
    if (!responseParts) {
      return new Response(JSON.stringify({ error: "No response from model" }), { status: 500 });
    }

    const imagePart = responseParts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));
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
