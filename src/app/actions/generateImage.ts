"use server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function generateImage(prompt: string): Promise<geminiResponse> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    },
  });
  try {
    const result = await model.generateContent(prompt);
    const parts = result.response.candidates[0].content.parts;

    for (const part of parts) {
      if (part.inlineData) {
        return { image: part.inlineData.data, prompt: prompt, Error: "" };
      }
    }

    return {
      image: "",
      prompt: prompt,
      Error: "Error. Response was empty",
    };
  } catch (error) {
    return {
      image: "",
      prompt: prompt,
      Error: `Error. ${error}`,
    };
  }
}

export interface geminiResponse {
  image: string;
  prompt: string;
  Error: string;
}
