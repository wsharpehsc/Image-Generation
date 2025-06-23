"use server";
import OpenAI from "openai";
import { IPrompt } from "../data/data";
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type OpenAIResponse = { type: "success"; b64Json: string } | { type: "error"; error: string };

export async function openAiGenerate(userOriginalPrompt: string, prompt: IPrompt, wrapper:string): Promise<OpenAIResponse> {
  try{
    let wrappedPrompt = userOriginalPrompt;
    if (prompt.skus && prompt.skus.length > 0 ){
      const sku = prompt.skus?.find((sku) => sku.promptWrapper === wrapper);
      if(sku){
        wrappedPrompt = sku.promptWrapper.replace("{{prompt}}", userOriginalPrompt);
      }
    }
    console.log(wrappedPrompt);
    const response = await ai.images.generate({
      model:"gpt-image-1",
      prompt : wrappedPrompt
    });
    if(!response){
      throw new Error("No response data returned");
    }
    if(!response.data){
      throw new Error("No image data returned");
    }
    if(response.data && response.data[0].b64_json){
      const b64Image = response.data[0].b64_json
      return{
        type:"success",
        b64Json:b64Image
      };
    }
    return{
      type:"error",
      error:"No image returned by Gemini"
    };
   

  }
  catch(error){
    return{
      type:"error",
      error:"Failed to generate image"
    }
  }
}