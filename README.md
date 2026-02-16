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
