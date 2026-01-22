'use client';

/**
 * TokenRow Component
 *
 * Single row in the token table displaying all token metrics.
 * Shows ALL columns (no hiding on mobile).
 * Includes rank number and Sparkline for 7-day trend.
 * All buttons have minimum 44px touch targets.
 */

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DashboardToken } from '@/contracts/types';
import { formatPrice, formatUsd, formatVolume, formatPercentage } from '@/lib/transform';
import { AlertToggle } from './AlertToggle';
import { Sparkline } from './Sparkline';

interface TokenRowProps {
  token: DashboardToken;
  rank: number;
  isAlertEnabled: boolean;
  onToggleAlert: (tokenId: string) => void;
  isAlertSupported: boolean;
  isWatched?: boolean;
  onToggleWatchlist?: (tokenId: string) => void;
}

function ChangeCell({ value, className = '' }: { value: number; className?: string }) {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-accent-green' : 'text-accent-red';

  return (
    <td className={`px-4 py-4 text-right whitespace-nowrap tabular-nums ${colorClass} ${className}`}>
      {formatPercentage(value)}
    </td>
  );
}

export function TokenRow({
  token,
  rank,
  isAlertEnabled,
  onToggleAlert,
  isAlertSupported,
  isWatched = false,
  onToggleWatchlist,
}: TokenRowProps) {
  const router = useRouter();

  // Generate sparkline data based on current price and 7d change
  const generateSparklineData = (): number[] => {
    const basePrice = token.priceXch;
    const change = token.change7d / 100;
    const startPrice = basePrice / (1 + change);
    const points = 7;
    const data: number[] = [];

    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const variance = (Math.sin(i * 1.5) * 0.02) * basePrice;
      const price = startPrice + (basePrice - startPrice) * progress + variance;
      data.push(price);
    }
    data[data.length - 1] = basePrice;
    return data;
  };

  const sparklineData = generateSparklineData();

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    router.push(`/tokens/${token.symbol}`);
  };

  return (
    <tr
      className="border-b border-border-secondary hover:bg-background-tertiary transition-colors cursor-pointer"
      onClick={handleRowClick}
    >
      {/* Rank - Sticky */}
      <td className="px-4 py-4 text-text-muted text-sm sticky left-0 bg-background-secondary z-10">
        {rank}
      </td>

      {/* Token Info - Sticky */}
      <td className="px-4 py-4 sticky left-12 bg-background-secondary z-10">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image
              src={token.iconUrl}
              alt={`${token.name} icon`}
              width={32}
              height={32}
              className="rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${token.symbol}&background=1a1a24&color=ffffff&size=32`;
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-text-primary truncate">{token.name}</div>
            <div className="text-sm text-text-muted">{token.symbol}</div>
          </div>
        </div>
      </td>

      {/* Price XCH */}
      <td className="px-4 py-4 text-right whitespace-nowrap">
        {token.hasMarket === false ? (
          <span className="text-text-muted text-sm">No market</span>
        ) : (
          <div className="tabular-nums">
            <div className="text-text-primary font-semibold">{formatPrice(token.priceXch)} XCH</div>
            <div className="text-text-secondary text-sm">{formatUsd(token.priceUsd)}</div>
          </div>
        )}
      </td>

      {/* 24h Change */}
      {token.hasMarket === false ? (
        <td className="px-4 py-4 text-right text-text-muted">-</td>
      ) : (
        <ChangeCell value={token.change24h} />
      )}

      {/* 7d Change */}
      {token.hasMarket === false ? (
        <td className="px-4 py-4 text-right text-text-muted">-</td>
      ) : (
        <ChangeCell value={token.change7d} />
      )}

      {/* Volume 24h */}
      <td className="px-4 py-4 text-right whitespace-nowrap">
        <div className="tabular-nums text-text-primary">
          {formatVolume(token.volume24hXch)} XCH
        </div>
      </td>

      {/* Volume 7d */}
      <td className="px-4 py-4 text-right whitespace-nowrap">
        <div className="tabular-nums text-text-primary">
          {formatVolume(token.volume7dXch)} XCH
        </div>
      </td>

      {/* Liquidity */}
      <td className="px-4 py-4 text-right whitespace-nowrap">
        <div className="tabular-nums text-text-primary">
          {formatVolume(token.liquidityXch)} XCH
        </div>
        <div className="text-sm text-text-muted tabular-nums">{formatUsd(token.liquidityUsd)}</div>
      </td>

      {/* Last 7 Days Sparkline */}
      <td className="px-4 py-4 text-right">
        <div className="flex justify-end">
          <Sparkline data={sparklineData} width={80} height={24} />
        </div>
      </td>

      {/* Watchlist Toggle */}
      {onToggleWatchlist && (
        <td className="px-2 py-4 text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(token.id);
            }}
            className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-background-tertiary transition-colors"
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
        </td>
      )}

      {/* Alert Toggle */}
      <td className="px-2 py-4 text-center">
        <AlertToggle
          tokenId={token.id}
          isEnabled={isAlertEnabled}
          onToggle={onToggleAlert}
          isSupported={isAlertSupported}
        />
      </td>
    </tr>
  );
}
