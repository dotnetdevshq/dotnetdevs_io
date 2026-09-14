import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'dotnetdevs.io - The Ultimate .NET Developer Platform',
  description: 'Find .NET jobs, discover creators, read the latest news, and advance your career with comprehensive roadmaps.',
  keywords: '.NET, C#, jobs, developers, community, roadmaps, tools',
  authors: [{ name: 'dotnetdevs.io' }],
  openGraph: {
    title: 'dotnetdevs.io - The Ultimate .NET Developer Platform',
    description: 'Find .NET jobs, discover creators, read the latest news, and advance your career with comprehensive roadmaps.',
    url: 'https://dotnetdevs.io',
    siteName: 'dotnetdevs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dotnetdevs.io - The Ultimate .NET Developer Platform',
    description: 'Find .NET jobs, discover creators, read the latest news, and advance your career with comprehensive roadmaps.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
