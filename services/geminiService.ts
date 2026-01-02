
import { GoogleGenAI } from "@google/genai";
import { MODEL_SHOT_PROMPT } from "../constants";

export const generateModelFit = async (
  base64Image: string,
  config: { 
    modelType: string, 
    modelRace: string,
    pose: string, 
    background: string, 
    aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" 
  }
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const match = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image format. Please upload a valid image file.");
  }
  const mimeType = match[1];
  const data = match[2];

  const prompt = MODEL_SHOT_PROMPT({
    modelType: config.modelType,
    modelRace: config.modelRace,
    pose: config.pose,
    background: config.background
  });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts || parts.length === 0) {
      const fallbackText = response.text;
      throw new Error(fallbackText || "No content returned from AI. The image might have been flagged by safety filters.");
    }

    const imagePart = parts.find(p => p.inlineData);
    if (imagePart && imagePart.inlineData) {
      const b64 = imagePart.inlineData.data;
      if (!b64 || b64.length < 100) {
        throw new Error("Received empty or corrupt image data from AI.");
      }
      return `data:image/png;base64,${b64}`;
    }

    const textPart = parts.find(p => p.text);
    if (textPart && textPart.text) {
      throw new Error(`AI returned feedback instead of an image: ${textPart.text}`);
    }

    throw new Error("The AI model finished processing but didn't provide an image result.");
  } catch (error: any) {
    console.error("Critical Generation Error:", error);
    
    const errorString = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
    
    if (
      errorString.includes("Requested entity was not found") || 
      errorString.includes("API_KEY_INVALID") ||
      errorString.includes("403")
    ) {
      throw new Error("PERMISSION_ISSUE");
    }
    
    throw new Error(errorString || "Model generation failed.");
  }
};
