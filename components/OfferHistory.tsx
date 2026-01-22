'use client';

/**
 * OfferHistory Component
 *
 * Displays recent completed trades and active offers for a token.
 * Shows trade direction (buy/sell), price, amount, and timestamp.
 */

import { useState, useEffect } from 'react';
import { formatPrice, formatUsd } from '@/lib/transform';

interface OfferHistoryItem {
  id: string;
  tradeId: string;
  type: 'buy' | 'sell';
  status: 'completed' | 'active' | 'pending' | 'cancelled';
  price: number;
  amountToken: number;
  amountXch: number;
  tokenSymbol: string;
  dateCreated: string;
  dateCompleted: string | null;
  taker: string | null;
}

interface OfferHistoryData {
  offers: OfferHistoryItem[];
  completedCount: number;
  activeCount: number;
  lastTradePrice: {
    price: number;
    priceXch: number;
    date: string;
  } | null;
}

interface OfferHistoryProps {
  tokenId: string;
  tokenSymbol: string;
  xchPriceUsd: number;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatAmount(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(2)}K`;
  }
  return amount.toFixed(2);
}

export function OfferHistory({ tokenId, tokenSymbol, xchPriceUsd }: OfferHistoryProps) {
  const [data, setData] = useState<OfferHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');

  useEffect(() => {
    async function fetchOffers() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/offers/${tokenId}`);
        const json = await res.json();

        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || 'Failed to load offers');
        }
      } catch (err) {
        setError('Failed to fetch offer history');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOffers();
  }, [tokenId]);

  const filteredOffers = data?.offers.filter(offer => {
    if (filter === 'completed') return offer.status === 'completed';
    if (filter === 'active') return offer.status === 'active';
    return true;
  }) || [];

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-primary">
        <h2 className="text-lg font-semibold text-text-primary">Recent Offers</h2>
        <div className="flex items-center gap-1 bg-background-tertiary rounded-lg p-1">
          {(['all', 'completed', 'active'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === f
                  ? 'bg-background-secondary text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {f === 'all' ? 'All' : f === 'completed' ? 'Trades' : 'Open'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 gap-4 p-4 border-b border-border-primary">
          <div>
            <div className="text-sm text-text-muted">Completed Trades</div>
            <div className="text-xl font-bold text-text-primary tabular-nums">
              {data.completedCount}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-muted">Active Offers</div>
            <div className="text-xl font-bold text-accent-blue tabular-nums">
              {data.activeCount}
            </div>
          </div>
        </div>
      )}

      {/* Last Trade Price */}
      {data?.lastTradePrice && (
        <div className="p-4 border-b border-border-primary bg-background-tertiary/50">
          <div className="text-sm text-text-muted mb-1">Last Trade Price</div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-primary tabular-nums">
              {formatPrice(data.lastTradePrice.priceXch)} XCH
            </span>
            <span className="text-sm text-text-secondary tabular-nums">
              ({formatUsd(data.lastTradePrice.priceXch * xchPriceUsd)})
            </span>
            <span className="text-xs text-text-muted">
              {formatRelativeTime(data.lastTradePrice.date)}
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-accent-blue border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-text-muted">Loading offer history...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-8 text-center">
          <p className="text-accent-red">{error}</p>
        </div>
      )}

      {/* Offer List */}
      {!isLoading && !error && (
        <div className="max-h-[400px] overflow-y-auto">
          {filteredOffers.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              No {filter === 'all' ? '' : filter} offers found
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-background-secondary">
                <tr className="text-xs text-text-muted border-b border-border-primary">
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-right p-3 font-medium">Price (XCH)</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                  <th className="text-right p-3 font-medium">Total</th>
                  <th className="text-right p-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => {
                  const priceXch = offer.amountToken > 0
                    ? offer.amountXch / offer.amountToken
                    : 0;

                  return (
                    <tr
                      key={offer.id}
                      className="border-b border-border-secondary hover:bg-background-tertiary transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              offer.type === 'buy'
                                ? 'bg-accent-green/20 text-accent-green'
                                : 'bg-accent-red/20 text-accent-red'
                            }`}
                          >
                            {offer.type === 'buy' ? 'BUY' : 'SELL'}
                          </span>
                          {offer.status === 'active' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent-blue/20 text-accent-blue">
                              OPEN
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right tabular-nums text-text-primary">
                        {formatPrice(priceXch)}
                      </td>
                      <td className="p-3 text-right tabular-nums text-text-secondary">
                        {formatAmount(offer.amountToken)} {tokenSymbol}
                      </td>
                      <td className="p-3 text-right tabular-nums text-text-secondary">
                        {formatPrice(offer.amountXch, 4)} XCH
                      </td>
                      <td className="p-3 text-right text-text-muted text-sm">
                        {formatRelativeTime(offer.dateCompleted || offer.dateCreated)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Footer - Link to Dexie */}
      <div className="p-3 border-t border-border-primary text-center">
        <a
          href={`https://dexie.space/offers/${tokenId}/xch`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent-blue hover:underline inline-flex items-center gap-1"
        >
          View all offers on Dexie
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
}
