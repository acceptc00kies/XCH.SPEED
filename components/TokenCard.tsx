'use client';

/**
 * TokenCard Component
 *
 * Card view for individual token - used in mobile/grid layouts.
 * Touch-friendly with 44px minimum touch targets.
 */

import Image from 'next/image';
import Link from 'next/link';
import { DashboardToken } from '@/contracts/types';
import { formatPrice, formatUsd, formatVolume, formatPercentage } from '@/lib/transform';

interface TokenCardProps {
  token: DashboardToken;
  rank: number;
  isWatched: boolean;
  onToggleWatchlist: (tokenId: string) => void;
  isAlertEnabled: boolean;
  onToggleAlert: (tokenId: string) => void;
  isAlertSupported: boolean;
}

export function TokenCard({
  token,
  rank,
  isWatched,
  onToggleWatchlist,
  isAlertEnabled,
  onToggleAlert,
  isAlertSupported,
}: TokenCardProps) {
  const isPositive24h = token.change24h >= 0;
  const isPositive7d = token.change7d >= 0;

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-4 hover:border-border-primary/80 transition-colors">
      {/* Header with rank and actions */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-muted">#{rank}</span>
        <div className="flex items-center gap-1">
          {/* Watchlist button - 44px touch target */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWatchlist(token.id);
            }}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-background-tertiary transition-colors"
            title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <svg
              className={`h-5 w-5 ${isWatched ? 'text-accent-yellow fill-accent-yellow' : 'text-text-muted'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={isWatched ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isWatched ? 0 : 1.5}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>

          {/* Alert button - 44px touch target */}
          {isAlertSupported && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleAlert(token.id);
              }}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-background-tertiary transition-colors"
              title={isAlertEnabled ? 'Disable alerts' : 'Enable alerts'}
            >
              <svg
                className={`h-5 w-5 ${isAlertEnabled ? 'text-accent-blue' : 'text-text-muted'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Token info - clickable link */}
      <Link href={`/tokens/${token.symbol}`} className="block">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src={token.iconUrl}
              alt={`${token.name} icon`}
              width={40}
              height={40}
              className="rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${token.symbol}&background=21262d&color=f0f6fc&size=40`;
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-text-primary truncate">{token.name}</div>
            <div className="text-sm text-text-muted">{token.symbol}</div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-lg font-bold text-text-primary font-mono">
            {formatPrice(token.priceXch)} XCH
          </div>
          <div className="text-sm text-text-secondary font-mono">
            {formatUsd(token.priceUsd)}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* 24h Change */}
          <div className="bg-background-tertiary rounded-lg p-2">
            <div className="text-xs text-text-muted mb-1">24h</div>
            <div
              className={`text-sm font-medium font-mono ${
                isPositive24h ? 'text-accent-green' : 'text-accent-red'
              }`}
            >
              {formatPercentage(token.change24h)}
            </div>
          </div>

          {/* 7d Change */}
          <div className="bg-background-tertiary rounded-lg p-2">
            <div className="text-xs text-text-muted mb-1">7d</div>
            <div
              className={`text-sm font-medium font-mono ${
                isPositive7d ? 'text-accent-green' : 'text-accent-red'
              }`}
            >
              {formatPercentage(token.change7d)}
            </div>
          </div>

          {/* Volume */}
          <div className="bg-background-tertiary rounded-lg p-2 col-span-2">
            <div className="text-xs text-text-muted mb-1">24h Volume</div>
            <div className="text-sm font-medium text-text-primary font-mono">
              {formatVolume(token.volume24hXch)} XCH
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
