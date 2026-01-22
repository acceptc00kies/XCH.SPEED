'use client';

/**
 * TokenStats Component
 *
 * Stats grid displaying token market data.
 */

import { TokenDetail } from '@/contracts/types';
import { formatPrice, formatUsd, formatVolume } from '@/lib/transform';

interface TokenStatsProps {
  token: TokenDetail;
  xchPriceUsd: number;
}

export function TokenStats({ token, xchPriceUsd }: TokenStatsProps) {
  const stats = [
    {
      label: '24h Volume',
      value: `${formatVolume(token.volume24hXch)} XCH`,
      subValue: formatUsd(token.volume24hUsd),
    },
    {
      label: 'Liquidity',
      value: `${formatVolume(token.liquidity.totalXch)} XCH`,
      subValue: formatUsd(token.liquidity.totalUsd),
    },
    {
      label: '24h High',
      value: `${formatPrice(token.high24h)} XCH`,
      subValue: formatUsd(token.high24h * xchPriceUsd),
    },
    {
      label: '24h Low',
      value: `${formatPrice(token.low24h)} XCH`,
      subValue: formatUsd(token.low24h * xchPriceUsd),
    },
  ];

  // Add market cap if available
  if (token.marketCap !== undefined) {
    stats.push({
      label: 'Market Cap',
      value: formatUsd(token.marketCap),
      subValue: '',
    });
  }

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Market Stats</h2>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`${
              index < stats.length - 1 ? 'pb-4 border-b border-border-secondary' : ''
            }`}
          >
            <div className="text-sm text-text-muted">{stat.label}</div>
            <div className="text-lg font-medium text-text-primary font-mono">
              {stat.value}
            </div>
            {stat.subValue && (
              <div className="text-sm text-text-secondary font-mono">{stat.subValue}</div>
            )}
          </div>
        ))}
      </div>

      {/* Price spread info */}
      <div className="mt-4 pt-4 border-t border-border-secondary">
        <div className="text-sm text-text-muted mb-2">24h Price Range</div>
        <div className="relative h-2 bg-background-tertiary rounded-full overflow-hidden">
          {/* Range bar */}
          <div
            className="absolute h-full bg-gradient-to-r from-accent-red via-accent-yellow to-accent-green rounded-full"
            style={{ width: '100%' }}
          />
          {/* Current price indicator */}
          {token.high24h > token.low24h && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-accent-blue shadow"
              style={{
                left: `${Math.min(100, Math.max(0, ((token.priceXch - token.low24h) / (token.high24h - token.low24h)) * 100))}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-text-muted font-mono">
          <span>{formatPrice(token.low24h)}</span>
          <span>{formatPrice(token.high24h)}</span>
        </div>
      </div>
    </div>
  );
}
