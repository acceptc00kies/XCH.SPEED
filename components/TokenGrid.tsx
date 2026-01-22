'use client';

/**
 * TokenGrid Component
 *
 * Grid layout for token cards with responsive columns.
 * - < 640px: 1 column
 * - 640-1024px: 2 columns
 * - > 1024px: 3-4 columns (but typically switch to table view)
 */

import { DashboardToken } from '@/contracts/types';
import { TokenCard } from './TokenCard';

interface TokenGridProps {
  tokens: DashboardToken[];
  startRank?: number;
  watchlist: string[];
  onToggleWatchlist: (tokenId: string) => void;
  enabledAlerts: Set<string>;
  onToggleAlert: (tokenId: string) => void;
  isAlertSupported: boolean;
}

export function TokenGrid({
  tokens,
  startRank = 1,
  watchlist,
  onToggleWatchlist,
  enabledAlerts,
  onToggleAlert,
  isAlertSupported,
}: TokenGridProps) {
  if (tokens.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p className="text-lg">No tokens found</p>
        <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tokens.map((token, index) => (
        <TokenCard
          key={token.id}
          token={token}
          rank={startRank + index}
          isWatched={watchlist.includes(token.id)}
          onToggleWatchlist={onToggleWatchlist}
          isAlertEnabled={enabledAlerts.has(token.id)}
          onToggleAlert={onToggleAlert}
          isAlertSupported={isAlertSupported}
        />
      ))}
    </div>
  );
}
