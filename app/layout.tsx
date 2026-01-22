import type { Metadata, Viewport } from 'next';
import './globals.css';

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
  themeColor: '#0d1117',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://api.dexie.space" />
        <link rel="preconnect" href="https://icons.dexie.space" />
        <link rel="dns-prefetch" href="https://api.coingecko.com" />
      </head>
      <body className="bg-background-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
