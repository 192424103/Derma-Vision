import { GoogleGenAI, Type } from "@google/genai";
import { SkinAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeSkinImage(base64Image: string): Promise<SkinAnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `You are a professional dermatology AI assistant. Analyze this facial skin image and provide a detailed report in JSON format.
  Be professional and encouraging. If the image is not a face or very poor quality, return a realistic error message in the 'message' field and low confidence.
  
  Detect the following:
  - Acne levels
  - Pigmentation/Dark spots
  - Dryness vs Oiliness
  - Redness/Irritation
  - Potential nutrient deficiency indicators (e.g. skin dullness, dark circles)
  
  Provide:
  1. A health score (0-100)
  2. Detailed detection levels (0-100)
  3. Personalized morning and night routines
  4. Specifically recommended ingredients (e.g. Niacinamide, Salicylic Acid, Vitamin C)
  5. Diet recommendations (foods to eat and avoid)
  6. Hydration and sleep goals.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      condition: { type: Type.STRING, description: "Overall skin condition summary" },
      confidence: { type: Type.NUMBER, description: "AI confidence level 0.0 to 1.0" },
      message: { type: Type.STRING, description: "A friendly message explaining the results" },
      healthScore: { type: Type.NUMBER },
      detections: {
        type: Type.OBJECT,
        properties: {
          acne: { type: Type.NUMBER },
          pigmentation: { type: Type.NUMBER },
          dryness: { type: Type.NUMBER },
          oiliness: { type: Type.NUMBER },
          redness: { type: Type.NUMBER },
          deficiency: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["acne", "pigmentation", "dryness", "oiliness", "redness", "deficiency"]
      },
      recommendations: {
        type: Type.OBJECT,
        properties: {
          morning: { type: Type.ARRAY, items: { type: Type.STRING } },
          night: { type: Type.ARRAY, items: { type: Type.STRING } },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          diet: {
            type: Type.OBJECT,
            properties: {
              consume: { type: Type.ARRAY, items: { type: Type.STRING } },
              avoid: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["consume", "avoid"]
          },
          hydration: { type: Type.STRING },
          sleep: { type: Type.STRING }
        },
        required: ["morning", "night", "ingredients", "diet", "hydration", "sleep"]
      }
    },
    required: ["condition", "confidence", "message", "healthScore", "detections", "recommendations"]
  };

  try {
    const result = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema
      }
    });

    return JSON.parse(result.text || '{}') as SkinAnalysisResult;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze skin image. Please try again with a clearer photo.");
  }
}
