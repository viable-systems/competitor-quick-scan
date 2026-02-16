# Build Competitor Quick Scan Implementation Plan

## Implementation Plan Title

Competitor Quick Scan: AI-Powered Competitive Analysis Tool

## Overview

Building a production-ready web tool that enables founders to quickly analyze competitors by entering a URL or company name. The tool uses Anthropic's Claude API to generate structured competitive analysis reports with copy-to-clipboard and download functionality.

This is a greenfield project requiring complete implementation from scratch, following the Input → Transform → Output architecture pattern.

## Current State

**Existing Infrastructure:**
- Next.js 15.4.0 with React 19.1.0 boilerplate (package.json:10-14)
- TypeScript strict mode configured (tsconfig.json:11)
- Tailwind CSS basic setup (tailwind.config.ts:3-6, src/app/globals.css:1-3)
- Root layout with proper metadata (src/app/layout.tsx:4-6)
- Path alias @/* configured for clean imports (tsconfig.json:25-27)

**Missing Components:**
- No API routes exist (src/app/api/ directory completely empty per glob search)
- No UI components (src/components/ directory empty per glob search)
- No utility libraries (src/lib/ directory empty per glob search)
- No TypeScript types defined
- Placeholder homepage only (src/app/page.tsx:1-3)

**Dependencies:**
- Missing @anthropic-ai/sdk package for AI integration
- No UI icon library for copy/download buttons
- No form validation or toast notification libraries

**Key Constraints:**
- Must use process.env.ANTHROPIC_API_KEY for AI features
- .env.local is gitignored (.gitignore:3), must create example file
- Build must pass with zero errors: `npm run build`
- Strict TypeScript compliance required

## Desired End State

A fully functional web tool where users can:

1. **Input**: Enter competitor URL or company name in a clean form interface
2. **Transform**: System calls Anthropic Claude API via Next.js API route to generate analysis
3. **Output**: Display structured competitive analysis with:
   - Company overview
   - Key strengths (3-5 bullet points)
   - Key weaknesses (3-5 bullet points)
   - Market position assessment
   - Actionable recommendations (3-5 items)
4. **Export**: Copy analysis to clipboard or download as markdown file

**Verification Checklist:**
- [ ] Form accepts both URLs and company names with validation
- [ ] API route processes requests and calls Anthropic API
- [ ] Results display dynamically based on user input (no hardcoded data)
- [ ] Copy-to-clipboard button works (navigator.clipboard API)
- [ ] Download-as-markdown button works (Blob API)
- [ ] Loading states displayed during API calls
- [ ] Error handling with user-friendly messages
- [ ] `npm run build` succeeds with zero errors
- [ ] Responsive design works on mobile and desktop

### Key Discoveries:

- **API Route Pattern**: Next.js 15 App Router uses `src/app/api/[route]/route.ts` with named HTTP method exports (Next.js 15 pattern)
- **Environment Variable Security**: ANTHROPIC_API_KEY must be in .env.local (gitignored), need .env.local.example for documentation
- **TypeScript Path Alias**: @/* maps to ./src/* (tsconfig.json:25-27), use for clean imports like @/components/AnalysisCard
- **No Existing Patterns**: Greenfield project—can establish clean patterns without legacy constraints
- **Build Requirement**: Zero-error build is non-negotiable (product spec requirement)

## What We're NOT Doing

**Explicitly Out of Scope:**
- Static dashboards with fake metrics or placeholder data
- Technology catalogs with hardcoded competitor entries
- Comparison grids with pre-filled data
- Landing pages or marketing content beyond the tool itself
- User authentication or accounts
- Database or persistent storage
- Caching or rate limiting beyond basic client-side debouncing
- Usage analytics or tracking
- Advanced features like multi-competitor comparison or historical analysis
- Dark mode (not in requirements, defer for simplicity)
- Internationalization or localization

**Anti-Patterns to Avoid:**
- Creating 5+ item data arrays displayed in grids (violates "no catalog" rule)
- Hardcoded competitor data (all output must be AI-generated)
- Coming soon or placeholder pages (tool must be fully functional)

## Implementation Approach

**High-Level Strategy:**

Build incrementally following the Input → Transform → Output pattern, starting with API foundation and ending with UI polish. Each phase is independently testable and can be rolled back if needed.

**Phase Ordering Rationale:**

1. **Foundation First**: Install dependencies and create TypeScript types before implementation—prevents circular dependencies
2. **API Layer Before UI**: Build and test API route independently—ensures backend works before investing in frontend
3. **Component-Based UI**: Build isolated UI components before page integration—enables unit testing and reusability
4. **Integration Last**: Connect components on main page after all parts work individually—reduces debugging complexity

**Technical Decisions:**

| Decision | Rationale |
|----------|-----------|
| Use @anthropic-ai/sdk package | Official SDK, better error handling than raw fetch, automatic retries |
| Return JSON + markdown from API | JSON for structured display, markdown for export—best of both worlds |
| Use claude-3-5-sonnet-20241022 | Balance of speed, quality, and cost (faster/cheaper than opus) |
| Client-side debounce (5s) | Prevents duplicate submissions without server complexity |
| Copy button uses navigator.clipboard | Modern browser API, no dependencies needed |
| Download uses Blob + URL.createObjectURL | Standard approach, cross-browser compatible |
| Tailwind-only styling | Already configured, no extra dependencies needed |
| No form validation library | Simple validation doesn't justify extra dependency |
| Error messages user-friendly | Hide technical details, log server-side for debugging |

**Rollback Strategy:**

Each phase can be independently reverted:
- Phase 1: Revert package.json changes, delete .env.local.example
- Phase 2: Delete src/app/api/analyze/route.ts and src/lib/anthropic.ts
- Phase 3: Delete src/types/analysis.ts
- Phase 4: Delete src/components/ files
- Phase 5: Revert src/app/page.tsx to original placeholder

---

## Phases

### Phase 1: Foundation & Dependencies

#### Overview

Install required npm packages, create environment variable documentation, and establish TypeScript type definitions. This foundation enables all subsequent phases.

#### Changes Required:

##### 1. Install Dependencies

**File**: `package.json`
**Changes**: Add @anthropic-ai/sdk for Claude API access

```json
"dependencies": {
  "next": "^15.4.0",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "@anthropic-ai/sdk": "^0.32.0"
}
```

Install command: `npm install @anthropic-ai/sdk`

##### 2. Environment Variable Documentation

**File**: `.env.local.example` (NEW)
**Changes**: Create example file documenting required API key

```bash
# Anthropic API Key for Claude AI integration
# Get your key at: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_api_key_here
```

##### 3. TypeScript Type Definitions

**File**: `src/types/analysis.ts` (NEW)
**Changes**: Define request/response types for API and UI

```typescript
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
```

#### Success Criteria:

##### Automated Verification:

- [ ] Package installation succeeds: `npm install` completes without errors
- [ ] TypeScript compiles: `npx tsc --noEmit` passes with new types
- [ ] Environment file exists: `.env.local.example` file created

##### Manual Verification:

- [ ] Review package.json to confirm @anthropic-ai/sdk added
- [ ] Review .env.local.example for clear instructions
- [ ] Confirm types are logically consistent and cover all use cases

**Note**: Complete automated verification, then pause for manual confirmation before proceeding to Phase 2.

---

### Phase 2: API Layer Implementation

#### Overview

Create the API route that accepts competitor queries, calls Anthropic's Claude API, and returns structured competitive analysis. Includes Anthropic client wrapper and prompt engineering.

#### Changes Required:

##### 1. Anthropic Client Utility

**File**: `src/lib/anthropic.ts` (NEW)
**Changes**: Initialize Anthropic client and create analysis function

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeCompetitor(query: string) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const prompt = `You are a competitive analysis expert. Analyze the following competitor: "${query}"

Provide a comprehensive analysis with these sections:

## Company Overview
Brief description of what the company does, their target market, and business model.

## Key Strengths
3-5 bullet points highlighting their competitive advantages, unique features, or market position.

## Key Weaknesses
3-5 bullet points identifying potential vulnerabilities, limitations, or areas where they fall short.

## Market Position
Assessment of their standing in the market, including target audience, pricing strategy, and competitive differentiation.

## Recommendations
3-5 actionable recommendations for competing against this company, including specific strategies or features to consider.

Format your response as valid JSON matching this structure:
{
  "overview": "string",
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "marketPosition": "string",
  "recommendations": ["string", "string", "string"]
}

Return ONLY the JSON object, no additional text.`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic API');
  }

  // Extract JSON from response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from response');
  }

  const analysis = JSON.parse(jsonMatch[0]);
  return {
    analysis,
    markdown: generateMarkdownReport(query, analysis),
  };
}

function generateMarkdownReport(query: string, analysis: any): string {
  return `# Competitive Analysis: ${query}

## Company Overview
${analysis.overview}

## Key Strengths
${analysis.strengths.map((s: string) => `- ${s}`).join('\n')}

## Key Weaknesses
${analysis.weaknesses.map((w: string) => `- ${w}`).join('\n')}

## Market Position
${analysis.marketPosition}

## Recommendations
${analysis.recommendations.map((r: string) => `- ${r}`).join('\n')}

---
*Generated by Competitor Quick Scan*`;
}
```

##### 2. API Route Handler

**File**: `src/app/api/analyze/route.ts` (NEW)
**Changes**: Create POST endpoint for competitor analysis

```typescript
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
```

#### Success Criteria:

##### Automated Verification:

- [ ] TypeScript compiles: `npx tsc --noEmit` passes with API route types
- [ ] No import errors: All @/* imports resolve correctly
- [ ] Build succeeds: `npm run build` completes without errors

##### Manual Verification:

- [ ] Test API route directly: `curl -X POST http://localhost:3000/api/analyze -H "Content-Type: application/json" -d '{"query":"Stripe"}'` (after setting ANTHROPIC_API_KEY in .env.local)
- [ ] Verify response includes success, data, and markdown fields
- [ ] Verify error handling with missing API key returns user-friendly message
- [ ] Verify input validation rejects empty or overly long queries

**Note**: Complete automated verification, then pause for manual confirmation before proceeding to Phase 3.

---

### Phase 3: UI Components

#### Overview

Build React components for the user interface: input form for competitor queries, analysis card for displaying results, and supporting UI elements. All components use Tailwind CSS for styling.

#### Changes Required:

##### 1. Input Form Component

**File**: `src/components/InputForm.tsx` (NEW)
**Changes**: Create form component with validation and loading state

```typescript
'use client';

import { FormEvent, useState, useRef } from 'react';

interface InputFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [query, setQuery] = useState('');
  const [lastSubmit, setLastSubmit] = useRef<number>(0);

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

    setLastSubmit.current(now);
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
```

##### 2. Analysis Card Component

**File**: `src/components/AnalysisCard.tsx` (NEW)
**Changes**: Create component to display analysis results with export buttons

```typescript
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
```

##### 3. Loading State Component

**File**: `src/components/LoadingState.tsx` (NEW)
**Changes**: Create loading spinner component

```typescript
export function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Analyzing competitor... This may take a moment.</p>
    </div>
  );
}
```

##### 4. Error Display Component

**File**: `src/components/ErrorDisplay.tsx` (NEW)
**Changes**: Create error message component

```typescript
interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Failed</h3>
      <p className="text-red-700 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
```

#### Success Criteria:

##### Automated Verification:

- [ ] TypeScript compiles: `npx tsc --noEmit` passes with all components
- [ ] No import errors: All components import correctly
- [ ] Build succeeds: `npm run build` completes without errors

##### Manual Verification:

- [ ] Review InputForm for proper form handling and validation
- [ ] Review AnalysisCard for correct props and display logic
- [ ] Review LoadingState and ErrorDisplay for simplicity and clarity
- [ ] Verify all components use Tailwind classes correctly

**Note**: Complete automated verification, then pause for manual confirmation before proceeding to Phase 4.

---

### Phase 4: Page Integration

#### Overview

Integrate all components on the main page, implement state management for the analysis flow, and add export functionality (copy-to-clipboard and download-as-markdown).

#### Changes Required:

##### 1. Main Page Implementation

**File**: `src/app/page.tsx`
**Changes**: Replace placeholder with full tool implementation

```typescript
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
```

#### Success Criteria:

##### Automated Verification:

- [ ] TypeScript compiles: `npx tsc --noEmit` passes with page implementation
- [ ] All imports resolve correctly
- [ ] Build succeeds: `npm run build` completes with zero errors
- [ ] No console errors in browser DevTools

##### Manual Verification:

- [ ] Test complete flow: enter query → see loading → see results
- [ ] Test copy-to-clipboard button and verify clipboard content
- [ ] Test download button and verify markdown file downloads
- [ ] Test error handling with invalid input (empty string, very long string)
- [ ] Test responsive design on mobile (375px) and desktop (1920px)
- [ ] Verify 5-second debounce prevents rapid submissions
- [ ] Verify all example queries work (Stripe, shopify.com, Notion)

**Note**: Complete all verification before proceeding to Phase 5.

---

### Phase 5: Polish & Testing

#### Overview

Final verification, build testing, and documentation updates. Ensure production readiness with zero build errors.

#### Changes Required:

##### 1. Layout Enhancement (Optional)

**File**: `src/app/layout.tsx`
**Changes**: Add viewport meta tag for better mobile support

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Competitor Quick Scan',
  description: 'A focused tool for analyzing competitors by entering their URL or company name. Uses AI to produce a structured competitive analysis in seconds.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

##### 2. Build Verification

**File**: `package.json`
**Changes**: No changes, just verify build succeeds

Run: `npm run build`

Expected output: Build completes with zero errors and creates `.next` directory

##### 3. README Documentation (Optional)

**File**: `README.md` (NEW)
**Changes**: Document setup and usage

```markdown
# Competitor Quick Scan

A focused tool for analyzing competitors by entering their URL or company name. Uses AI to produce a structured competitive analysis in seconds.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

3. Add your Anthropic API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

   Get your key at: https://console.anthropic.com/

## Development

```bash
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Usage

1. Enter a competitor URL or company name
2. Click "Analyze"
3. Review the competitive analysis
4. Copy to clipboard or download as markdown
```

#### Success Criteria:

##### Automated Verification:

- [ ] Build succeeds: `npm run build` completes with zero errors
- [ ] Production start works: `npm start` runs successfully
- [ ] TypeScript strict mode passes: `npx tsc --noEmit`
- [ ] No console warnings or errors in production build

##### Manual Verification:

- [ ] Test production build locally: `npm run build && npm start`
- [ ] Verify tool works in production mode (not dev mode)
- [ ] Test all features in production: input, loading, results, copy, download
- [ ] Verify responsive design works in production
- [ ] Check browser console for any warnings or errors
- [ ] Test with multiple competitors (Stripe, Shopify, Notion, etc.)
- [ ] Verify error handling still works in production

**Note**: This is the final phase. Complete all verification to confirm production readiness.

---

## Testing Strategy

### Unit Tests:

**Scope**: Not implementing formal unit tests for MVP (no testing framework configured). Focus is on:

- TypeScript type checking as compile-time verification
- Manual component testing during development
- API route testing via curl/Postman

**Key Edge Cases to Test Manually:**

1. **Input Validation**:
   - Empty string query
   - Query with only whitespace
   - Very long query (>500 characters)
   - Special characters in query
   - URL vs company name formats

2. **API Error Handling**:
   - Missing ANTHROPIC_API_KEY
   - Invalid API key
   - Anthropic API rate limits
   - Network failures
   - Malformed API responses

3. **Export Functionality**:
   - Copy to clipboard in different browsers
   - Download filename with special characters
   - Large markdown downloads
   - Browser security restrictions

### Integration Tests:

**End-to-End Scenarios:**

1. **Happy Path**:
   - User enters "Stripe" → Sees loading → Receives analysis → Copies to clipboard → Downloads markdown

2. **Error Recovery**:
   - User enters invalid input → Sees error → Enters valid input → Receives analysis

3. **Rapid Submissions**:
   - User submits → Submits again within 5 seconds → Sees debounce message → Waits → Submits successfully

4. **Export After Navigation**:
   - User gets analysis → Scrolls → Clicks copy → Scrolls → Clicks download → Both work correctly

### Manual Testing Steps:

**Pre-Flight Checklist:**

1. **Setup**:
   - [ ] Create .env.local from .env.local.example
   - [ ] Add valid ANTHROPIC_API_KEY
   - [ ] Run `npm install` to ensure dependencies
   - [ ] Run `npm run dev` to start dev server

2. **Basic Functionality**:
   - [ ] Enter "Stripe" in form
   - [ ] Click "Analyze" button
   - [ ] Verify loading spinner appears
   - [ ] Wait for analysis to complete
   - [ ] Verify all sections display (Overview, Strengths, Weaknesses, Market Position, Recommendations)
   - [ ] Verify each section has content (not empty)

3. **Copy Functionality**:
   - [ ] Click "Copy" button
   - [ ] Verify success message appears
   - [ ] Paste into text editor
   - [ ] Verify markdown formatting is correct

4. **Download Functionality**:
   - [ ] Click "Download" button
   - [ ] Verify file downloads with name like "competitor-analysis-Stripe.md"
   - [ ] Open downloaded file
   - [ ] Verify content matches analysis

5. **Input Validation**:
   - [ ] Submit empty form → Verify error message
   - [ ] Enter only spaces → Verify error message
   - [ ] Enter 501 characters → Verify error message

6. **Responsive Design**:
   - [ ] Open browser DevTools
   - [ ] Test at 375px width (mobile)
   - [ ] Test at 768px width (tablet)
   - [ ] Test at 1920px width (desktop)
   - [ ] Verify layout works at all sizes

7. **Error Handling**:
   - [ ] Temporarily remove ANTHROPIC_API_KEY from .env.local
   - [ ] Restart dev server
   - [ ] Submit query
   - [ ] Verify user-friendly error message
   - [ ] Restore API key and verify normal operation

8. **Build Verification**:
   - [ ] Run `npm run build`
   - [ ] Verify zero errors
   - [ ] Run `npm start`
   - [ ] Test all functionality in production mode

## Migration Notes

No migration needed—this is a greenfield project.

## References

- Research: `/private/tmp/vaos-builds/competitor-quick-scan/.wreckit/items/001-build-product/research.md`
- Product Spec: See CLAUDE.md in item directory
- Next.js 15 Docs: https://nextjs.org/docs
- Anthropic SDK: https://docs.anthropic.com/en/api/client-sdks
- TypeScript Config: `/private/tmp/vaos-builds/competitor-quick-scan/tsconfig.json:2-40`
- Tailwind Config: `/private/tmp/vaos-builds/competitor-quick-scan/tailwind.config.ts:3-6`
