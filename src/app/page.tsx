'use client';

import { useState } from 'react';
import { InputForm } from '@/components/InputForm';
import { AnalysisCard } from '@/components/AnalysisCard';
import { LoadingState } from '@/components/LoadingState';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import type { CompetitiveAnalysis } from '@/types/analysis';

type AnalysisState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  query: string;
  analysis?: CompetitiveAnalysis;
  markdown?: string;
  error?: string;
};

export default function Home() {
  const [state, setState] = useState<AnalysisState>({ status: 'idle', query: '' });

  const handleAnalyze = async (query: string) => {
    setState({ status: 'loading', query });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setState({
        status: 'success',
        query,
        analysis: data.data,
        markdown: data.markdown,
      });
    } catch (error) {
      setState({
        status: 'error',
        query,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

  const handleCopy = async () => {
    if (!state.markdown) return;

    try {
      await navigator.clipboard.writeText(state.markdown);
      alert('Analysis copied to clipboard!');
    } catch (error) {
      alert('Failed to copy. Please try again.');
    }
  };

  const handleDownload = () => {
    if (!state.markdown || !state.query) return;

    try {
      const blob = new Blob([state.markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `competitor-analysis-${state.query.replace(/[^a-z0-9]/gi, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Competitor Quick Scan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze any competitor in seconds using AI. Enter a URL or company name to get a comprehensive competitive analysis.
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-8">
          <InputForm onSubmit={handleAnalyze} isLoading={state.status === 'loading'} />
        </div>

        {/* Results Area */}
        {state.status === 'loading' && <LoadingState />}

        {state.status === 'error' && (
          <ErrorDisplay
            message={state.error || 'Unknown error'}
            onRetry={() => handleAnalyze(state.query)}
          />
        )}

        {state.status === 'success' && state.analysis && (
          <AnalysisCard
            query={state.query}
            analysis={state.analysis}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
        )}
      </div>
    </main>
  );
}
