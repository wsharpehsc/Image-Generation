"use server";
import { Chat, GoogleGenAI, Modality } from "@google/genai";
import { geminiResponse, PromptWrapperType } from "../types/type";
import { IPrompt } from "../data/data";

export async function generateImage(
  userOriginalPrompt: string,
  prompt: IPrompt,
  wrapper: string
): Promise<geminiResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const chat = ai.chats.create({
    model: "gemini-2.0-flash-preview-image-generation",
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  try {
    let wrappedPrompt = userOriginalPrompt;

    // Check if wrapper exists in prompt.skus
    if (prompt.skus && prompt.skus.length > 0) {
      const match = prompt.skus.find((sku) => sku.promptWrapper === wrapper);
      if (match) {
        wrappedPrompt = match.promptWrapper.replace("{{prompt}}", userOriginalPrompt);
      }
    }
    console.log(wrappedPrompt);
    const response = await  chat.sendMessage({ message: wrappedPrompt });
    let geminiThinking = "";

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.text) {
        geminiThinking = part.text;
        console.log(geminiThinking);
      } else if (part.inlineData) {
        return {
          error: "",
          image: part.inlineData.data,
          prompt: userOriginalPrompt,
          geminiText: geminiThinking,
        };
      }
    }

    return {
      error: "No image was returned by Gemini",
      image: undefined,
      prompt: userOriginalPrompt,
      geminiText: geminiThinking,
    };
  } catch (error: any) {
    console.error("Error generating image:", error);
    return {
      error: "Error",
      image: undefined,
      prompt: userOriginalPrompt,
      geminiText: "",
    };
  }
}
