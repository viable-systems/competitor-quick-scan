'use client';

import type { CompetitiveAnalysis } from '@/types/analysis';

interface AnalysisCardProps {
  query: string;
  analysis: CompetitiveAnalysis;
  onCopy: () => void;
  onDownload: () => void;
}

export function AnalysisCard({ query, analysis, onCopy, onDownload }: AnalysisCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          Analysis: {query}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Overview */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Overview</h3>
          <p className="text-gray-700 leading-relaxed">{analysis.overview}</p>
        </section>

        {/* Strengths */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Strengths</h3>
          <ul className="list-disc list-inside space-y-1">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700">{strength}</li>
            ))}
          </ul>
        </section>

        {/* Weaknesses */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Weaknesses</h3>
          <ul className="list-disc list-inside space-y-1">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="text-gray-700">{weakness}</li>
            ))}
          </ul>
        </section>

        {/* Market Position */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Position</h3>
          <p className="text-gray-700 leading-relaxed">{analysis.marketPosition}</p>
        </section>

        {/* Recommendations */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="text-gray-700">{recommendation}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
