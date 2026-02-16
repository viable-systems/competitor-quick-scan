# Research: Build Competitor Quick Scan

**Date**: 2025-06-18
**Item**: 001-build-product

## Research Question

Build a production-ready web TOOL called "Competitor Quick Scan".

A focused tool for analyzing competitors by entering their URL or company name. Uses AI to produce a structured competitive analysis in seconds.

## Product Spec (FOLLOW THIS EXACTLY)
Problem: Founders need to quickly research competitors without expensive tools
Core Loop: User enters a company URL or name -> App analyzes with AI -> User gets a competitive report
User Input: A search input where the user enters a competitor company name or website URL
Transformation: Use Anthropic Claude API to produce a structured competitive analysis
Output: A formatted analysis card with copy-to-clipboard and download buttons

Additional features:
- URL or company name input
- AI-powered competitive analysis
- Copyable markdown report
- Download as markdown

## Architecture Requirements
1. MUST have a form/input on the main page where the user provides data
2. MUST have at least one API route (src/app/api/) that processes the input
3. MUST display results that change based on user input
4. MUST have a way to copy/download/export the output
5. MUST NOT have hardcoded data arrays with 5+ items displayed in grids — if you're tempted to create a catalog, STOP and build a tool instead

## What NOT to Build
- Static dashboards with fake metrics
- Technology catalogs with hardcoded entries
- Comparison grids with pre-filled data
- Landing pages without working tools

## Tech Stack (already configured)
Next.js 15, React 19, TypeScript, Tailwind CSS. Add npm packages as needed.
For AI features: use Anthropic SDK with process.env.ANTHROPIC_API_KEY

After implementation, `npm run build` must succeed with zero errors.

## Summary

This is a greenfield project requiring a complete implementation of the Competitor Quick Scan tool. The project has a minimal Next.js 15 boilerplate with only basic configuration files and a placeholder homepage. The entire application needs to be built from scratch following the Input → Transform → Output architecture pattern.

The core challenge is building an AI-powered tool that accepts competitor URLs or company names, uses the Anthropic Claude API to generate structured competitive analysis, and presents results with export functionality. The project explicitly forbids static catalogs or hardcoded data grids—the output must dynamically change based on user input. Key technical decisions include: selecting the appropriate Anthropic SDK package, designing an effective prompt structure for competitive analysis, implementing proper error handling for API calls, and creating a clean, responsive UI with copy/download capabilities.

## Current State Analysis

### Existing Implementation

**Project Structure:**
- `/private/tmp/vaos-builds/competitor-quick-scan/package.json` - Minimal Next.js 15 project with only core dependencies (next: ^15.4.0, react: ^19.1.0). Missing: Anthropic SDK, UI libraries, form handling
- `/private/tmp/vaos-builds/competitor-quick-scan/src/app/page.tsx:1-3` - Placeholder component with "Building..." message. Complete replacement needed
- `/private/tmp/vaos-builds/competitor-quick-scan/src/app/layout.tsx:4-6` - Basic root layout with proper metadata already configured for "Competitor Quick Scan"
- `/private/tmp/vaos-builds/competitor-quick-scan/src/app/globals.css:1-4` - Tailwind CSS directives only. No custom styles
- `/private/tmp/vaos-builds/competitor-quick-scan/tsconfig.json:2-29` - TypeScript strict mode enabled with path aliases configured (@/* → ./src/*)

**Configuration Files:**
- `/private/tmp/vaos-builds/competitor-quick-scan/next.config.ts:1-5` - Empty Next.js config, no customizations
- `/private/tmp/vaos-builds/competitor-quick-scan/tailwind.config.ts:3-6` - Basic Tailwind setup with content path correctly pointing to ./src/**/*.{ts,tsx}
- `/private/tmp/vaos-builds/competitor-quick-scan/postcss.config.mjs:2-7` - PostCSS configured with Tailwind and Autoprefixer
- `/private/tmp/vaos-builds/competitor-quick-scan/.gitignore:1-5` - Standard Next.js gitignore including .env*.local files

**Critical Finding:** No API routes exist yet. The entire src/app/api/ directory structure needs to be created.

**Architecture Pattern (from CLAUDE.md:6-22):**
The project MUST follow Input → Transform → Output pattern:
1. INPUT: User provides competitor URL/company name via form
2. TRANSFORM: API route processes input using Anthropic Claude API
3. OUTPUT: Displayed results with copy/download functionality

**Anti-Patterns (from CLAUDE.md:23-32):**
- NO static dashboards with hardcoded data
- NO catalogs with pre-filled content
- NO fake metrics
- NO placeholder/coming soon content

## Key Files

- `package.json:1-21` - Current dependencies only include Next.js and React 19. Need to add: @anthropic-ai/sdk (or @anthropic-ai/sdk)
- `src/app/page.tsx:1-3` - Complete replacement needed. Must implement: input form, loading states, results display, copy/download buttons
- `src/app/layout.tsx:4-6` - Already has correct metadata. Minor enhancements possible for Open Graph tags
- `tsconfig.json:25-29` - Path alias @/* configured correctly. Can use for clean imports
- `.gitignore:3` - .env*.local ignored, must use .env.local for ANTHROPIC_API_KEY during development
- `CLAUDE.md:1-67` - Comprehensive product specification and architectural guidelines. Critical reference for implementation

**Files to Create:**
- `src/app/api/analyze/route.ts` - POST endpoint that accepts URL/company name, calls Anthropic API, returns structured analysis
- `src/components/AnalysisCard.tsx` - Display component for analysis results with copy/download functionality
- `src/components/InputForm.tsx` - Form component for competitor URL/company input
- `src/lib/anthropic.ts` - Anthropic client initialization and API call wrapper
- `src/types/analysis.ts` - TypeScript types for competitive analysis structure

## Technical Considerations

### Dependencies

**Required New Packages:**
1. `@anthropic-ai/sdk` - Official Anthropic SDK for Claude API access. Check latest version (likely ^0.32.0 or newer)
2. Optional but recommended:
   - `react-hot-toast` or similar for user-friendly error/loading notifications
   - `lucide-react` or `react-icons` for copy/download icons (lightweight, well-maintained)
   - Consider if Tailwind is sufficient for styling without additional UI library

**Environment Variables:**
- `ANTHROPIC_API_KEY` - Required for Claude API calls. Must be documented in .env.local.example
- Note: .env.local is gitignored (gitignore:3), so must create example file

### Patterns to Follow

**Next.js 15 App Router Patterns:**
- API routes use `src/app/api/[route]/route.ts` with named exports (GET, POST, etc.)
- Server Actions vs API Routes: For AI processing, API route is more appropriate as it may take longer and doesn't need form action simplicity
- Use `fetch` or SDK in API routes, direct SDK usage in Server Components

**TypeScript Patterns:**
- Strict mode enabled (tsconfig.json:11)
- Define clear types for API request/response:
  ```typescript
  interface AnalysisRequest {
    query: string; // URL or company name
  }

  interface AnalysisResponse {
    overview: string;
    strengths: string[];
    weaknesses: string[];
    marketPosition: string;
    recommendations: string[];
  }
  ```

**React 19 Patterns:**
- Use function components with hooks
- No need for React.FC type (not recommended in React 19)
- Use `useTransition` or `useOptimistic` if implementing optimistic UI updates

**Tailwind CSS Patterns:**
- Utility-first approach (tailwind.config.ts:4)
- Responsive design using `md:`, `lg:` prefixes
- Dark mode support if desired (not configured yet, would need tailwind.config.ts:3 modification)

**Error Handling Patterns:**
- API routes should return proper HTTP status codes (400 for bad input, 500 for errors)
- Client-side should handle loading states during API calls
- User-friendly error messages (not raw API errors)

**Architecture Requirements (from CLAUDE.md:41-44):**
- Must have form/input on main page for user data
- Must have at least one API route processing input
- Must display results that change based on user input
- Must have export/copy/download functionality

## Risks and Mitigations

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| **API Key Not Available** | High - Core functionality blocked | Document clear setup instructions for ANTHROPIC_API_KEY. Test with fallback/mock response if key missing during development |
| **Anthropic API Rate Limits** | Medium - Users may experience delays | Implement proper error handling for 429 responses. Add exponential backoff if building retry logic. Show clear loading indicators |
| **Poor Prompt Quality** | High - Analysis may be unstructured or low-quality | Invest time in prompt engineering. Test with various competitor types (SaaS, e-commerce, etc.). Consider few-shot examples in system prompt |
| **Cost Overrun** | Medium - API calls have cost | Implement input validation to prevent abuse. Consider caching results if same query submitted multiple times. Add usage limits if needed |
| **Build Failures** | High - Must pass `npm run build` | Test build frequently during development. Ensure TypeScript strict compliance. Verify all imports are correct |
| **Responsive Design Issues** | Medium - Poor mobile UX | Test on multiple screen sizes. Use Tailwind's responsive utilities. Consider mobile-first approach |
| **Download Functionality Issues** | Medium - Export may not work | Test markdown blob creation and download trigger. Ensure cross-browser compatibility. Fallback to copy-to-clipboard if download fails |

## Recommended Approach

### Phase 1: Foundation (Dependencies & Configuration)
1. Install `@anthropic-ai/sdk` package
2. Create `.env.local.example` with ANTHROPIC_API_KEY placeholder
3. Set up TypeScript types in `src/types/analysis.ts`
4. Create Anthropic client utility in `src/lib/anthropic.ts`

### Phase 2: API Layer
1. Create `src/app/api/analyze/route.ts` with POST handler
2. Implement prompt engineering for competitive analysis
3. Add error handling and rate limit handling
4. Test API route directly with curl/Postman before building UI

### Phase 3: UI Components
1. Build `src/components/InputForm.tsx` with validation
2. Create `src/components/AnalysisCard.tsx` with display logic
3. Implement copy-to-clipboard functionality (navigator.clipboard API)
4. Implement download-as-markdown functionality (Blob + URL.createObjectURL)
5. Add loading states and error messaging

### Phase 4: Integration
1. Replace `src/app/page.tsx` with main tool interface
2. Connect form to API route with proper state management
3. Add responsive styling with Tailwind
4. Test complete user flow: input → loading → results → export

### Phase 5: Polish
1. Add Open Graph metadata to layout.tsx
2. Verify `npm run build` passes with zero errors
3. Test with various competitor inputs
4. Add any helpful hints or examples in UI

**Prompt Engineering Strategy:**
The system prompt should instruct Claude to:
- Accept company URL or name
- Analyze business model, target market, key features
- Identify strengths and weaknesses
- Assess market positioning
- Provide actionable recommendations
- Return structured markdown or JSON

Example prompt structure:
```
You are a competitive analysis expert. Analyze the following competitor: {query}

Provide:
1. Company Overview
2. Key Strengths (3-5 bullet points)
3. Key Weaknesses (3-5 bullet points)
4. Market Position
5. Recommendations (3-5 actionable items)

Format as markdown with clear sections.
```

### Key Implementation Details

**Copy to Clipboard:**
```typescript
const handleCopy = async () => {
  await navigator.clipboard.writeText(analysisMarkdown);
  // Show success feedback
};
```

**Download as Markdown:**
```typescript
const handleDownload = () => {
  const blob = new Blob([analysisMarkdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `competitor-analysis-${companyName}.md`;
  a.click();
  URL.revokeObjectURL(url);
};
```

**API Route Structure:**
```typescript
export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query || query.trim().length === 0) {
    return Response.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const analysis = await analyzeCompetitor(query);
    return Response.json({ analysis });
  } catch (error) {
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
```

## Open Questions

1. **Prompt Specificity**: Should the prompt be optimized for specific industries (SaaS, e-commerce, etc.) or be general-purpose? Starting general, may refine based on testing.

2. **Analysis Format**: Should the API return structured JSON or raw markdown? JSON gives more UI control, markdown is easier to implement. Recommendation: Return both—parsed JSON for display and raw markdown for export.

3. **Rate Limiting**: Should we implement client-side rate limiting to prevent API abuse? Recommendation: Simple debounce on form submission (e.g., prevent duplicate submissions within 5 seconds).

4. **Error Display**: How detailed should error messages be to users? Recommendation: User-friendly messages only, log technical details server-side.

5. **Caching**: Should we implement any caching mechanism for repeated queries? Recommendation: Skip for MVP, but design with caching in mind (e.g., add query hash field).

6. **Input Validation**: Should we validate URLs if user enters a URL? Recommendation: Basic URL format validation, but allow company names through.

7. **Anthropic Model Selection**: Which Claude model to use? Recommendation: claude-3-5-sonnet-20241022 for balance of speed and quality, or claude-3-opus-20240229 for highest quality (slower, more expensive).

8. **Usage Analytics**: Should we track what competitors users are searching for? Recommendation: No—privacy concern. Keep searches anonymous.
