import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Competitor Quick Scan',
  description: 'A focused tool for analyzing competitors by entering their URL or company name. Uses AI to produce a structured competitive analysis in seconds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
