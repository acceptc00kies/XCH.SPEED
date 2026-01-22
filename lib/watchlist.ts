/**
 * Watchlist Module
 *
 * Manages persistent watchlist storage in localStorage.
 *
 * @module lib/watchlist
 */

import { WatchlistConfig } from '@/contracts/types';

const STORAGE_KEY = 'xch_dashboard_watchlist';

/**
 * Load watchlist from localStorage
 *
 * @returns WatchlistConfig or null if not found
 */
export function loadWatchlist(): WatchlistConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const config = JSON.parse(stored) as WatchlistConfig;

    // Validate structure
    if (!Array.isArray(config.tokenIds)) {
      return null;
    }

    return config;
  } catch {
    return null;
  }
}

/**
 * Save watchlist to localStorage
 *
 * @param config - The watchlist configuration to save
 */
export function saveWatchlist(config: WatchlistConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn('Failed to save watchlist:', error);
  }
}

/**
 * Add a token to the watchlist
 *
 * @param tokenId - The token ID to add
 * @returns Updated watchlist config
 */
export function addToWatchlist(tokenId: string): WatchlistConfig {
  const current = loadWatchlist() || {
    tokenIds: [],
    lastUpdated: new Date().toISOString(),
  };

  if (!current.tokenIds.includes(tokenId)) {
    current.tokenIds.push(tokenId);
    current.lastUpdated = new Date().toISOString();
    saveWatchlist(current);
  }

  return current;
}

/**
 * Remove a token from the watchlist
 *
 * @param tokenId - The token ID to remove
 * @returns Updated watchlist config
 */
export function removeFromWatchlist(tokenId: string): WatchlistConfig {
  const current = loadWatchlist() || {
    tokenIds: [],
    lastUpdated: new Date().toISOString(),
  };

  const index = current.tokenIds.indexOf(tokenId);
  if (index !== -1) {
    current.tokenIds.splice(index, 1);
    current.lastUpdated = new Date().toISOString();
    saveWatchlist(current);
  }

  return current;
}

/**
 * Toggle a token in the watchlist
 *
 * @param tokenId - The token ID to toggle
 * @returns Updated watchlist config and whether token is now watched
 */
export function toggleWatchlistItem(tokenId: string): {
  config: WatchlistConfig;
  isWatched: boolean;
} {
  const current = loadWatchlist() || {
    tokenIds: [],
    lastUpdated: new Date().toISOString(),
  };

  const index = current.tokenIds.indexOf(tokenId);
  const isWatched = index === -1;

  if (isWatched) {
    current.tokenIds.push(tokenId);
  } else {
    current.tokenIds.splice(index, 1);
  }

  current.lastUpdated = new Date().toISOString();
  saveWatchlist(current);

  return { config: current, isWatched };
}

/**
 * Check if a token is in the watchlist
 *
 * @param tokenId - The token ID to check
 * @returns Whether the token is watched
 */
export function isTokenWatched(tokenId: string): boolean {
  const config = loadWatchlist();
  return config?.tokenIds.includes(tokenId) ?? false;
}

/**
 * Get all watched token IDs
 *
 * @returns Array of watched token IDs
 */
export function getWatchedTokenIds(): string[] {
  const config = loadWatchlist();
  return config?.tokenIds ?? [];
}

/**
 * Clear the entire watchlist
 */
export function clearWatchlist(): void {
  const emptyConfig: WatchlistConfig = {
    tokenIds: [],
    lastUpdated: new Date().toISOString(),
  };
  saveWatchlist(emptyConfig);
}

/**
 * Get watchlist statistics
 *
 * @returns Object with watchlist stats
 */
export function getWatchlistStats(): {
  count: number;
  lastUpdated: string | null;
} {
  const config = loadWatchlist();
  return {
    count: config?.tokenIds.length ?? 0,
    lastUpdated: config?.lastUpdated ?? null,
  };
}

/**
 * Import watchlist from JSON string
 *
 * @param jsonString - JSON string of watchlist config
 * @returns Whether import was successful
 */
export function importWatchlist(jsonString: string): boolean {
  try {
    const config = JSON.parse(jsonString) as WatchlistConfig;

    if (!Array.isArray(config.tokenIds)) {
      return false;
    }

    // Validate all token IDs are strings
    if (!config.tokenIds.every((id) => typeof id === 'string')) {
      return false;
    }

    config.lastUpdated = new Date().toISOString();
    saveWatchlist(config);
    return true;
  } catch {
    return false;
  }
}

/**
 * Export watchlist as JSON string
 *
 * @returns JSON string of watchlist config
 */
export function exportWatchlist(): string {
  const config = loadWatchlist() || {
    tokenIds: [],
    lastUpdated: new Date().toISOString(),
  };
  return JSON.stringify(config, null, 2);
}
