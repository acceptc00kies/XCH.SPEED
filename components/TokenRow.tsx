'use client';

/**
 * TokenRow Component
 *
 * Single row in the token table displaying all token metrics.
 * Supports click navigation to token detail page.
 */

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DashboardToken } from '@/contracts/types';
import { formatPrice, formatUsd, formatVolume, formatPercentage } from '@/lib/transform';
import { AlertToggle } from './AlertToggle';

interface TokenRowProps {
  token: DashboardToken;
  rank: number;
  isAlertEnabled: boolean;
  onToggleAlert: (tokenId: string) => void;
  isAlertSupported: boolean;
  isWatched?: boolean;
  onToggleWatchlist?: (tokenId: string) => void;
}

function ChangeCell({ value }: { value: number }) {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-accent-green' : 'text-accent-red';

  return (
    <td className={`px-4 py-4 text-right whitespace-nowrap font-mono ${colorClass} hidden md:table-cell`}>
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
      className="border-b border-border-secondary hover:bg-background-secondary/50 transition-colors cursor-pointer"
      onClick={handleRowClick}
    >
      {/* Rank */}
      <td className="px-4 py-4 text-text-muted text-sm">{rank}</td>

      {/* Token Info */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image
              src={token.iconUrl}
              alt={`${token.name} icon`}
              width={32}
              height={32}
              className="rounded-full"
              onError={(e) => {
                // Fallback to placeholder on error
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${token.symbol}&background=21262d&color=f0f6fc&size=32`;
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
      <td className="px-4 py-4 text-right whitespace-nowrap font-mono text-text-primary">
        {formatPrice(token.priceXch)} XCH
      </td>

      {/* Price USD - hidden on small screens */}
      <td className="px-4 py-4 text-right whitespace-nowrap font-mono text-text-secondary hidden sm:table-cell">
        {formatUsd(token.priceUsd)}
      </td>

      {/* 24h Change - hidden on small screens */}
      <ChangeCell value={token.change24h} />

      {/* 7d Change - hidden on medium screens */}
      <td className={`px-4 py-4 text-right whitespace-nowrap font-mono hidden lg:table-cell ${token.change7d >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
        {formatPercentage(token.change7d)}
      </td>

      {/* Volume 24h - hidden on small screens */}
      <td className="px-4 py-4 text-right whitespace-nowrap hidden md:table-cell">
        <div className="font-mono text-text-primary">
          {formatVolume(token.volume24hXch)} XCH
        </div>
        <div className="text-sm text-text-muted">{formatUsd(token.volume24hUsd)}</div>
      </td>

      {/* Watchlist Toggle */}
      {onToggleWatchlist && (
        <td className="px-2 py-4 text-center hidden sm:table-cell">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(token.id);
            }}
            className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
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
