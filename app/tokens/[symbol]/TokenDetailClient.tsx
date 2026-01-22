'use client';

/**
 * TokenDetailClient Component
 *
 * Client-side component for token detail page.
 * Handles interactive elements like charts, watchlist, and real-time updates.
 */

import Link from 'next/link';
import { TokenDetail } from '@/contracts/types';
import { TokenDetailHeader } from '@/components/TokenDetailHeader';
import { TokenStats } from '@/components/TokenStats';
import { TradingLinks } from '@/components/TradingLinks';
import { PriceChart } from '@/components/PriceChart';
import { ChartTimeframeSelector } from '@/components/ChartTimeframeSelector';
import { OfferHistory } from '@/components/OfferHistory';
import { useChartData } from '@/hooks/useChartData';
import { useWatchlist } from '@/hooks/useWatchlist';

interface TokenDetailClientProps {
  token: TokenDetail;
  xchPriceUsd: number;
}

export function TokenDetailClient({ token, xchPriceUsd }: TokenDetailClientProps) {
  // Chart data hook
  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
    timeframe,
    setTimeframe,
  } = useChartData(token.id, token);

  // Watchlist hook
  const { isWatched, toggleWatchlist } = useWatchlist();
  const watched = isWatched(token.id);

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Navigation */}
      <div className="border-b border-border-primary">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* Token Header */}
        <TokenDetailHeader
          token={token}
          xchPriceUsd={xchPriceUsd}
          isWatched={watched}
          onToggleWatchlist={() => toggleWatchlist(token.id)}
        />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Chart section - takes 2 columns on large screens */}
          <div className="lg:col-span-2 bg-background-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Price Chart</h2>
              <ChartTimeframeSelector
                currentTimeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            </div>

            {chartError && (
              <div className="flex items-center justify-center h-64 text-text-muted">
                <p>Unable to load chart data</p>
              </div>
            )}

            {!chartError && (
              <PriceChart
                data={chartData}
                isLoading={chartLoading}
                height={400}
              />
            )}
          </div>

          {/* Sidebar - stats and trading links */}
          <div className="space-y-6">
            {/* Token Stats */}
            <TokenStats token={token} xchPriceUsd={xchPriceUsd} />

            {/* Trading Links */}
            <TradingLinks token={token} />
          </div>
        </div>

        {/* Offer History */}
        <div className="mt-6">
          <OfferHistory
            tokenId={token.id}
            tokenSymbol={token.symbol}
            xchPriceUsd={xchPriceUsd}
          />
        </div>

        {/* Additional info section */}
        <div className="mt-6 bg-background-secondary border border-border-primary rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            About {token.name}
          </h2>
          <div className="text-text-secondary">
            {token.description ? (
              <p>{token.description}</p>
            ) : (
              <p className="text-text-muted">
                No description available for this token. Visit the trading platforms
                for more information.
              </p>
            )}
          </div>

          {token.website && (
            <div className="mt-4">
              <a
                href={token.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent-blue hover:underline"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
                Visit Website
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-text-muted">
          <p>
            Data provided by{' '}
            <a
              href="https://dexie.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              Dexie.space
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
