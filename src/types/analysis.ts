export interface AnalysisRequest {
  query: string; // URL or company name
}

export interface CompetitiveAnalysis {
  overview: string;
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  recommendations: string[];
}

export interface AnalysisResponse {
  success: boolean;
  data?: CompetitiveAnalysis;
  markdown?: string; // Raw markdown for export
  error?: string;
}
