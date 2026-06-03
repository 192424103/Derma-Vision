import { SkinAnalysisResult } from "../types";

export async function analyzeSkinImage(base64Image: string): Promise<SkinAnalysisResult> {
  try {
    const response = await fetch("/api/analyze-skin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Server error during skin analysis.");
    }

    return await response.json();
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to analyze skin image. Please try again with a clearer photo.");
  }
}

