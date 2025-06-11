import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";


const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });     // Create model instance

export async function POST(req) {                                   
  try {
    const body = await req.json();
    const { prompt, base64Image } = body;     // Grab image and prompt from the front end

    if (!prompt || !base64Image) {
      return NextResponse.json({ error: "Invalid prompt or image" }, { status: 400 });        // Return if there isn't a prompt or an image
    }

    const contents = [
      { text: prompt },                                 // Contents of the request to the model are going to include the prompt and the image
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
    ];

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: contents,                                             // Call the model with the image, and prompt
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let editedImage = null;
    for (const part of result.candidates[0].content.parts) {
      if (part.inlineData) {                                              // Get the edited image from the response
        editedImage = part.inlineData.data;
      }
    }

    if (!editedImage) {
      return NextResponse.json({ error: "No edited image" }, { status: 400 });
    }

    return NextResponse.json({
      image: `data:image/png;base64,${editedImage}`,
    });
  } catch (error) {
    console.error("Edit image error:", error);
    return NextResponse.json({ error: "Failed to edit image" }, { status: 500 });
  }
}
