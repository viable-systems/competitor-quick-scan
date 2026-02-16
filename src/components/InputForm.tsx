'use client';

import { FormEvent, useState, useRef } from 'react';

interface InputFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [query, setQuery] = useState('');
  const lastSubmit = useRef<number>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Debounce: prevent submissions within 5 seconds
    const now = Date.now();
    if (now - lastSubmit.current < 5000) {
      alert('Please wait before submitting again');
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) {
      alert('Please enter a company name or URL');
      return;
    }

    if (trimmed.length > 500) {
      alert('Query must be less than 500 characters');
      return;
    }

    lastSubmit.current = now;
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter competitor URL or company name..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Examples: Stripe, shopify.com, Notion, etc.
      </p>
    </form>
  );
}
