"use server";
import { GoogleGenAI, Modality } from "@google/genai";
import { geminiResponse, PromptWrapperType } from "../types/type";

export async function generateImage(userOriginalPrompt: string, wrapperType: PromptWrapperType = PromptWrapperType.NONE): Promise<geminiResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  // Construct the final prompt using the wrapper (assuming getWrappedPrompt is defined elsewhere)
  const finalPrompt = getWrappedPrompt(userOriginalPrompt, wrapperType);

  try {
    var response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: finalPrompt,
      config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
    });

    for (const part of response.candidates![0].content!.parts!) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        return { error: "", image: imageData, prompt: finalPrompt };
      }
    }

    return { error: "", image: "", prompt: finalPrompt };
  } catch (error: any) {
    console.error("Error generating image:", error);
    return { error: "Error", image: undefined, prompt: finalPrompt };
  }
}

function getWrappedPrompt(userPrompt: string, wrapperType: PromptWrapperType): string {
  switch (wrapperType) {
    case PromptWrapperType.ARTISTIC_WATERCOLOR:
      return `A beautiful watercolor painting of: ${userPrompt}`;
    case PromptWrapperType.PHOTOREALISTIC_DETAIL:
      return `A highly detailed, photorealistic image capturing: ${userPrompt}`;
    case PromptWrapperType.POLICY_SFW_INCLUSIVE:
      return `Generate a safe-for-work, inclusive, and positive image depicting: ${userPrompt}. Ensure the image is suitable for all audiences and avoids any controversial, negative, or explicit content.`;
    case PromptWrapperType.NONE:
    default:
      return userPrompt;
  }
}
