'use client';

/**
 * TokenDetailHeader Component
 *
 * Large header for token detail page with icon, price, and key metrics.
 */

import Image from 'next/image';
import { TokenDetail } from '@/contracts/types';
import { formatPrice, formatUsd, formatPercentage } from '@/lib/transform';

interface TokenDetailHeaderProps {
  token: TokenDetail;
  xchPriceUsd: number;
  isWatched: boolean;
  onToggleWatchlist: () => void;
}

export function TokenDetailHeader({
  token,
  isWatched,
  onToggleWatchlist,
}: TokenDetailHeaderProps) {
  const isPositive24h = token.change24h >= 0;

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Token icon and name */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={token.iconUrl}
              alt={`${token.name} icon`}
              width={64}
              height={64}
              className="rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${token.symbol}&background=21262d&color=f0f6fc&size=64`;
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">{token.name}</h1>
              <span className="px-2 py-1 bg-background-tertiary text-text-secondary text-sm rounded">
                {token.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {/* Watchlist button */}
              <button
                onClick={onToggleWatchlist}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isWatched
                    ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30'
                    : 'bg-background-tertiary text-text-secondary hover:text-text-primary border border-border-primary'
                }`}
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill={isWatched ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={isWatched ? 0 : 1.5}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {isWatched ? 'Watching' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>

        {/* Price display */}
        <div className="text-left sm:text-right">
          <div className="text-3xl font-bold text-text-primary font-mono">
            {formatPrice(token.priceXch)} XCH
          </div>
          <div className="text-lg text-text-secondary font-mono">
            {formatUsd(token.priceUsd)}
          </div>
          <div
            className={`inline-flex items-center gap-1 mt-2 text-lg font-medium ${
              isPositive24h ? 'text-accent-green' : 'text-accent-red'
            }`}
          >
            {isPositive24h ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-mono">{formatPercentage(token.change24h)}</span>
            <span className="text-sm text-text-muted">(24h)</span>
          </div>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border-secondary">
        <div>
          <div className="text-sm text-text-muted">24h High</div>
          <div className="text-lg font-medium text-text-primary font-mono">
            {formatPrice(token.high24h)} XCH
          </div>
        </div>
        <div>
          <div className="text-sm text-text-muted">24h Low</div>
          <div className="text-lg font-medium text-text-primary font-mono">
            {formatPrice(token.low24h)} XCH
          </div>
        </div>
        <div>
          <div className="text-sm text-text-muted">7d Change</div>
          <div
            className={`text-lg font-medium font-mono ${
              token.change7d >= 0 ? 'text-accent-green' : 'text-accent-red'
            }`}
          >
            {formatPercentage(token.change7d)}
          </div>
        </div>
        <div>
          <div className="text-sm text-text-muted">Market ID</div>
          <div className="text-sm text-text-secondary font-mono truncate" title={token.id}>
            {token.id.slice(0, 12)}...
          </div>
        </div>
      </div>
    </div>
  );
}
