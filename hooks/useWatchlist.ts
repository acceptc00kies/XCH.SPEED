'use client';

/**
 * useWatchlist Hook
 *
 * React hook for managing token watchlist with localStorage persistence.
 *
 * @module hooks/useWatchlist
 */

import { useState, useCallback, useEffect } from 'react';
import { UseWatchlistResult } from '@/contracts/types';
import {
  loadWatchlist,
  saveWatchlist,
  getWatchedTokenIds,
} from '@/lib/watchlist';

/**
 * Hook for managing token watchlist
 *
 * @returns UseWatchlistResult with watchlist state and actions
 */
export function useWatchlist(): UseWatchlistResult {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = getWatchedTokenIds();
    setWatchlist(stored);
  }, []);

  // Check if a token is in the watchlist
  const isWatched = useCallback(
    (tokenId: string): boolean => {
      return watchlist.includes(tokenId);
    },
    [watchlist]
  );

  // Add token to watchlist
  const addToWatchlist = useCallback((tokenId: string): void => {
    setWatchlist((prev) => {
      if (prev.includes(tokenId)) return prev;

      const newList = [...prev, tokenId];
      saveWatchlist({
        tokenIds: newList,
        lastUpdated: new Date().toISOString(),
      });
      return newList;
    });
  }, []);

  // Remove token from watchlist
  const removeFromWatchlist = useCallback((tokenId: string): void => {
    setWatchlist((prev) => {
      const newList = prev.filter((id) => id !== tokenId);
      saveWatchlist({
        tokenIds: newList,
        lastUpdated: new Date().toISOString(),
      });
      return newList;
    });
  }, []);

  // Toggle token in watchlist
  const toggleWatchlist = useCallback((tokenId: string): void => {
    setWatchlist((prev) => {
      const index = prev.indexOf(tokenId);
      let newList: string[];

      if (index === -1) {
        newList = [...prev, tokenId];
      } else {
        newList = prev.filter((id) => id !== tokenId);
      }

      saveWatchlist({
        tokenIds: newList,
        lastUpdated: new Date().toISOString(),
      });
      return newList;
    });
  }, []);

  // Clear entire watchlist
  const clearWatchlist = useCallback((): void => {
    setWatchlist([]);
    saveWatchlist({
      tokenIds: [],
      lastUpdated: new Date().toISOString(),
    });
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'xch_dashboard_watchlist') {
        const config = loadWatchlist();
        setWatchlist(config?.tokenIds ?? []);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    watchlist,
    isWatched,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
  };
}
