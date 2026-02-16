import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL_NAME = "gemini-3-pro-image-preview";

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
}

export async function POST(req: Request) {
  const ai = getAI();
  const { prompt, referenceImage, referenceImageMimeType, aspectRatio } =
    await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Missing prompt" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Translate non-English prompts to English for better image generation results
  let imagePrompt = prompt;
  const hasNonLatin = /[^\u0000-\u007F]/.test(prompt);
  if (hasNonLatin) {
    try {
      const translateResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Translate the following image generation prompt to English. Only return the translated prompt, nothing else:\n\n${prompt}`,
              },
            ],
          },
        ],
      });
      const translated =
        translateResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (translated) {
        imagePrompt = translated;
      }
    } catch (e) {
      // If translation fails, use original prompt
      console.warn("Prompt translation failed, using original:", e);
    }
  }

  // Build parts: text prompt + optional reference image
  const parts: any[] = [{ text: imagePrompt }];
  if (referenceImage) {
    parts.push({
      inlineData: {
        mimeType: referenceImageMimeType || "image/jpeg",
        data: referenceImage,
      },
    });
  }

  // Build config
  const config: Record<string, any> = {
    responseModalities: ["TEXT", "IMAGE"],
  };

  // Note: gemini-3-pro-image-preview handles aspect ratio, but imageSize (1K/2K) can cause hangs/issues.
  // We ignore imageSize for now to ensure stability.
  if (aspectRatio) {
    config.imageConfig = {
      aspectRatio,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts }],
      config,
    });

    const parts_out = response.candidates?.[0]?.content?.parts;
    if (parts_out) {
      for (const part of parts_out) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          return new Response(
            JSON.stringify({
              image: `data:${mimeType};base64,${part.inlineData.data}`,
            }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      }
      // Log what we got if no image
      const textParts = parts_out.map((p: any) => p.text).filter(Boolean);
      console.log("Model returned text instead of image:", textParts);
    }

    return new Response(
      JSON.stringify({ error: "No image generated. Try a different prompt." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Image generation error:", error?.message || error);
    return new Response(
      JSON.stringify({ error: error?.message || "Failed to generate image" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
