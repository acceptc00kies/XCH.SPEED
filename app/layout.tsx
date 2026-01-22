import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Configure Inter font with all weights needed
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'XCH Dashboard | Chia Asset Tokens',
  description:
    'Fast-loading dashboard displaying real-time Chia Asset Token (CAT) prices and market data from Dexie DEX.',
  keywords: ['Chia', 'XCH', 'CAT', 'Crypto', 'Dashboard', 'Dexie', 'DEX'],
  authors: [{ name: 'XCH Dashboard' }],
  openGraph: {
    title: 'XCH Dashboard | Chia Asset Tokens',
    description:
      'Real-time Chia Asset Token prices and market data from Dexie DEX.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.dexie.space" />
        <link rel="preconnect" href="https://icons.dexie.space" />
        <link rel="dns-prefetch" href="https://api.coingecko.com" />
      </head>
      <body className={`${inter.className} bg-background-primary text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
