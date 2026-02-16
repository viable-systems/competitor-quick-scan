import { NextRequest, NextResponse } from 'next/server';
import { analyzeCompetitor } from '@/lib/anthropic';
import type { AnalysisRequest, AnalysisResponse } from '@/types/analysis';

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { query } = body;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json<AnalysisResponse>(
        { success: false, error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (query.trim().length > 500) {
      return NextResponse.json<AnalysisResponse>(
        { success: false, error: 'Query must be less than 500 characters' },
        { status: 400 }
      );
    }

    // Call Anthropic API
    const { analysis, markdown } = await analyzeCompetitor(query.trim());

    return NextResponse.json<AnalysisResponse>({
      success: true,
      data: analysis,
      markdown,
    });
  } catch (error) {
    console.error('Analysis error:', error);

    // Handle specific Anthropic API errors
    if (error instanceof Error) {
      if (error.message.includes('ANTHROPIC_API_KEY')) {
        return NextResponse.json<AnalysisResponse>(
          { success: false, error: 'API configuration error' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json<AnalysisResponse>(
      { success: false, error: 'Failed to analyze competitor. Please try again.' },
      { status: 500 }
    );
  }
}
