'use client';

/**
 * TradingLinks Component
 *
 * Displays trading links to Dexie and TibetSwap.
 */

import { DashboardToken } from '@/contracts/types';
import {
  getDexieSwapLink,
  getTibetSwapLink,
  getDexieLiquidityLink,
  getTibetSwapLiquidityLink,
  getPlatformDisplayName,
} from '@/lib/dex-links';

interface TradingLinksProps {
  token: DashboardToken;
}

export function TradingLinks({ token }: TradingLinksProps) {
  const dexieSwap = getDexieSwapLink(token);
  const tibetSwap = getTibetSwapLink(token);
  const dexieLiquidity = getDexieLiquidityLink(token);
  const tibetLiquidity = getTibetSwapLiquidityLink(token);

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Trade {token.symbol}</h2>

      {/* Swap Links */}
      <div className="space-y-3">
        <div className="text-sm text-text-muted mb-2">Swap</div>

        {/* Dexie Swap */}
        <a
          href={dexieSwap.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg hover:bg-border-secondary transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">D</span>
            </div>
            <div>
              <div className="font-medium text-text-primary">
                {getPlatformDisplayName(dexieSwap.platform)}
              </div>
              <div className="text-xs text-text-muted">Order book DEX</div>
            </div>
          </div>
          <svg
            className="h-5 w-5 text-text-muted group-hover:text-accent-blue transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>

        {/* TibetSwap */}
        <a
          href={tibetSwap.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg hover:bg-border-secondary transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">T</span>
            </div>
            <div>
              <div className="font-medium text-text-primary">
                {getPlatformDisplayName(tibetSwap.platform)}
              </div>
              <div className="text-xs text-text-muted">AMM DEX</div>
            </div>
          </div>
          <svg
            className="h-5 w-5 text-text-muted group-hover:text-accent-blue transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>

      {/* Liquidity Links */}
      <div className="mt-6 space-y-3">
        <div className="text-sm text-text-muted mb-2">Add Liquidity</div>

        {/* Dexie Liquidity */}
        <a
          href={dexieLiquidity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg hover:bg-border-secondary transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">D</span>
            </div>
            <div>
              <div className="font-medium text-text-primary">Dexie Liquidity</div>
              <div className="text-xs text-text-muted">Create orders</div>
            </div>
          </div>
          <svg
            className="h-5 w-5 text-text-muted group-hover:text-accent-green transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </a>

        {/* TibetSwap Liquidity */}
        <a
          href={tibetLiquidity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg hover:bg-border-secondary transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">T</span>
            </div>
            <div>
              <div className="font-medium text-text-primary">TibetSwap Liquidity</div>
              <div className="text-xs text-text-muted">Provide LP</div>
            </div>
          </div>
          <svg
            className="h-5 w-5 text-text-muted group-hover:text-accent-green transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-text-muted">
        Always verify URLs before connecting your wallet. Trading involves risk.
      </p>
    </div>
  );
}
