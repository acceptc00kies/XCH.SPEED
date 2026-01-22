'use client';

/**
 * Header Component
 *
 * Top navigation bar with XCH price display.
 */

import { formatUsd } from '@/lib/transform';

interface HeaderProps {
  xchPriceUsd: number;
}

export function Header({ xchPriceUsd }: HeaderProps) {
  return (
    <header className="bg-background-secondary border-b border-border-primary">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-accent-green rounded-lg flex items-center justify-center">
              <span className="text-background-primary font-bold text-xl">X</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">XCH Dashboard</h1>
              <p className="text-sm text-text-muted">Chia Asset Tokens</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-text-muted">XCH Price</div>
              <div className="text-lg font-semibold text-text-primary font-mono">
                {formatUsd(xchPriceUsd)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
