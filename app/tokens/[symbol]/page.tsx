/**
 * Token Detail Page
 *
 * Dynamic route for individual token pages.
 * Displays detailed token information, price chart, and trading links.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchDashboardData } from '@/lib/data-fetcher';
import { TokenDetailClient } from './TokenDetailClient';

interface TokenPageProps {
  params: Promise<{ symbol: string }>;
}

/**
 * Generate metadata for the token page
 */
export async function generateMetadata({
  params,
}: TokenPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol).toUpperCase();

  return {
    title: `${decodedSymbol} | XCH Dashboard`,
    description: `View detailed market data, price charts, and trading links for ${decodedSymbol} on the Chia blockchain.`,
    openGraph: {
      title: `${decodedSymbol} - Chia Asset Token`,
      description: `Real-time price data and market information for ${decodedSymbol}`,
    },
  };
}

/**
 * Token detail page component
 */
export default async function TokenPage({ params }: TokenPageProps) {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol).toUpperCase();

  // Fetch dashboard data (includes all tokens)
  const result = await fetchDashboardData();

  if (!result.success || !result.data) {
    // If we can't fetch data, show not found
    notFound();
  }

  // Find the token by symbol
  const token = result.data.tokens.find(
    (t) => t.symbol.toUpperCase() === decodedSymbol
  );

  if (!token) {
    notFound();
  }

  // Enhance token with detail-specific data
  const tokenDetail = {
    ...token,
    liquidity: {
      totalXch: token.volume24hXch * 10, // Approximation
      totalUsd: token.volume24hUsd * 10,
    },
    marketCap: undefined, // Not available from API
  };

  return (
    <TokenDetailClient
      token={tokenDetail}
      xchPriceUsd={result.data.xchPriceUsd}
    />
  );
}
