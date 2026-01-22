/**
 * XCH/USD Price Fetcher
 *
 * Fetches the current XCH price in USD from multiple sources.
 * Falls back to a cached/default value if all sources fail.
 */

import { Result } from '@/contracts/types';

// Fallback price if all APIs fail (update periodically)
const FALLBACK_XCH_USD = 25.0;

// Cache for XCH price to avoid too many API calls
let cachedPrice: { value: number; timestamp: number } | null = null;
const CACHE_TTL = 60000; // 1 minute cache

/**
 * Fetch XCH price from CoinGecko
 */
async function fetchFromCoinGecko(): Promise<number | null> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=chia&vs_currencies=usd',
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const price = data?.chia?.usd;

    if (typeof price === 'number' && price > 0) {
      return price;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch XCH price from Dexie (if they provide USD rates)
 * This is a backup source
 */
async function fetchFromDexieRates(): Promise<number | null> {
  try {
    const response = await fetch('https://api.dexie.space/v1/prices/xch', {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const price = data?.usd;

    if (typeof price === 'number' && price > 0) {
      return price;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch XCH/USD price with fallback chain
 *
 * Tries multiple sources in order:
 * 1. CoinGecko API
 * 2. Dexie rates API
 * 3. Cached value
 * 4. Fallback constant
 *
 * @returns Result containing USD price
 */
export async function fetchXchUsdPrice(): Promise<Result<number>> {
  // Check cache first
  if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_TTL) {
    return { success: true, data: cachedPrice.value };
  }

  // Try CoinGecko first
  const coinGeckoPrice = await fetchFromCoinGecko();
  if (coinGeckoPrice) {
    cachedPrice = { value: coinGeckoPrice, timestamp: Date.now() };
    return { success: true, data: coinGeckoPrice };
  }

  // Try Dexie rates
  const dexiePrice = await fetchFromDexieRates();
  if (dexiePrice) {
    cachedPrice = { value: dexiePrice, timestamp: Date.now() };
    return { success: true, data: dexiePrice };
  }

  // Use cached value if available (even if expired)
  if (cachedPrice) {
    console.warn('Using expired cached XCH price');
    return { success: true, data: cachedPrice.value };
  }

  // Last resort: use fallback
  console.warn('Using fallback XCH price');
  return { success: true, data: FALLBACK_XCH_USD };
}

/**
 * Get XCH/USD price synchronously from cache
 * Returns fallback if not cached
 */
export function getCachedXchPrice(): number {
  return cachedPrice?.value ?? FALLBACK_XCH_USD;
}
