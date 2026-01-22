'use client';

/**
 * useAdvancedFilters Hook
 *
 * React hook for managing advanced filter state and applying filters to token lists.
 *
 * @module hooks/useAdvancedFilters
 */

import { useState, useCallback, useMemo } from 'react';
import {
  AdvancedFilters,
  DashboardToken,
  UseAdvancedFiltersResult,
} from '@/contracts/types';

/**
 * Default filter state (no filters applied)
 */
const DEFAULT_FILTERS: AdvancedFilters = {
  priceRange: undefined,
  volumeRange: undefined,
  changeRange: undefined,
  onlyWatchlist: false,
};

/**
 * Hook for managing advanced token filters
 *
 * @returns UseAdvancedFiltersResult with filter state and actions
 */
export function useAdvancedFilters(): UseAdvancedFiltersResult {
  const [filters, setFilters] = useState<AdvancedFilters>(DEFAULT_FILTERS);

  // Set price range filter
  const setPriceRange = useCallback((min: number, max: number): void => {
    setFilters((prev) => ({
      ...prev,
      priceRange: min === 0 && max === 0 ? undefined : { min, max },
    }));
  }, []);

  // Set volume range filter
  const setVolumeRange = useCallback((min: number, max: number): void => {
    setFilters((prev) => ({
      ...prev,
      volumeRange: min === 0 && max === 0 ? undefined : { min, max },
    }));
  }, []);

  // Set change range filter
  const setChangeRange = useCallback((min: number, max: number): void => {
    setFilters((prev) => ({
      ...prev,
      changeRange: min === 0 && max === 0 ? undefined : { min, max },
    }));
  }, []);

  // Set watchlist-only filter
  const setOnlyWatchlist = useCallback((enabled: boolean): void => {
    setFilters((prev) => ({
      ...prev,
      onlyWatchlist: enabled,
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback((): void => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Apply filters to token array
  const applyFilters = useCallback(
    (tokens: DashboardToken[], watchlist: string[]): DashboardToken[] => {
      return tokens.filter((token) => {
        // Price range filter
        if (filters.priceRange) {
          if (
            token.priceXch < filters.priceRange.min ||
            token.priceXch > filters.priceRange.max
          ) {
            return false;
          }
        }

        // Volume range filter
        if (filters.volumeRange) {
          if (
            token.volume24hXch < filters.volumeRange.min ||
            token.volume24hXch > filters.volumeRange.max
          ) {
            return false;
          }
        }

        // Change range filter (24h change percentage)
        if (filters.changeRange) {
          if (
            token.change24h < filters.changeRange.min ||
            token.change24h > filters.changeRange.max
          ) {
            return false;
          }
        }

        // Watchlist filter
        if (filters.onlyWatchlist) {
          if (!watchlist.includes(token.id)) {
            return false;
          }
        }

        return true;
      });
    },
    [filters]
  );

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.priceRange !== undefined ||
      filters.volumeRange !== undefined ||
      filters.changeRange !== undefined ||
      filters.onlyWatchlist === true
    );
  }, [filters]);

  return {
    filters,
    setPriceRange,
    setVolumeRange,
    setChangeRange,
    setOnlyWatchlist,
    clearFilters,
    applyFilters,
    hasActiveFilters,
  };
}

