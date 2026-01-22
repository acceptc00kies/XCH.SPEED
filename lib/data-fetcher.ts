/**
 * Data Fetcher
 *
 * Aggregates all data fetching into a single entry point.
 * Used by both server components and API routes.
 * Merges data from Dexie orderbook and TibetSwap AMM.
 */

import { DashboardData, Result } from '@/contracts/types';
import { fetchAllDexieData } from './dexie-api';
import { fetchTibetSwapPairs } from './tibetswap-api';
import { fetchXchUsdPrice } from './xch-price';
import { mergeTokensAndMarkets } from './transform';

/**
 * Fetch all dashboard data in parallel
 *
 * This is the main entry point for fetching data.
 * It handles all API calls and data transformation.
 * Fetches from Dexie, TibetSwap, and price oracles.
 *
 * @returns Result containing DashboardData or error
 */
export async function fetchDashboardData(): Promise<Result<DashboardData>> {
  try {
    // Fetch all data in parallel
    const [dexieData, tibetSwapResult, xchPriceResult] = await Promise.all([
      fetchAllDexieData(),
      fetchTibetSwapPairs(),
      fetchXchUsdPrice(),
    ]);

    // Check for critical failures
    if (!dexieData.tokens.success) {
      return {
        success: false,
        error: dexieData.tokens.error,
      };
    }

    if (!dexieData.markets.success) {
      return {
        success: false,
        error: dexieData.markets.error,
      };
    }

    // XCH price always succeeds (has fallback)
    const xchPriceUsd = xchPriceResult.success ? xchPriceResult.data : 25;

    // TibetSwap is optional - use empty array if failed
    const tibetSwapPairs = tibetSwapResult.success ? tibetSwapResult.data : [];

    // Transform and merge data from all sources
    const tokens = mergeTokensAndMarkets(
      dexieData.tokens.data,
      dexieData.markets.data,
      xchPriceUsd,
      tibetSwapPairs
    );

    const dashboardData: DashboardData = {
      tokens,
      xchPriceUsd,
      fetchedAt: new Date().toISOString(),
      isStale: false,
    };

    return { success: true, data: dashboardData };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error fetching dashboard data'),
    };
  }
}

/**
 * Fetch dashboard data with fallback to cached/empty state
 *
 * This version never throws and always returns data.
 * Useful for server components where we want to render something.
 */
export async function fetchDashboardDataSafe(): Promise<DashboardData> {
  const result = await fetchDashboardData();

  if (result.success) {
    return result.data;
  }

  // Return empty state on failure
  console.error('Failed to fetch dashboard data:', result.error);

  return {
    tokens: [],
    xchPriceUsd: 25, // Fallback price
    fetchedAt: new Date().toISOString(),
    isStale: true,
  };
}
