/**
 * TibetSwap API Client
 *
 * Fetches price and liquidity data from TibetSwap AMM.
 * Used as secondary price source for tokens not on Dexie orderbook.
 */

import { Result } from '@/contracts/types';

const TIBETSWAP_API = 'https://api.v2.tibetswap.io';

export interface TibetSwapPair {
  pair_id: string;
  asset_id: string;
  asset_name: string;
  asset_short_name: string;
  asset_image_url: string;
  xch_reserve: number;
  token_reserve: number;
  liquidity: number;
}

export interface TibetSwapToken {
  asset_id: string;
  name: string;
  short_name: string;
  verified: boolean;
}

/**
 * Fetch all trading pairs from TibetSwap
 */
export async function fetchTibetSwapPairs(): Promise<Result<TibetSwapPair[]>> {
  try {
    const response = await fetch(`${TIBETSWAP_API}/pairs`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`TibetSwap API error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return { success: false, error: new Error('Invalid TibetSwap response') };
    }

    return { success: true, data };
  } catch (error) {
    console.error('TibetSwap fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Calculate price in XCH per token from reserves
 * TibetSwap reserves are in mojos (1 XCH = 10^12 mojos)
 */
export function calculatePriceFromReserves(
  xchReserve: number,
  tokenReserve: number,
  tokenDenom: number = 1000 // Default denom
): number {
  if (tokenReserve === 0) return 0;

  // Convert mojos to XCH
  const xchInPool = xchReserve / 1e12;
  // Adjust token reserve by denomination
  const tokensInPool = tokenReserve / tokenDenom;

  if (tokensInPool === 0) return 0;

  // Price = XCH per token
  return xchInPool / tokensInPool;
}

/**
 * Calculate liquidity in XCH from reserves
 */
export function calculateLiquidityXch(xchReserve: number): number {
  // XCH reserve in mojos, convert to XCH and multiply by 2 (both sides)
  return (xchReserve / 1e12) * 2;
}

/**
 * Create a map of asset_id to TibetSwap pair data
 */
export function createTibetSwapMap(pairs: TibetSwapPair[]): Map<string, TibetSwapPair> {
  const map = new Map<string, TibetSwapPair>();
  for (const pair of pairs) {
    map.set(pair.asset_id, pair);
  }
  return map;
}
