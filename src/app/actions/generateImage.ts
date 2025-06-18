"use server";
import { Chat, GoogleGenAI, Modality } from "@google/genai";
import { geminiResponse, PromptWrapperType } from "../types/type";
import { IPrompt } from "../data/data";
let chatInstance: Chat | undefined = undefined;

export async function generateImage(userOriginalPrompt: string, prompt: IPrompt, wrapper:string): Promise<geminiResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  //console.log(prompt);
  //console.log(wrapper);
  try {
    if (!chatInstance) {
      chatInstance = ai.chats.create({
        model: "gemini-2.0-flash-preview-image-generation",
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });
      if(prompt.skus && prompt.skus.length > 0){
        for ( const sku of prompt.skus ){
          if(sku.promptWrapper === wrapper){
           let wrappedPrompt = sku.promptWrapper.replace("{{prompt}}",userOriginalPrompt);
           console.log(wrappedPrompt);
           await chatInstance.sendMessage({ message: wrappedPrompt });
          }
        

        //console.log(wrappedPrompt);
        //await chatInstance.sendMessage({ message: wrappedPrompt });
      }
      }
       
    }
    
    const response = await chatInstance.sendMessage({ message: userOriginalPrompt });
    let geminiThinking :string = "";
    for (const part of response.candidates![0].content!.parts!) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
        geminiThinking=part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;

        return { error: "", image: imageData, prompt: userOriginalPrompt,geminiText:geminiThinking };
      }
    }

    return { error: "", image: "", prompt: userOriginalPrompt,geminiText:"" };
  } catch (error: any) {
    console.error("Error generating image:", error);
    return { error: "Error", image: undefined, prompt: userOriginalPrompt,geminiText:"" };
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
