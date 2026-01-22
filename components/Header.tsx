'use client';

/**
 * Header Component
 *
 * Top navigation bar with XCH price display.
 * Sticky position with backdrop blur effect.
 * Responsive: inline on desktop, hamburger icon on mobile.
 */

import { formatUsd, formatPercentage } from '@/lib/transform';

interface HeaderProps {
  /** Current XCH price in USD */
  xchPriceUsd: number;
  /** Optional 24h price change percentage */
  xchChange24h?: number;
}

export function Header({ xchPriceUsd, xchChange24h = 0 }: HeaderProps) {
  const isPositive = xchChange24h >= 0;

  return (
    <header className="sticky top-0 z-50 bg-background-secondary/80 backdrop-blur-lg border-b border-border-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-accent-green rounded-lg flex items-center justify-center">
              <span className="text-background-primary font-bold text-lg">X</span>
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">
              XCH<span className="text-accent-green">.SPEED</span>
            </span>
          </div>

          {/* XCH Price - Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">XCH</span>
              <span className="text-lg font-semibold text-text-primary tabular-nums">
                {formatUsd(xchPriceUsd)}
              </span>
              {xchChange24h !== 0 && (
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded-full tabular-nums ${
                    isPositive
                      ? 'bg-accent-green/10 text-accent-green'
                      : 'bg-accent-red/10 text-accent-red'
                  }`}
                >
                  {formatPercentage(xchChange24h)}
                </span>
              )}
            </div>
          </div>

          {/* Mobile: Price + Hamburger */}
          <div className="flex sm:hidden items-center gap-3">
            {/* Compact price display */}
            <div className="text-right">
              <div className="text-sm font-semibold text-text-primary tabular-nums">
                {formatUsd(xchPriceUsd)}
              </div>
              {xchChange24h !== 0 && (
                <div
                  className={`text-xs font-medium tabular-nums ${
                    isPositive ? 'text-accent-green' : 'text-accent-red'
                  }`}
                >
                  {formatPercentage(xchChange24h)}
                </div>
              )}
            </div>

            {/* Hamburger Menu Icon - Visual only for now */}
            <button
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-background-tertiary transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6 text-text-secondary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
