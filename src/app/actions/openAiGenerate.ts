"use server";
import OpenAI from "openai";
import { IPrompt } from "../data/data";
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type OpenAIResponse = { type: "success"; b64Json: string } | { type: "error"; error: string };

export async function openAiGenerate(userOriginalPrompt: string, prompt: IPrompt): Promise<OpenAIResponse> {
  try {
    const response = await ai.images.generate({
      model: "gpt-image-1",
      prompt: prompt.Prompt + " " + userOriginalPrompt,
      n: 1,
      background: "transparent",
      size: "1024x1024",
      quality: "low",
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No image data returned from OpenAI.");
    }

    if (response.data[0].b64_json === undefined) {
      throw new Error("No image data returned from OpenAI.");
    }

    return {
      type: "success",
      b64Json: response.data[0].b64_json,
    };
  } catch (error: any) {
    console.error("Error generating image:", error);
    return {
      type: "error",
      error: "Image generation failed",
    };
  }
}
