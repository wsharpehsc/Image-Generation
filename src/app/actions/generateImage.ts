"use server";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { geminiResponse, PromptWrapperType } from "../types/type";

const { GoogleGenerativeAI } = require("@google/generative-ai");
export async function generateImage(
  userOriginalPrompt: string,
  chatHistory: { role: string; content: string }[],
  wrapperType: PromptWrapperType = PromptWrapperType.POLICY_SFW_INCLUSIVE
): Promise<geminiResponse> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = createModel(genAI);

  // Construct the final prompt using the wrapper
  const finalPrompt = getWrappedPrompt(userOriginalPrompt, wrapperType);
  console.log("Final prompt being sent to API:", finalPrompt);

  try {
    const result = await model.generateContent([...chatHistory, finalPrompt]);
    const response = result.response;

    // Blocked By API
    if (response.promptFeedback?.blockReason) {
      console.warn(`Prompt blocked by API. Reason: ${response.promptFeedback.blockReason}, Final Prompt: "${finalPrompt}"`);
      return {
        image: "",
        prompt: userOriginalPrompt,
        loading: false,
        error: `Your request was blocked by safety filters. Reason: ${response.promptFeedback.blockReason}.`,
      };
    }

    const candidate = response.candidates?.[0];
    if (!candidate) {
      console.warn(`No candidate found for final prompt: "${finalPrompt}"`);
      return { image: "", prompt: userOriginalPrompt, loading: false, error: "No image could be generated." };
    }
    if (candidate.safetyRatings && candidate.safetyRatings.length > 0) {
      for (const rating of candidate.safetyRatings) {
        if (rating.probability !== "NEGLIGIBLE" && rating.probability !== "LOW") {
          console.warn(`Policy Violation: Content blocked. Category: ${rating.category}, Final Prompt: "${finalPrompt}"`);
          return {
            image: "",
            prompt: userOriginalPrompt,
            loading: false,
            error: `The generated image was blocked due to safety concerns (${rating.category}).`,
          };
        }
      }
    }

    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return { image: part.inlineData.data, prompt: userOriginalPrompt, loading: false, error: "" };
        }
      }
    }
    console.warn(`No inline image data for final prompt: "${finalPrompt}"`);
    return { image: "", prompt: userOriginalPrompt, loading: false, error: "No image data received." };
  } catch (error: any) {
    console.error("Error generating image with final prompt '" + finalPrompt + "':", error);
    if (error.message && error.message.includes("SAFETY")) {
      return { image: "", prompt: userOriginalPrompt, loading: false, error: "Generation failed due to safety restrictions." };
    }
    return { image: "", prompt: userOriginalPrompt, loading: false, error: "An unexpected error occurred." };
  }
}

const createModel = (genAI: any) => {
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Block if medium or high probability
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
    generationConfig: {
      responseModalities: ["Text", "Image"],
    },
  });
};

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
