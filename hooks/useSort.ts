'use client';

/**
 * useSort Hook
 *
 * Manages sorting state for token list.
 */

import { useState, useMemo, useCallback } from 'react';
import { DashboardToken, SortConfig, SortField, UseSortResult } from '@/contracts/types';

const DEFAULT_SORT_CONFIG: SortConfig = {
  field: 'volume24hXch',
  direction: 'desc',
};

export function useSort(
  tokens: DashboardToken[],
  initialConfig: SortConfig = DEFAULT_SORT_CONFIG
): UseSortResult {
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialConfig);

  // Sort comparator
  const compareTokens = useCallback(
    (a: DashboardToken, b: DashboardToken): number => {
      const { field, direction } = sortConfig;
      const multiplier = direction === 'asc' ? 1 : -1;

      let aValue: string | number;
      let bValue: string | number;

      switch (field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'symbol':
          aValue = a.symbol.toLowerCase();
          bValue = b.symbol.toLowerCase();
          break;
        case 'priceXch':
          aValue = a.priceXch;
          bValue = b.priceXch;
          break;
        case 'priceUsd':
          aValue = a.priceUsd;
          bValue = b.priceUsd;
          break;
        case 'change24h':
          aValue = a.change24h;
          bValue = b.change24h;
          break;
        case 'change7d':
          aValue = a.change7d;
          bValue = b.change7d;
          break;
        case 'volume24hXch':
          aValue = a.volume24hXch;
          bValue = b.volume24hXch;
          break;
        case 'volume24hUsd':
          aValue = a.volume24hUsd;
          bValue = b.volume24hUsd;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return -1 * multiplier;
      if (aValue > bValue) return 1 * multiplier;
      return 0;
    },
    [sortConfig]
  );

  // Memoized sorted tokens
  const sortedTokens = useMemo(() => {
    return [...tokens].sort(compareTokens);
  }, [tokens, compareTokens]);

  // Set sort field (toggles direction if same field)
  const setSortField = useCallback((field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        // Toggle direction
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      // New field, default to descending for numeric, ascending for text
      const isTextField = field === 'name' || field === 'symbol';
      return {
        field,
        direction: isTextField ? 'asc' : 'desc',
      };
    });
  }, []);

  // Toggle direction
  const toggleDirection = useCallback(() => {
    setSortConfig((prev) => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    sortConfig,
    setSortField,
    toggleDirection,
    sortedTokens,
  };
}
