/**
 * Data Transformation Layer
 *
 * Transforms raw API responses into unified dashboard format.
 */

import { DexieToken, DexieMarket, DashboardToken } from '@/contracts/types';

/**
 * Create a map of token ID to token data for fast lookups
 */
function createTokenMap(tokens: DexieToken[]): Map<string, DexieToken> {
  const map = new Map<string, DexieToken>();
  for (const token of tokens) {
    map.set(token.id, token);
  }
  return map;
}

/**
 * Safely extract numeric value with fallback
 */
function safeNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value;
  }
  return fallback;
}

/**
 * Transform a single market entry into a DashboardToken
 */
function transformMarket(
  market: DexieMarket,
  tokenMap: Map<string, DexieToken>,
  xchUsdPrice: number
): DashboardToken | null {
  // Find matching token metadata
  const token = tokenMap.get(market.id);

  // Use market data if token metadata is missing
  const symbol = token?.code || market.code || 'UNKNOWN';
  const name = token?.name || market.name || 'Unknown Token';
  const iconUrl = token?.icon || `https://icons.dexie.space/${market.id}.webp`;

  // Extract price data
  const priceXch = safeNumber(market.prices?.last?.price);

  // Skip tokens with no price data
  if (priceXch === 0) {
    return null;
  }

  const priceUsd = priceXch * xchUsdPrice;

  // Extract change percentages (API returns as decimals, convert to %)
  const change24h = safeNumber(market.prices?.last?.change?.daily) * 100;
  const change7d = safeNumber(market.prices?.last?.change?.weekly) * 100;

  // Extract volume data
  const volume24hXch = safeNumber(market.volume?.xch?.daily);
  const volume24hUsd = volume24hXch * xchUsdPrice;

  // Extract high/low
  const high24h = safeNumber(market.prices?.high?.daily);
  const low24h = safeNumber(market.prices?.low?.daily);

  return {
    id: market.id,
    symbol,
    name,
    iconUrl,
    priceXch,
    priceUsd,
    change24h,
    change7d,
    volume24hXch,
    volume24hUsd,
    high24h,
    low24h,
    pairId: market.pair_id || '',
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Merge tokens and markets data into unified DashboardToken array
 *
 * @param tokens - Array of token metadata from /v1/tokens
 * @param markets - Array of market data from /v1/markets
 * @param xchUsdPrice - Current XCH/USD exchange rate
 * @returns Array of DashboardToken objects sorted by volume
 */
export function mergeTokensAndMarkets(
  tokens: DexieToken[],
  markets: DexieMarket[],
  xchUsdPrice: number
): DashboardToken[] {
  const tokenMap = createTokenMap(tokens);
  const dashboardTokens: DashboardToken[] = [];

  for (const market of markets) {
    const transformed = transformMarket(market, tokenMap, xchUsdPrice);
    if (transformed) {
      dashboardTokens.push(transformed);
    }
  }

  // Sort by 24h volume descending (most active first)
  dashboardTokens.sort((a, b) => b.volume24hXch - a.volume24hXch);

  return dashboardTokens;
}

/**
 * Format price for display
 */
export function formatPrice(price: number, decimals = 6): string {
  if (price === 0) return '0';

  if (price < 0.000001) {
    return price.toExponential(2);
  }

  if (price < 0.01) {
    return price.toFixed(decimals);
  }

  if (price < 1) {
    return price.toFixed(4);
  }

  if (price < 1000) {
    return price.toFixed(2);
  }

  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format USD price for display
 */
export function formatUsd(price: number): string {
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  }

  if (price < 1) {
    return `$${price.toFixed(4)}`;
  }

  return `$${price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format volume for display (with K, M, B suffixes)
 */
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) {
    return `${(volume / 1_000_000_000).toFixed(2)}B`;
  }

  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  }

  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`;
  }

  return volume.toFixed(2);
}

/**
 * Format percentage change for display
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
