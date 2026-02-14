import { create } from "zustand";

interface AiStore {
  extractedText: string | null;
  analysisResult: any | null;
  setExtractedText: (text: string | null) => void;
  setAnalysisResult: (result: any | null) => void;
  clear: () => void;
}

export const useAiStore = create<AiStore>((set) => ({
  extractedText: null,
  analysisResult: null,
  setExtractedText: (text) => set({ extractedText: text }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  clear: () => set({ extractedText: null, analysisResult: null }),
}));
