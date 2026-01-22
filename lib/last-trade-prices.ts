/**
 * Last Trade Prices Fetcher
 *
 * Fetches recent completed offers from Dexie API to get last trade prices
 * for tokens that don't have active markets on Dexie orderbook or TibetSwap.
 */

import { Result } from '@/contracts/types';

const DEXIE_API = 'https://api.dexie.space/v1';

interface DexieOffer {
  id: string;
  status: number;
  offered: Array<{ id: string; code: string; name: string; amount: number }>;
  requested: Array<{ id: string; code: string; name: string; amount: number }>;
  date_completed: string | null;
}

export interface LastTradePrice {
  priceXch: number;
  date: string;
  tokenSymbol: string;
}

/**
 * Fetch recent completed offers and extract last trade prices
 * Returns a Map of tokenId -> LastTradePrice
 */
export async function fetchLastTradePrices(): Promise<Result<Map<string, LastTradePrice>>> {
  try {
    // Fetch recent completed offers (status=4)
    const response = await fetch(
      `${DEXIE_API}/offers?status=4&page_size=200`,
      { next: { revalidate: 60 } } // Cache for 1 minute
    );

    if (!response.ok) {
      throw new Error(`Dexie offers API error: ${response.status}`);
    }

    const data = await response.json();
    const offers: DexieOffer[] = data.offers || [];

    // Build map of most recent trade price per token
    const lastTradePrices = new Map<string, LastTradePrice>();

    for (const offer of offers) {
      if (!offer.date_completed) continue;

      // Find the token and XCH in this offer
      let tokenId: string | null = null;
      let tokenAmount = 0;
      let tokenSymbol = '';
      let xchAmount = 0;

      // Check offered assets
      for (const asset of offer.offered) {
        if (asset.id === 'xch') {
          xchAmount = asset.amount;
        } else {
          tokenId = asset.id;
          tokenAmount = asset.amount;
          tokenSymbol = asset.code || '';
        }
      }

      // Check requested assets
      for (const asset of offer.requested) {
        if (asset.id === 'xch') {
          xchAmount = asset.amount;
        } else {
          tokenId = asset.id;
          tokenAmount = asset.amount;
          tokenSymbol = asset.code || '';
        }
      }

      // Skip if we couldn't determine the trade
      if (!tokenId || tokenAmount === 0 || xchAmount === 0) continue;

      // Calculate price in XCH per token
      const priceXch = xchAmount / tokenAmount;

      // Only store if we don't have a price for this token yet
      // (offers are returned newest first, so first one is most recent)
      if (!lastTradePrices.has(tokenId)) {
        lastTradePrices.set(tokenId, {
          priceXch,
          date: offer.date_completed,
          tokenSymbol,
        });
      }
    }

    return { success: true, data: lastTradePrices };
  } catch (error) {
    console.error('Error fetching last trade prices:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}
