/**
 * Data Transformation Layer
 *
 * Transforms raw API responses into unified dashboard format.
 * Merges data from Dexie orderbook and TibetSwap AMM.
 */

import { DexieToken, DexieMarket, DashboardToken } from '@/contracts/types';
import { TibetSwapPair, calculatePriceFromReserves, calculateLiquidityXch } from './tibetswap-api';
import { LastTradePrice } from './last-trade-prices';

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
 * Calculate total liquidity from bid/ask arrays
 */
function calculateDexieLiquidity(liquidity: { ask: number[]; bid: number[] } | undefined): number {
  if (!liquidity) return 0;

  // Sum the deepest liquidity level from both sides
  const maxAsk = liquidity.ask?.length > 0 ? Math.max(...liquidity.ask) : 0;
  const maxBid = liquidity.bid?.length > 0 ? Math.max(...liquidity.bid) : 0;

  return maxAsk + maxBid;
}

/**
 * Transform a single market entry into a DashboardToken
 */
function transformMarket(
  market: DexieMarket,
  tokenMap: Map<string, DexieToken>,
  xchUsdPrice: number,
  tibetSwapMap: Map<string, TibetSwapPair>
): DashboardToken | null {
  // Find matching token metadata
  const token = tokenMap.get(market.id);
  const tibetPair = tibetSwapMap.get(market.id);

  // Use market data if token metadata is missing
  const symbol = token?.code || market.code || 'UNKNOWN';
  const name = token?.name || market.name || 'Unknown Token';
  const iconUrl = token?.icon || `https://icons.dexie.space/${market.id}.webp`;

  // Extract price data from Dexie
  const priceXch = safeNumber(market.prices?.last?.price);

  // Skip tokens with no price data
  if (priceXch === 0) {
    return null;
  }

  const priceUsd = priceXch * xchUsdPrice;

  // Extract change percentages (API returns as decimals, convert to %)
  const change24h = safeNumber(market.prices?.last?.change?.daily) * 100;
  const change7d = safeNumber(market.prices?.last?.change?.weekly) * 100;

  // Extract volume data (24h and 7d)
  const volume24hXch = safeNumber(market.volume?.xch?.daily);
  const volume24hUsd = volume24hXch * xchUsdPrice;
  const volume7dXch = safeNumber(market.volume?.xch?.weekly);
  const volume7dUsd = volume7dXch * xchUsdPrice;

  // Calculate liquidity - prefer TibetSwap if available, else use Dexie orderbook
  let liquidityXch = calculateDexieLiquidity(market.liquidity);
  if (tibetPair) {
    const tibetLiquidity = calculateLiquidityXch(tibetPair.xch_reserve);
    liquidityXch = Math.max(liquidityXch, tibetLiquidity);
  }
  const liquidityUsd = liquidityXch * xchUsdPrice;

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
    volume7dXch,
    volume7dUsd,
    liquidityXch,
    liquidityUsd,
    high24h,
    low24h,
    pairId: market.pair_id || '',
    lastUpdated: new Date().toISOString(),
    priceSource: 'dexie',
  };
}

/**
 * Transform a TibetSwap-only token into a DashboardToken
 */
function transformTibetSwapToken(
  pair: TibetSwapPair,
  token: DexieToken | undefined,
  xchUsdPrice: number
): DashboardToken {
  const symbol = token?.code || pair.asset_short_name || 'UNKNOWN';
  const name = token?.name || pair.asset_name || 'Unknown Token';
  const iconUrl = token?.icon || pair.asset_image_url || `https://icons.dexie.space/${pair.asset_id}.webp`;
  const tokenDenom = token?.denom || 1000;

  // Calculate price from reserves
  const priceXch = calculatePriceFromReserves(pair.xch_reserve, pair.token_reserve, tokenDenom);
  const priceUsd = priceXch * xchUsdPrice;

  // Calculate liquidity
  const liquidityXch = calculateLiquidityXch(pair.xch_reserve);
  const liquidityUsd = liquidityXch * xchUsdPrice;

  return {
    id: pair.asset_id,
    symbol,
    name,
    iconUrl,
    priceXch,
    priceUsd,
    change24h: 0, // TibetSwap doesn't provide change data
    change7d: 0,
    volume24hXch: 0, // TibetSwap doesn't provide volume directly
    volume24hUsd: 0,
    volume7dXch: 0,
    volume7dUsd: 0,
    liquidityXch,
    liquidityUsd,
    high24h: 0,
    low24h: 0,
    pairId: pair.pair_id,
    lastUpdated: new Date().toISOString(),
    hasMarket: true,
    priceSource: 'tibetswap',
  };
}

/**
 * Merge tokens and markets data into unified DashboardToken array
 *
 * @param tokens - Array of token metadata from /v1/tokens
 * @param markets - Array of market data from /v1/markets
 * @param xchUsdPrice - Current XCH/USD exchange rate
 * @param tibetSwapPairs - Array of TibetSwap pairs (optional)
 * @param lastTradePrices - Map of token ID to last trade price (optional)
 * @returns Array of DashboardToken objects sorted by 7-day volume
 */
export function mergeTokensAndMarkets(
  tokens: DexieToken[],
  markets: DexieMarket[],
  xchUsdPrice: number,
  tibetSwapPairs: TibetSwapPair[] = [],
  lastTradePrices: Map<string, LastTradePrice> = new Map()
): DashboardToken[] {
  const tokenMap = createTokenMap(tokens);
  const marketMap = new Map<string, DexieMarket>();
  const tibetSwapMap = new Map<string, TibetSwapPair>();
  const dashboardTokens: DashboardToken[] = [];
  const processedIds = new Set<string>();

  // Create lookup maps
  for (const market of markets) {
    marketMap.set(market.id, market);
  }
  for (const pair of tibetSwapPairs) {
    tibetSwapMap.set(pair.asset_id, pair);
  }

  // First, add all tokens that have Dexie market data
  for (const market of markets) {
    const transformed = transformMarket(market, tokenMap, xchUsdPrice, tibetSwapMap);
    if (transformed) {
      dashboardTokens.push(transformed);
      processedIds.add(market.id);
    }
  }

  // Second, add tokens that have TibetSwap liquidity but no Dexie market
  for (const pair of tibetSwapPairs) {
    if (!processedIds.has(pair.asset_id)) {
      const token = tokenMap.get(pair.asset_id);
      const transformed = transformTibetSwapToken(pair, token, xchUsdPrice);
      if (transformed.priceXch > 0) {
        dashboardTokens.push(transformed);
        processedIds.add(pair.asset_id);
      }
    }
  }

  // Finally, add remaining tokens - check for last trade prices first
  for (const token of tokens) {
    if (!processedIds.has(token.id)) {
      // Check if we have a last trade price for this token
      const lastTrade = lastTradePrices.get(token.id);

      if (lastTrade && lastTrade.priceXch > 0) {
        // Token has last trade price - use it
        dashboardTokens.push({
          id: token.id,
          symbol: token.code,
          name: token.name,
          iconUrl: token.icon || `https://icons.dexie.space/${token.id}.webp`,
          priceXch: lastTrade.priceXch,
          priceUsd: lastTrade.priceXch * xchUsdPrice,
          change24h: 0,
          change7d: 0,
          volume24hXch: 0,
          volume24hUsd: 0,
          volume7dXch: 0,
          volume7dUsd: 0,
          liquidityXch: 0,
          liquidityUsd: 0,
          high24h: 0,
          low24h: 0,
          pairId: '',
          lastUpdated: lastTrade.date,
          hasMarket: true, // Has market activity via last trade
          priceSource: 'lastTrade',
        });
      } else {
        // No market data at all
        dashboardTokens.push({
          id: token.id,
          symbol: token.code,
          name: token.name,
          iconUrl: token.icon || `https://icons.dexie.space/${token.id}.webp`,
          priceXch: 0,
          priceUsd: 0,
          change24h: 0,
          change7d: 0,
          volume24hXch: 0,
          volume24hUsd: 0,
          volume7dXch: 0,
          volume7dUsd: 0,
          liquidityXch: 0,
          liquidityUsd: 0,
          high24h: 0,
          low24h: 0,
          pairId: '',
          lastUpdated: new Date().toISOString(),
          hasMarket: false,
          priceSource: 'none',
        });
      }
    }
  }

  // Sort by 7-day volume (high to low), then tokens without markets alphabetically
  dashboardTokens.sort((a, b) => {
    const aHasMarket = a.hasMarket !== false;
    const bHasMarket = b.hasMarket !== false;

    if (aHasMarket && !bHasMarket) return -1;
    if (!aHasMarket && bHasMarket) return 1;
    if (aHasMarket && bHasMarket) return b.volume7dXch - a.volume7dXch;
    return a.symbol.localeCompare(b.symbol);
  });

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
