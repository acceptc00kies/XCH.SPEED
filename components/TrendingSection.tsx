'use client';

/**
 * TrendingSection Component
 *
 * Displays trending tokens in horizontal scrollable cards.
 * Supports: Trending (by volume), Weekly Gainers, Weekly Losers.
 */

import Image from 'next/image';
import Link from 'next/link';
import { DashboardToken } from '@/contracts/types';
import { formatPrice, formatPercentage } from '@/lib/transform';
import { Sparkline } from './Sparkline';

interface TrendingSectionProps {
  /** Section title */
  title: string;
  /** Tokens to display */
  tokens: DashboardToken[];
  /** Type determines styling */
  type: 'trending' | 'gainers' | 'losers';
}

interface TrendingCardProps {
  token: DashboardToken;
  type: 'trending' | 'gainers' | 'losers';
}

function TrendingCard({ token, type }: TrendingCardProps) {
  const isPositive = token.change7d >= 0;

  // Generate mock sparkline data based on current price and 7d change
  // In production, this would come from actual historical data
  const generateSparklineData = (): number[] => {
    const basePrice = token.priceXch;
    const change = token.change7d / 100;
    const startPrice = basePrice / (1 + change);
    const points = 7;
    const data: number[] = [];

    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      // Add some variance to make it look more natural
      const variance = (Math.sin(i * 1.5) * 0.02) * basePrice;
      const price = startPrice + (basePrice - startPrice) * progress + variance;
      data.push(price);
    }
    // Ensure last point is actual current price
    data[data.length - 1] = basePrice;
    return data;
  };

  const sparklineData = generateSparklineData();

  return (
    <Link
      href={`/tokens/${token.symbol}`}
      className="flex-shrink-0 w-[160px] sm:w-[180px] snap-start"
    >
      <div className="bg-background-secondary border border-border-primary rounded-lg p-3 hover:border-border-secondary hover:bg-background-tertiary transition-all h-full">
        {/* Token Info */}
        <div className="flex items-center gap-2 mb-2">
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
          <div className="min-w-0 flex-1">
            <div className="font-medium text-text-primary text-sm truncate">
              {token.symbol}
            </div>
            <div className="text-xs text-text-muted truncate">{token.name}</div>
          </div>
        </div>

        {/* Price */}
        <div className="text-sm font-semibold text-text-primary tabular-nums mb-1">
          {formatPrice(token.priceXch)} XCH
        </div>

        {/* Change */}
        <div
          className={`text-xs font-medium tabular-nums mb-2 ${
            isPositive ? 'text-accent-green' : 'text-accent-red'
          }`}
        >
          {formatPercentage(token.change7d)}
        </div>

        {/* Sparkline */}
        <div className="flex justify-center">
          <Sparkline
            data={sparklineData}
            width={140}
            height={28}
            color={type === 'losers' ? 'red' : type === 'gainers' ? 'green' : undefined}
          />
        </div>
      </div>
    </Link>
  );
}

export function TrendingSection({ title, tokens, type }: TrendingSectionProps) {
  if (!tokens || tokens.length === 0) {
    return null;
  }

  // Icon based on type
  const getIcon = () => {
    switch (type) {
      case 'trending':
        return (
          <svg
            className="h-5 w-5 text-accent-blue"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'gainers':
        return (
          <svg
            className="h-5 w-5 text-accent-green"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'losers':
        return (
          <svg
            className="h-5 w-5 text-accent-red"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <section className="mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        {getIcon()}
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>

      {/* Scrollable Container - Mobile */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
        <div className="flex gap-3 pb-2">
          {tokens.map((token) => (
            <TrendingCard key={token.id} token={token} type={type} />
          ))}
        </div>
      </div>

      {/* Grid Container - Desktop */}
      <div className="hidden lg:grid grid-cols-5 gap-3">
        {tokens.slice(0, 5).map((token) => (
          <TrendingCard key={token.id} token={token} type={type} />
        ))}
      </div>
    </section>
  );
}
