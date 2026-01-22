'use client';

/**
 * TokenTable Component
 *
 * Main table displaying all tokens with sorting capability.
 * Shows ALL columns on all screen sizes with horizontal scroll.
 * Features sticky first column (token name) and Last 7 Days sparkline.
 */

import { DashboardToken, SortConfig, SortField } from '@/contracts/types';
import { TokenRow } from './TokenRow';

interface TokenTableProps {
  tokens: DashboardToken[];
  sortConfig: SortConfig;
  onSortChange: (field: SortField) => void;
  enabledAlerts: Set<string>;
  onToggleAlert: (tokenId: string) => void;
  isAlertSupported: boolean;
  startRank?: number;
  watchlist?: string[];
  onToggleWatchlist?: (tokenId: string) => void;
}

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: 'asc' | 'desc';
  onClick: (field: SortField) => void;
  align?: 'left' | 'right';
  className?: string;
}

function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onClick,
  align = 'right',
  className = '',
}: SortableHeaderProps) {
  const isActive = currentField === field;

  return (
    <th
      className={`px-4 py-3 text-${align} text-sm font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors select-none whitespace-nowrap ${className}`}
      onClick={() => onClick(field)}
    >
      <div
        className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}
      >
        {isActive && (
          <span className="text-accent-blue">
            {direction === 'asc' ? (
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
        )}
        <span className={isActive ? 'text-accent-blue' : ''}>{label}</span>
      </div>
    </th>
  );
}

export function TokenTable({
  tokens,
  sortConfig,
  onSortChange,
  enabledAlerts,
  onToggleAlert,
  isAlertSupported,
  startRank = 1,
  watchlist = [],
  onToggleWatchlist,
}: TokenTableProps) {
  if (tokens.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p className="text-lg">No tokens found</p>
        <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="bg-background-tertiary border-b border-border-primary">
          <tr>
            {/* Rank - Sticky */}
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary w-12 sticky left-0 bg-background-tertiary z-10">
              #
            </th>
            {/* Token - Sticky */}
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary sticky left-12 bg-background-tertiary z-10 min-w-[180px]">
              <SortableHeader
                label="Token"
                field="name"
                currentField={sortConfig.field}
                direction={sortConfig.direction}
                onClick={onSortChange}
                align="left"
                className="!px-0"
              />
            </th>
            <SortableHeader
              label="Price"
              field="priceXch"
              currentField={sortConfig.field}
              direction={sortConfig.direction}
              onClick={onSortChange}
            />
            <SortableHeader
              label="24h %"
              field="change24h"
              currentField={sortConfig.field}
              direction={sortConfig.direction}
              onClick={onSortChange}
            />
            <SortableHeader
              label="7d %"
              field="change7d"
              currentField={sortConfig.field}
              direction={sortConfig.direction}
              onClick={onSortChange}
            />
            <SortableHeader
              label="Vol (24h)"
              field="volume24hXch"
              currentField={sortConfig.field}
              direction={sortConfig.direction}
              onClick={onSortChange}
            />
            <SortableHeader
              label="Vol (7d)"
              field="volume7dXch"
              currentField={sortConfig.field}
              direction={sortConfig.direction}
              onClick={onSortChange}
            />
            <SortableHeader
              label="Liquidity"
              field="liquidityXch"
              currentField={sortConfig.field}
              direction={sortConfig.direction}
              onClick={onSortChange}
            />
            {/* Last 7 Days Sparkline */}
            <th className="px-4 py-3 text-right text-sm font-semibold text-text-secondary whitespace-nowrap">
              7d Chart
            </th>
            {/* Watchlist */}
            {onToggleWatchlist && (
              <th className="px-2 py-3 text-center text-sm font-semibold text-text-secondary w-12">
                <svg
                  className="h-4 w-4 mx-auto text-text-muted"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </th>
            )}
            {/* Alerts */}
            <th className="px-2 py-3 text-center text-sm font-semibold text-text-secondary w-12">
              <svg
                className="h-4 w-4 mx-auto text-text-muted"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <TokenRow
              key={token.id}
              token={token}
              rank={startRank + index}
              isAlertEnabled={enabledAlerts.has(token.id)}
              onToggleAlert={onToggleAlert}
              isAlertSupported={isAlertSupported}
              isWatched={watchlist.includes(token.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
