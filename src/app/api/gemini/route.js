import { GoogleGenAI, Modality } from "@google/genai";


const genAI = new GoogleGenAI({
  apiKey: process.env.API_KEY, // Use a secure env var name
});

export async function POST(req) {
  try {
    const body = await req.json();   // Grab information from front end. The prompt in this case
    const { prompt } = body;

    if (!prompt) {
      return Response.json(             // If the prompt is empty it throws an error
        { error: "Must input prompt" },
        { status: 400 }
      );
    }

    const result = await genAI.models.generateContent({         // Call the model with the prompt
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ text: prompt }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = result.candidates?.[0]?.content?.parts || [];     // Index into where the image and response data is
    let imageBase64 = null;

    for (const part of parts) {             // Loop through the data and just grab the image
      if (part.inlineData) {
        imageBase64 = part.inlineData.data;
      }
    }

    if (!imageBase64) {                     // If Gemini didn't return an image throw an error
      return Response.json(
        { error: "No image data returned" },
        { status: 404 }
      );
    }

    return Response.json({                  // Return image and prompt data 
      question: prompt,
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(                   // Final error
      { error: "Error generating content" },
      { status: 500 }
    );
  }
}
