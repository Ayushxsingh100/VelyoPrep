/**
 * AI Service Contract & Stub Implementation (Gemini AI Integration Contract)
 */

export interface IAiService {
  generateText(prompt: string): Promise<string>;
  analyzeResume(resumeText: string): Promise<Record<string, unknown>>;
}

export class StubAiService implements IAiService {
  async generateText(_prompt: string): Promise<string> {
    return "Gemini AI response stub. Ready for Phase 3.2 backend integration.";
  }

  async analyzeResume(_resumeText: string): Promise<Record<string, unknown>> {
    return {
      score: 85,
      recommendations: ["Add system design achievements", "Highlight metric impacts"],
    };
  }
}
