"use server";
import { GoogleGenAI, Modality } from "@google/genai";

import { geminiResponse } from "../types/type";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function editImage(userEditPrompt:string,base64Image:string |undefined):Promise<geminiResponse> {
  try {
   if (!base64Image) {
  return {
    prompt: userEditPrompt,
    image: undefined,
    loading: false,
    error: "No image data provided",
    geminiText:""
  };
  

}
    const contents = [
      { text: userEditPrompt },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
    ];

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

  
    const candidates = result?.candidates;
    if (!candidates || candidates.length === 0 || !candidates[0].content?.parts) {
      return {
        prompt:userEditPrompt,
        image:undefined,
        loading:false,
        error:result?.promptFeedback?.blockReason || "No results from Gemini",
        geminiText:""
      };
    }

    let editedImage: string | null = null;
    let geminiThinking: string = "";

    for (const part of candidates[0].content.parts) {
      if(part.text){
        console.log(part.text);
        geminiThinking = part.text;
      }
      if (part.inlineData?.data) {
        editedImage = part.inlineData.data;
        break;
      }
    }

    if (!editedImage) {
     return {
        prompt:userEditPrompt,
        image:undefined,
        loading:false,
        error:"No image returned from model",
        geminiText:""
      };
    }

    return {
        prompt:userEditPrompt,
        image:editedImage,
        loading:false,
        error:"",
        geminiText:geminiThinking
    };
  } catch (error) {
    console.error("Edit image error:", error);
    return {
        prompt:userEditPrompt,
        image:undefined,
        loading:false,
        error:"Failed to edit image",
        geminiText:""
      };
  }
}
