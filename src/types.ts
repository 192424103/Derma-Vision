export interface SkinAnalysisResult {
  condition: string;
  confidence: number;
  detections: {
    acne: number;
    pigmentation: number;
    dryness: number;
    oiliness: number;
    redness: number;
    deficiency: string[];
  };
  recommendations: {
    morning: string[];
    night: string[];
    ingredients: string[];
    diet: {
      consume: string[];
      avoid: string[];
    };
    hydration: string;
    sleep: string;
  };
  healthScore: number;
  message: string;
}

export type AnalysisStatus = 'idle' | 'uploading' | 'scanning' | 'complete' | 'error';
