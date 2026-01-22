/**
 * Dexie API Client
 *
 * Handles all communication with the Dexie DEX API.
 * Implements retry logic and error handling.
 */

import {
  DexieTokenResponse,
  DexieMarketsResponse,
  DexieToken,
  DexieMarket,
  Result,
} from '@/contracts/types';

const DEXIE_BASE_URL = 'https://api.dexie.space/v1';
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;

/**
 * Fetch with timeout and retry logic
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (retries > 0 && error instanceof Error) {
      // Exponential backoff
      const delay = (MAX_RETRIES - retries + 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }

    throw error;
  }
}

/**
 * Fetch all tokens from Dexie API
 *
 * @returns Result containing array of tokens or error
 */
export async function fetchTokens(): Promise<Result<DexieToken[]>> {
  try {
    const response = await fetchWithRetry(`${DEXIE_BASE_URL}/tokens`, {
      next: { revalidate: 30 }, // ISR: revalidate every 30 seconds
    });

    const data: DexieTokenResponse = await response.json();

    if (!data.success || !Array.isArray(data.tokens)) {
      return {
        success: false,
        error: new Error('Invalid response structure from tokens API'),
      };
    }

    // Filter out tokens without essential data
    const validTokens = data.tokens.filter(
      (token) => token.id && token.code && token.name
    );

    return { success: true, data: validTokens };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error fetching tokens'),
    };
  }
}

/**
 * Fetch all market data from Dexie API
 *
 * @returns Result containing array of markets or error
 */
export async function fetchMarkets(): Promise<Result<DexieMarket[]>> {
  try {
    const response = await fetchWithRetry(`${DEXIE_BASE_URL}/markets`, {
      next: { revalidate: 30 }, // ISR: revalidate every 30 seconds
    });

    const data: DexieMarketsResponse = await response.json();

    if (!data.success || !data.markets?.xch || !Array.isArray(data.markets.xch)) {
      return {
        success: false,
        error: new Error('Invalid response structure from markets API'),
      };
    }

    // Filter out markets without essential price data
    const validMarkets = data.markets.xch.filter(
      (market) => market.id && market.prices?.last?.price !== undefined
    );

    return { success: true, data: validMarkets };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error fetching markets'),
    };
  }
}

/**
 * Fetch both tokens and markets in parallel
 *
 * @returns Object containing both results
 */
export async function fetchAllDexieData(): Promise<{
  tokens: Result<DexieToken[]>;
  markets: Result<DexieMarket[]>;
}> {
  const [tokens, markets] = await Promise.all([fetchTokens(), fetchMarkets()]);

  return { tokens, markets };
}
