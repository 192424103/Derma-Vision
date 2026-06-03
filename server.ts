import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Initialize Gemini SDK with User-Agent set for telemetry as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Make sure payload sizes are high enough to accept scaled base64 image data
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // API endpoints go here FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/analyze-skin", async (req, res) => {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image data is required" });
    }

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

    try {
      // Process the base64 input correctly
      let base64Data = image;
      if (image.includes(",")) {
        base64Data = image.split(",")[1];
      }

      // We use the recommended 'gemini-3.5-flash' model
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error) {
      console.error("Server-side AI Analysis Error:", error);
      res.status(500).json({ 
        error: "Failed to analyze skin image. Please try again with a clearer photo." 
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
